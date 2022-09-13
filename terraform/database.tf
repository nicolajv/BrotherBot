resource "aws_docdb_subnet_group" "db_subnet" {
  name       = "main"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_docdb_cluster_parameter_group" "tls" {
  name   = "${var.name}-tls"
  family = "docdb4.0"
  parameter {
    name  = "tls"
    value = "disabled"
  }
}

resource "aws_docdb_cluster_instance" "cluster_instances" {
  identifier         = var.name
  cluster_identifier = aws_docdb_cluster.docdb_cluster.id
  instance_class     = "db.r5.large"
}

data "aws_ssm_parameter" "db_password" {
  name = "db_password"
}

resource "aws_docdb_cluster" "docdb_cluster" {
  cluster_identifier              = var.name
  master_username                 = var.name
  master_password                 = data.aws_ssm_parameter.db_password.value
  db_subnet_group_name            = aws_docdb_subnet_group.db_subnet.name
  db_cluster_parameter_group_name = aws_docdb_cluster_parameter_group.tls.name
  vpc_security_group_ids = [
    aws_security_group.service.id,
  ]
  skip_final_snapshot = true
}
