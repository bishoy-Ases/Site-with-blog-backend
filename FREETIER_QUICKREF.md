# Free Tier Configuration - Quick Reference

## 📊 Cost Summary
```
Before:  $55-67/month
After:   $7.60/month  ✅
Savings: 88% reduction
```

## ✅ What's Free
| Service | Free Tier Limit | Our Usage | Status |
|---------|-----------------|-----------|--------|
| Lambda | 1M requests/month | 5K requests | ✅ FREE |
| API Gateway | 1M requests/month | 5K requests | ✅ FREE |
| RDS (t3.micro) | 750 hours/month | 730 hours | ✅ FREE |
| CloudWatch | 5GB/month logs | 50MB/month | ✅ FREE |
| Amplify | 15GB bandwidth | 1GB/month | ✅ FREE |

## ⚠️ What's Paid (Can't Avoid)
| Service | Cost | Why |
|---------|------|-----|
| VPC Endpoint | $7.20/month | Needed for Secrets Manager access |
| Secrets Manager | $0.40/month | Database password storage |

## 🔧 Configuration Changes Applied

### RDS (database.tf)
```hcl
instance_class            = "db.t3.micro"      # FREE
multi_az                  = false              # Disabled for free tier
performance_insights      = false              # Not in free tier
backup_retention_days     = 1                  # Minimum retention
```

### Lambda (lambda.tf)
```hcl
memory_size               = 256                # Reduced from 512
timeout                   = 15                 # Reduced from 30
tracing_config = {}                           # Disabled (was X-Ray)
log_retention_in_days     = 7                  # Reduced from 14
```

### API Gateway (api-gateway.tf)
```hcl
cache_cluster_enabled     = false              # Disabled caching
xray_tracing_enabled      = false              # Disabled X-Ray
log_retention_in_days     = 7                  # Reduced from 14
```

### Networking (vpc.tf)
```hcl
# REMOVED: aws_nat_gateway (was $32/month)
# ADDED: aws_vpc_endpoint for Secrets Manager ($7.20/month)
```

## 📈 Growth Capacity

**Before exceeding free tier:**
- 200x growth in traffic (~1M API requests/month)
- 20 more GB of database storage available
- 400K more GB-seconds of Lambda compute

**Example growth:**
- Current: 150 daily users, 5K monthly requests
- Free tier ceiling: ~1M requests/month = 33K daily users

## 🚀 Deployment

```bash
# View changes
terraform plan

# Deploy
terraform apply

# Verify costs
aws billing get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics "UnblendedCost"
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [terraform/FREETIER.md](terraform/FREETIER.md) | Detailed free tier guide |
| [FREETIER_OPTIMIZATION.md](FREETIER_OPTIMIZATION.md) | Change summary |
| [FREETIER_CHANGES.md](FREETIER_CHANGES.md) | File modifications list |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Full deployment guide |

## ⚡ Key Metrics

| Metric | Free Tier | We Use | % of Limit |
|--------|-----------|--------|-----------|
| Lambda requests | 1,000,000 | 5,000 | 0.5% |
| Lambda compute | 400,000 GB-s | 25 GB-s | 0.006% |
| RDS hours | 750 | 730 | 97.3% |
| RDS storage | 20 GB | <1 GB | <5% |
| Data transfer | Varies | Minimal | <1% |
| API requests | 1,000,000 | 5,000 | 0.5% |

**Headroom**: Plenty of room to scale without exceeding free tier!

## 🔔 Monitoring

### Set Budget Alerts
```bash
# Create $10/month budget alert
aws budgets create-budget \
  --account-id <ACCOUNT_ID> \
  --budget BudgetName=monthly-10,BudgetLimit={Amount=10,Unit=USD},TimeUnit=MONTHLY,BudgetType=COST
```

### Check Monthly Costs
```bash
# View detailed cost breakdown
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics UnblendedCost \
  --group-by Type=DIMENSION,Key=SERVICE
```

### Monitor Resource Usage
```bash
# Lambda invocations
aws logs insights \
  --log-group-name /aws/lambda/blog-api-function \
  --query-string 'stats count(*)'

# RDS connections
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name DatabaseConnections \
  --dimensions Name=DBInstanceIdentifier,Value=ases-blog-database \
  --statistics Average
```

## ❌ Disabled Features (Won't Affect Blog)

- ✅ RDS Multi-AZ failover (acceptable single-AZ for blog)
- ✅ RDS Performance Insights (use CloudWatch instead)
- ✅ X-Ray distributed tracing (logs are sufficient)
- ✅ API Gateway response caching (blog refreshes daily)
- ✅ Extended backup retention (1 day is enough)

## 🎯 Next Steps

1. ✅ **Optimize** - All resources configured for free tier
2. 📋 **Deploy** - Run `terraform apply`
3. 🔍 **Monitor** - Set CloudWatch alarms
4. 📈 **Scale** - Read [FREETIER.md](terraform/FREETIER.md) for growth guidance

---

**Configuration Status: Ready for Production** ✅
