# AWS Infrastructure for Ases Kahraba Blog Backend

This directory contains Terraform configurations to deploy the blog backend infrastructure on AWS.

## 🏗️ Architecture

- **VPC**: Custom VPC with public and private subnets across multiple AZs
- **RDS PostgreSQL**: Managed database for blog data storage
- **Lambda**: Serverless compute for API endpoints
- **API Gateway**: REST API endpoint with CORS support
- **Secrets Manager**: Secure storage for database credentials
- **CloudWatch**: Logging and monitoring

## 📋 Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Terraform** v1.0+ installed
4. **Node.js** 20+ for Lambda function

## 🚀 Deployment Steps

### 1. Configure Variables

Create a `terraform.tfvars` file:

```hcl
aws_region           = "us-east-1"
environment          = "prod"
project_name         = "ases-blog"
db_password          = "your-secure-password-here"
amplify_frontend_url = "https://your-app.amplifyapp.com"
```

### 2. Build Lambda Package

```bash
cd ..
chmod +x scripts/build-lambda.sh
./scripts/build-lambda.sh
```

This creates `lambda-package.zip` with your Lambda function and dependencies.

### 3. Initialize Terraform

```bash
cd terraform
terraform init
```

### 4. Review Infrastructure Plan

```bash
terraform plan
```

### 5. Deploy Infrastructure

```bash
terraform apply
```

Type `yes` to confirm and deploy.

### 6. Get Outputs

After deployment, get important values:

```bash
terraform output
```

Save the **API Gateway URL** - you'll need this for your Amplify frontend.

### 7. Initialize Database Schema

After deployment, you need to create the database tables:

```bash
# SSH into a temporary EC2 instance in the same VPC or use AWS Systems Manager
# Then run Drizzle migrations against the RDS endpoint
```

Or use a migration Lambda function (recommended for production).

## 🔧 Configuration

### Database Migration Script

Create `lambda/migrate.js`:

```javascript
const { drizzle } = require('drizzle-orm/node-postgres');
const { migrate } = require('drizzle-orm/node-postgres/migrator');
const { Pool } = require('pg');

async function runMigrations() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);
  await migrate(db, { migrationsFolder: './migrations' });
  await pool.end();
}

exports.handler = async () => {
  await runMigrations();
  return { statusCode: 200, body: 'Migrations complete' };
};
```

### Environment Variables

The Lambda function receives these environment variables:

- `NODE_ENV`: Environment (prod/dev)
- `DB_SECRET_ARN`: ARN of Secrets Manager secret with DB credentials
- `AWS_REGION`: AWS region

### Update Amplify Frontend

Update your Amplify app's environment variables:

```bash
VITE_API_URL=https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/prod
```

## 💰 Cost Estimate

**Monthly costs (approximate):**

- RDS db.t3.micro: ~$15-20/month
- Lambda (1M requests): ~$0.20/month
- API Gateway (1M requests): ~$3.50/month
- NAT Gateway: ~$32/month
- Data Transfer: Variable
- **Total: ~$50-60/month**

### Cost Optimization Tips

1. **Remove NAT Gateway** if Lambda doesn't need internet access (use VPC Endpoints)
2. **Use Aurora Serverless v2** for better scaling ($0.12/ACU-hour)
3. **Enable RDS auto-scaling** for storage
4. **Use Lambda@Edge** to cache API responses at CloudFront

## 🔒 Security

### Database Security
- RDS is in private subnets (not publicly accessible)
- Security groups restrict access to Lambda only
- Credentials stored in AWS Secrets Manager
- SSL/TLS encryption in transit
- Encryption at rest enabled

### API Security
- CORS configured for Amplify domain only
- API Gateway throttling enabled (100 req/sec)
- CloudWatch logging enabled
- X-Ray tracing for debugging

### TODO: Add Authentication
The Lambda function currently has TODO comments for authentication. Implement:
- AWS Cognito for user authentication
- API Gateway authorizers
- JWT token validation

## 📊 Monitoring

### CloudWatch Dashboards

View logs:
```bash
aws logs tail /aws/lambda/ases-blog-api --follow
aws logs tail /aws/apigateway/ases-blog --follow
```

### Alarms

Terraform creates CloudWatch alarms for:
- RDS CPU > 80%
- RDS storage < 5GB

Add SNS topic for notifications:
```hcl
# In database.tf, update alarm_actions
alarm_actions = [aws_sns_topic.alerts.arn]
```

## 🔄 Updates

### Update Lambda Code

1. Make changes to `lambda/` files
2. Rebuild package: `./scripts/build-lambda.sh`
3. Apply changes: `terraform apply`

### Update Infrastructure

```bash
terraform plan
terraform apply
```

## 🗑️ Cleanup

To destroy all resources:

```bash
terraform destroy
```

**Warning**: This will delete the database! Make backups first.

## 📚 Resources

- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [RDS PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)
- [API Gateway](https://docs.aws.amazon.com/apigateway/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)

## 🆘 Troubleshooting

### Lambda timeout errors
- Increase `lambda_timeout` variable
- Check RDS connection (security groups)
- Verify NAT Gateway is working

### Database connection errors
- Verify Lambda is in VPC with RDS access
- Check security group rules
- Verify Secrets Manager permissions

### CORS errors
- Update `amplify_frontend_url` variable
- Redeploy API Gateway stage

## 🎯 Next Steps

1. **Add Authentication**: Integrate AWS Cognito
2. **Add CDN**: CloudFront distribution for API caching
3. **Add Custom Domain**: Route53 + ACM certificate
4. **Add Monitoring**: Enhanced CloudWatch dashboards
5. **Add CI/CD**: GitHub Actions for automated deployments
