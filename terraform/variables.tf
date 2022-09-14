variable "aws_region" {
  description = "AWS region to use"
  type        = string
  default     = "eu-central-1"
}

variable "name" {
  description = "Application name"
  type        = string
  default     = "brotherbot"
}

variable "tag" {
  type    = string
  default = "latest"
}
