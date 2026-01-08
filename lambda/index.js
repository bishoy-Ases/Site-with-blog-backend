const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');
const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');

// Cache for database connection and credentials
let cachedDb = null;
let cachedCredentials = null;

/**
 * Get database credentials from AWS Systems Manager Parameter Store (FREE TIER)
 */
async function getDbCredentials() {
  if (cachedCredentials) {
    return cachedCredentials;
  }

  const client = new SSMClient({ region: process.env.AWS_REGION || 'us-east-1' });
  
  try {
    // Fetch all database parameters
    const projectName = process.env.PROJECT_NAME || 'ases-blog';
    
    const [hostParam, usernameParam, passwordParam] = await Promise.all([
      client.send(new GetParameterCommand({
        Name: `/${projectName}/database/host`,
        WithDecryption: false
      })),
      client.send(new GetParameterCommand({
        Name: `/${projectName}/database/username`,
        WithDecryption: false
      })),
      client.send(new GetParameterCommand({
        Name: `/${projectName}/database/password`,
        WithDecryption: true  // SecureString parameters need decryption
      }))
    ]);

    cachedCredentials = {
      host: hostParam.Parameter.Value,
      username: usernameParam.Parameter.Value,
      password: passwordParam.Parameter.Value,
      dbname: process.env.DB_NAME || 'ases_blog',
      port: 5432,
    };
    return cachedCredentials;
  } catch (error) {
    console.error('Error retrieving database credentials from Parameter Store:', error);
    throw error;
  }
}

/**
 * Get or create database connection
 */
async function getDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const credentials = await getDbCredentials();
  
  const pool = new Pool({
    host: credentials.host.split(':')[0],
    port: credentials.port,
    database: credentials.dbname,
    user: credentials.username,
    password: credentials.password,
    ssl: {
      rejectUnauthorized: false
    },
    max: 1, // Lambda runs in single-threaded environment
    idleTimeoutMillis: 120000,
    connectionTimeoutMillis: 10000,
  });

  cachedDb = drizzle(pool);
  return cachedDb;
}

/**
 * Import schema dynamically
 */
const schema = require('./schema');

/**
 * CORS headers
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.AMPLIFY_URL || '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
};

/**
 * Create HTTP response
 */
function createResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

/**
 * Blog API Handler
 */
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, {});
  }

  try {
    const db = await getDatabase();
    const { httpMethod, path, pathParameters, body: requestBody } = event;
    const parsedBody = requestBody ? JSON.parse(requestBody) : null;

    // Route: GET /api/blog - Get all published blog posts
    if (httpMethod === 'GET' && path === '/api/blog') {
      const { eq } = require('drizzle-orm');
      const posts = await db
        .select()
        .from(schema.blogPosts)
        .where(eq(schema.blogPosts.published, true))
        .orderBy(schema.blogPosts.createdAt);
      
      return createResponse(200, posts);
    }

    // Route: GET /api/blog/{slug} - Get single blog post by slug
    if (httpMethod === 'GET' && path.startsWith('/api/blog/') && pathParameters?.slug) {
      const { eq } = require('drizzle-orm');
      const [post] = await db
        .select()
        .from(schema.blogPosts)
        .where(eq(schema.blogPosts.slug, pathParameters.slug));
      
      if (!post) {
        return createResponse(404, { message: 'Blog post not found' });
      }

      if (!post.published) {
        return createResponse(404, { message: 'Blog post not found' });
      }

      return createResponse(200, post);
    }

    // Route: GET /api/admin/blog - Get all blog posts (admin)
    if (httpMethod === 'GET' && path === '/api/admin/blog') {
      // TODO: Add authentication check
      const posts = await db
        .select()
        .from(schema.blogPosts)
        .orderBy(schema.blogPosts.createdAt);
      
      return createResponse(200, posts);
    }

    // Route: POST /api/blog - Create new blog post (admin)
    if (httpMethod === 'POST' && path === '/api/blog') {
      // TODO: Add authentication check
      const [newPost] = await db
        .insert(schema.blogPosts)
        .values(parsedBody)
        .returning();
      
      return createResponse(201, newPost);
    }

    // Route: PATCH /api/blog/{id} - Update blog post (admin)
    if (httpMethod === 'PATCH' && path.match(/^\/api\/blog\/\d+$/)) {
      // TODO: Add authentication check
      const id = parseInt(path.split('/').pop());
      const { eq } = require('drizzle-orm');
      const [updated] = await db
        .update(schema.blogPosts)
        .set(parsedBody)
        .where(eq(schema.blogPosts.id, id))
        .returning();
      
      if (!updated) {
        return createResponse(404, { message: 'Blog post not found' });
      }

      return createResponse(200, updated);
    }

    // Route: DELETE /api/blog/{id} - Delete blog post (admin)
    if (httpMethod === 'DELETE' && path.match(/^\/api\/blog\/\d+$/)) {
      // TODO: Add authentication check
      const id = parseInt(path.split('/').pop());
      const { eq } = require('drizzle-orm');
      const result = await db
        .delete(schema.blogPosts)
        .where(eq(schema.blogPosts.id, id))
        .returning();
      
      if (result.length === 0) {
        return createResponse(404, { message: 'Blog post not found' });
      }

      return createResponse(204, {});
    }

    // No matching route
    return createResponse(404, { message: 'Not found' });

  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, { 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
