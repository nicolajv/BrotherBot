data "aws_ssm_parameter" "discord_token" {
  name = "DISCORD_TOKEN"
}

data "aws_ssm_parameter" "youtube_token" {
  name = "YOUTUBE_TOKEN"
}

data "aws_ssm_parameter" "language" {
  name = "LANGUAGE"
}

data "aws_ssm_parameter" "dockerhub" {
  name = "dockerhub"
}

resource "aws_cloudwatch_log_group" "logs" {
  name = "/ecs/${var.name}"
}

resource "aws_iam_role" "execution_role" {
  name               = "${var.name}-execution-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json

  inline_policy {
    name = "secrets_policy"

    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Effect : "Allow",
          Action = [
            "secretsmanager:GetSecretValue"
          ]
          Resource = data.aws_ssm_parameter.dockerhub.value
        },
      ]
    })
  }
}

data "aws_iam_policy_document" "ecs_task_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

data "aws_iam_policy" "ecs_task_execution_role" {
  arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role" {
  role       = aws_iam_role.execution_role.name
  policy_arn = data.aws_iam_policy.ecs_task_execution_role.arn
}

resource "aws_lb_target_group" "lb" {
  name        = var.name
  port        = 3000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = module.vpc.vpc_id

  health_check {
    matcher  = "200,301,302"
    path     = "/health"
    interval = 120
    timeout  = 30
    enabled  = true
  }

  depends_on = [aws_alb.alb]
}

resource "aws_alb" "alb" {
  name               = "${var.name}-lb"
  internal           = false
  load_balancer_type = "application"
  subnets            = module.vpc.private_subnets

  security_groups = [
    aws_security_group.service.id,
  ]
}

resource "aws_alb_listener" "listener" {
  load_balancer_arn = aws_alb.alb.arn
  port              = "3000"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.lb.arn
  }
}

output "alb_url" {
  value = "http://${aws_alb.alb.dns_name}"
}

resource "aws_ecs_cluster" "cluster" {
  name = var.name
}

resource "aws_ecs_task_definition" "task" {
  family = var.name

  execution_role_arn = aws_iam_role.execution_role.arn

  container_definitions = <<EOF
  [
    {
      "name": "${var.name}",
      "image": "registry.hub.docker.com/nicolajv/brotherbotv2:latest",
      "repositoryCredentials": {
        "credentialsParameter": "${data.aws_ssm_parameter.dockerhub.value}"
      },
      "portMappings": [
        {
          "containerPort": 3000
        }
      ],
      "environment": [
        {
          "name": "DISCORD_TOKEN",
          "value": "${data.aws_ssm_parameter.discord_token.value}"
        },
        {
          "name": "YOUTUBE_TOKEN",
          "value": "${data.aws_ssm_parameter.youtube_token.value}"
        },
        {
          "name": "LANGUAGE",
          "value": "${data.aws_ssm_parameter.language.value}"
        },
        {
          "name": "DATABASE_ENDPOINT",
          "value": "mongodb://${var.name}:${data.aws_ssm_parameter.db_password.value}@${aws_docdb_cluster_instance.cluster_instances.endpoint}:27017/?retryWrites=false"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-region": "eu-central-1",
          "awslogs-group": "/ecs/${var.name}",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
  EOF

  cpu                      = 256
  memory                   = 512
  requires_compatibilities = ["FARGATE"]

  network_mode = "awsvpc"
}

resource "aws_ecs_service" "service" {
  name            = var.name
  task_definition = aws_ecs_task_definition.task.arn
  cluster         = aws_ecs_cluster.cluster.id
  launch_type     = "FARGATE"
  desired_count   = 1
  network_configuration {
    assign_public_ip = false
    security_groups  = [aws_security_group.service.id]
    subnets          = module.vpc.private_subnets
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.lb.arn
    container_name   = var.name
    container_port   = "3000"
  }
}
