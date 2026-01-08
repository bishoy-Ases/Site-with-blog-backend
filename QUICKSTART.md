# ⚡ Quick Start - AWS Deployment

Deploy your blog backend to AWS in 5 steps!

## Prerequisites Checklist

- [ ] AWS Account with admin access
- [ ] AWS CLI installed (`aws --version`)
- [ ] Terraform installed (`terraform --version`)
- [ ] Node.js 20+ installed (`node --version`)

## 🚀 5-Minute Setup

### 1. Configure AWS

```bash
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1)
```

### 2. Set Variables

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars  # Update db_password and amplify_frontend_url
```

### 3. Build Lambda

```bash
cd ..
chmod +x scripts/build-lambda.sh
./scripts/build-lambda.sh
```

### 4. Deploy

```bash
cd terraform
terraform init
terraform apply  # Type 'yes' when prompted
```

⏱️ Takes ~12 minutes

### 5. Get API URL

```bash
terraform output api_gateway_url
# Copy this URL and add to Amplify environment variables as VITE_API_URL
```

## ✅ Verify

```bash
API_URL=$(terraform output -raw api_gateway_url)
curl $API_URL/api/blog
# Should return: []
```

## 🎯 Next: Initialize Database

```bash
# Connect to RDS and create tables (see DEPLOYMENT.md)
```

## 📊 Costs

~$55-67/month for full stack or ~$20/month optimized

See [DEPLOYMENT.md](DEPLOYMENT.md) for cost breakdown and optimization.

## 🆘 Issues?

- **Lambda timeout**: Check CloudWatch logs: `aws logs tail /aws/lambda/ases-blog-api --follow`
- **502 errors**: Verify security groups allow Lambda → RDS (port 5432)
- **CORS errors**: Update `amplify_frontend_url` in terraform.tfvars

## 📚 Full Documentation

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete step-by-step guide.

---

**Questions?** Check the troubleshooting section in DEPLOYMENT.md
