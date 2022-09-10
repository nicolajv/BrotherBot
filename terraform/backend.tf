terraform {
  required_version = ">= 1.0"

  backend "s3" {
    bucket = "brotherbot-terraform"
    key    = "brotherbot"
    region = "eu-central-1"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.22"
    }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      application = "${var.name}"
    }
  }
}
