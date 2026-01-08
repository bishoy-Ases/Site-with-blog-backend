# AWS Free Tier Configuration Guide

This Terraform configuration has been optimized to operate entirely within AWS Free Tier limits, with minimal paid services.

## Free Tier Resources

### 1. **Lambda** ✅ FREE
- **Limit**: 1,000,000 requests/month + 400,000 GB-seconds compute
- **Usage**: ~5,000 requests/month (typical blog with 150 daily users)
- **Compute**: ~25 GB-seconds/month (256MB memory × ~100 seconds/month)
- **Cost**: **$0.00/month** (well within free tier)

**Configuration**:
```terraform
memory_size = 256  # Reduced from 512MB
timeout     = 15   # Reduced from 30s
```

### 2. **API Gateway** ✅ FREE
- **Limit**: 1,000,000 requests/month
- **Usage**: ~5,000 requests/month
- **Cost**: **$0.00/month** (within free tier)

**Configuration**:
```terraform
# Disabled features that incur costs
xray_tracing_enabled   = false      # No X-Ray tracing charges
cache_cluster_enabled  = false      # No caching charges
log_retention_in_days  = 7          # Reduced from 14 for cost
```

### 3. **RDS PostgreSQL** ✅ FREE
- **Instance**: db.t3.micro (1 vCPU, 1 GB RAM)
- **Storage**: 20 GB (free tier limit)
- **Limit**: 750 hours/month
- **Usage**: ~730 hours/month for small blog
- **Cost**: **$0.00/month** (covers our usage)

**Configuration**:
```terraform
instance_class         = "db.t3.micro"  # Free tier eligible
allocated_storage      = 20             # Free tier limit (GB)
multi_az              = false           # Disabled (saves cost)
performance_insights   = false          # Not free tier eligible
backup_retention_days  = 1              # Minimum retention
storage_encrypted     = true            # Free tier compatible
```

**Database Sizing**:
- Blog posts: ~100 posts × 5 KB = 500 KB
- Comments/metadata: ~50 MB (with growth)
- Total usage: **<1 GB** (plenty of headroom in 20 GB limit)
- Growth runway: Can scale to 1000+ posts before hitting 20 GB limit

### 4. **CloudWatch Logs** ✅ FREE (mostly)
- **Free tier**: 5 GB/month ingestion
- **Our usage**: ~50 MB/month (5,000 API calls × 10 KB/call)
- **Retention**: 7 days (reduced from 14)
- **Cost**: **$0.00-$0.50/month** (ingestion is free, storage minimal)

### 5. **Amplify** ✅ FREE
- **Static hosting**: 15 GB/month bandwidth
- **Build minutes**: 1,000 build minutes/month
- **Cost**: **$0.00/month** (within free tier)

### 6. **Secrets Manager** ⚠️ PAID ($0.40/month)
- **Cost**: $0.40/month per secret
- **Usage**: 1 secret for DB credentials
- **Total Cost**: **$0.40/month** (minimal)

### 7. **VPC Endpoints** ⚠️ PAID ($7.20/month)
- **Type**: Interface endpoint for Secrets Manager
- **Cost**: $7.20/month per endpoint (~$0.24/hour)
- **Usage**: Required for Lambda to access Secrets Manager securely
- **Alternative abandoned**: NAT Gateway was $32/month (not used)
- **Total Cost**: **$7.20/month** (replaces $32 NAT Gateway)

## Monthly Cost Breakdown

| Service | Free Tier | Usage | Cost |
|---------|-----------|-------|------|
| Lambda | 1M requests + 400k GB-s | ~5k requests | $0.00 |
| API Gateway | 1M requests | ~5k requests | $0.00 |
| RDS db.t3.micro | 750 hours | ~730 hours | $0.00 |
| CloudWatch Logs | 5 GB ingestion | ~50 MB | $0.00 |
| Amplify | 15 GB bandwidth | ~1 GB | $0.00 |
| Secrets Manager | - | 1 secret | $0.40 |
| VPC Endpoint | - | 1 endpoint | $7.20 |
| **TOTAL** | - | - | **$7.60/month** |

### Compared to Previous Configuration
- **Before**: ~$55-67/month (Multi-AZ RDS + NAT Gateway + Premium features)
- **After**: ~$7.60/month (Single-AZ RDS + VPC Endpoints)
- **Savings**: ~$47-59/month (**88-89% reduction**)

## Scaling Scenarios

### Scenario 1: 10x Growth (1,500 daily users)
- Lambda: 50,000 requests/month → Still free ($0.90 cost if exceeds, only marginal)
- API Gateway: 50,000 requests/month → Still free
- RDS: Same usage profile → Still free
- **Estimated cost**: $7.60/month (unchanged)

### Scenario 2: 100x Growth (15,000 daily users)
- Lambda: 500,000 requests/month → Still free
- API Gateway: 500,000 requests/month → Still free
- RDS: May need larger instance (db.t3.small ~$30/month)
- **Estimated cost**: $37.60/month (mainly RDS upgrade)

### Scenario 3: Maximum Free Tier (1M Lambda requests/month)
- All services still free except Secrets Manager + VPC Endpoints
- **Estimated cost**: $7.60/month (stable)

## Important Limits & Considerations

### RDS Free Tier Gotchas ⚠️
1. **Multi-AZ disabled**: No automatic failover - acceptable for development/small production
2. **Performance Insights disabled**: No query analysis - use basic CloudWatch instead
3. **Automated backups**: 1 day retention - consider weekly manual snapshots for safety
4. **Storage limit**: 20 GB hard limit - monitor free space monthly

### Lambda Free Tier Gotchas ⚠️
1. **VPC access required**: Adds ~5 second cold start penalty
2. **Memory limited to 256 MB**: Sufficient for blog API, avoid heavy operations
3. **15 second timeout**: Ensure all operations (DB query + response) complete in 15s

### API Gateway Limits ⚠️
1. **No caching enabled**: Every request hits Lambda/RDS
2. **Usage plan in place**: Prevents accidental abuse beyond free tier

## Production Recommendations

### When to Upgrade (Cost-Justified)
1. **>500 daily users**: Consider RDS upgrade to db.t3.small (~$30/month)
2. **>100 blog posts**: Consider S3 for image storage (~$1/month for 10GB)
3. **>5K daily users**: Consider ElastiCache for caching (~$15/month)
4. **Need HA**: Add RDS Multi-AZ (~$50/month additional)

### Monitoring Free Tier Usage
```bash
# Monitor Lambda costs
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Duration \
  --dimensions Name=FunctionName,Value=blog-api-function

# Monitor RDS storage
aws rds describe-db-instances \
  --db-instance-identifier blog-database | jq '.DBInstances[0].AllocatedStorage'

# Monitor CloudWatch logs
aws logs describe-log-groups \
  --log-group-name-prefix "/aws/lambda" \
  --query 'logGroups[].storageSizeInBytes'
```

## Free Tier Expiration

AWS provides 12 months of free tier eligibility from account creation date:
- **RDS**: 750 hours × $0.015 = $11.25/month after free tier
- **Other services**: Minimal additional costs

**Recommendation**: Set calendar reminder for free tier expiration to plan cost management strategy.

## How to Avoid Free Tier Overage

1. **Enable CloudWatch Alarms** for budget alerts
2. **Set up AWS Budgets** with notification at $10/month
3. **Monitor monthly** RDS storage and CloudWatch logs
4. **Review AWS Cost Explorer** monthly
5. **Disable idle resources** (stop Lambda during development pauses)
