# AWS S3 Setup for WordPress Image Hosting

This guide shows how to configure WordPress to serve images from AWS S3 for faster global delivery.

## Prerequisites
- AWS Account with S3 access
- AWS CLI configured (optional)

## Step 1: Create S3 Bucket

```bash
aws s3 mb s3://your-bucket-name --region eu-north-1
```

Or via AWS Console:
1. Go to S3 Dashboard
2. Click "Create bucket"
3. Name: `your-bucket-name`
4. Region: `eu-north-1` (or your preferred region)
5. Block public access settings: **Unblock** "Block public access"
6. Create bucket

## Step 2: Create IAM User for S3 Access

1. Go to IAM Dashboard
2. Click "Users" → "Create user"
3. Username: `wordpress-s3`
4. Create user
5. Click on the user → "Security credentials" → "Create access key"
6. Choose "Application running outside AWS"
7. Save the Access Key ID and Secret Access Key

## Step 3: Attach S3 Permissions to IAM User

1. In IAM → Users, click on `wordpress-s3`
2. Click "Add permissions" → "Attach policies directly"
3. Search for and select: `AmazonS3FullAccess`
4. Or create a custom policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::your-bucket-name",
                "arn:aws:s3:::your-bucket-name/*"
            ]
        }
    ]
}
```

## Step 4: Configure WordPress

### Option A: Using Environment Variables (Recommended for Docker)

1. Update your `.env` file:

```env
AWS_S3_BUCKET=your-bucket-name
AWS_S3_REGION=eu-north-1
AWS_S3_ACCESS_KEY=your-access-key-id
AWS_S3_SECRET_KEY=your-secret-access-key
```

2. Restart Docker containers:

```bash
docker compose down
docker compose up -d
```

### Option B: Manual Plugin Installation

1. Go to WordPress Admin → Plugins → Add New
2. Search for "WP Offload Media Lite" or "Elementor Uploads Manager"
3. Install and activate
4. Configure with your S3 credentials
5. Enable "Serve from S3"

## Step 5: Configure S3 Bucket Permissions

Add a bucket policy to allow public reads (if serving publicly):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

## Step 6: Enable CloudFront (Optional but Recommended)

CloudFront will cache your images globally for even faster delivery:

1. AWS Console → CloudFront → Create distribution
2. Origin domain: `your-bucket-name.s3.eu-north-1.amazonaws.com`
3. Viewer protocol policy: `Redirect HTTP to HTTPS`
4. Create distribution
5. Update WordPress to serve from CloudFront URL instead of S3 directly

## Step 7: Test Image Upload

1. Go to WordPress Admin → Media → Add New
2. Upload an image
3. Check S3 bucket - the image should appear there
4. Verify image loads from S3 URL: `https://your-bucket-name.s3.eu-north-1.amazonaws.com/wp-content/uploads/year/month/image.jpg`

## Troubleshooting

### Images not uploading to S3
- Check IAM permissions
- Verify access keys are correct
- Check bucket name is correct
- Verify bucket is not blocking public access (if needed)

### 403 Forbidden errors
- Bucket policy may be too restrictive
- IAM user may lack permissions
- Check S3 bucket CORS settings

### CloudFront not working
- Ensure CloudFront distribution is deployed (can take 5-10 minutes)
- Clear WordPress cache after CloudFront setup
- Test with incognito browser

## Cost Considerations

- S3 storage: ~$0.023 per GB/month
- Data transfer out: ~$0.09 per GB (first 10TB/month)
- CloudFront: ~$0.085 per GB (varies by region)

Using CloudFront reduces S3 data transfer costs and improves performance globally.

## References

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [WP Offload Media Lite](https://wordpress.org/plugins/amazon-s3-and-cloudfront/)
- [WordPress Media Library](https://wordpress.org/support/article/media-library-screen/)
