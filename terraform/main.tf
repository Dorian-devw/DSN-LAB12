provider "aws" {
  region = "us-east-1"
}

# 1. VPC Configuration (Using Default VPC for AWS Educate simplicity)
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# 2. Database (RDS PostgreSQL)
resource "aws_db_instance" "postgres" {
  identifier           = "goleate-db"
  engine               = "postgres"
  engine_version       = "16"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  username             = "root"
  password             = "rootpassword123" # In prod, use Secrets Manager
  skip_final_snapshot  = true
  publicly_accessible  = false
  vpc_security_group_ids = [aws_security_group.db_sg.id]
}

# 3. Cache (ElastiCache Redis)
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "goleate-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  port                 = 6379
  security_group_ids   = [aws_security_group.redis_sg.id]
}

# 4. ECR Repositories (To store our Docker Images)
resource "aws_ecr_repository" "backend" {
  name = "goleate-backend"
}

resource "aws_ecr_repository" "frontend" {
  name = "goleate-frontend"
}

# 5. ECS Cluster
resource "aws_ecs_cluster" "goleate_cluster" {
  name = "goleate-cluster"
}

# 6. Load Balancer (ALB)
resource "aws_lb" "main" {
  name               = "goleate-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = data.aws_subnets.default.ids
}

# Security Groups
resource "aws_security_group" "alb_sg" {
  name   = "goleate-alb-sg"
  vpc_id = data.aws_vpc.default.id
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "db_sg" {
  name   = "goleate-db-sg"
  vpc_id = data.aws_vpc.default.id
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Limit this in prod
  }
}

resource "aws_security_group" "redis_sg" {
  name   = "goleate-redis-sg"
  vpc_id = data.aws_vpc.default.id
  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
