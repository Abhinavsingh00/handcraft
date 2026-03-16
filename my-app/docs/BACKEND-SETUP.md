# Backend Setup Guide - Supabase Integration

This guide provides step-by-step instructions for setting up Supabase as the backend for your React application.

## Prerequisites

Before you begin, ensure you have the following:

1. **Node.js** (v16 or higher) installed
2. **npm** or **yarn** package manager
3. **Git** installed
4. **Supabase Account** (sign up at [supabase.com](https://supabase.com) if needed)
5. **Google Drive** account for product images
6. **Basic knowledge** of SQL and environment variables

---

## Step 1: Create Supabase Project

### 1.1 Create a New Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Project Name**: `music-store` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose a region close to your target audience
   - **Organization**: Select your organization
5. Click "Create new project"

### 1.2 Wait for Project Setup

The project creation may take a few minutes. You'll see:
- "Setting up" phase
- "Your database is ready!" when complete

### 1.3 Add an Organization (if needed)

If prompted to add an organization:
1. Click "Create new organization"
2. Enter organization name
3. Click "Create organization"

---

## Step 2: Get Project Credentials

### 2.1 Navigate to Project Settings

1. In your Supabase dashboard, select your project
2. Go to **Project Settings** (gear icon in bottom left)
3. Scroll to **API** section

### 2.2 Copy Connection Details

From the API section, copy these values:

1. **Project URL**:
   ```
   https://your-project-ref.supabase.co
   ```

2. **anon** public key:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **service_role** service role key:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 2.3 Store Credentials Securely

Keep these credentials safe. You'll need them for environment variables.

---

## Step 3: Configure Environment Variables

### 3.1 Create Environment Files

Create environment files in your React project root:

**`.env.local`** (for development):
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# API Endpoints (your Next.js API)
VITE_API_BASE_URL=http://localhost:3000/api
```

**`.env.production`** (for production):
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# API Endpoints (your production API)
VITE_API_BASE_URL=https://yourdomain.com/api
```

### 3.2 Replace Placeholders

Replace the placeholder values with your actual Supabase credentials.

### 3.3 Add Environment Files to `.gitignore`

Ensure `.env.local` and `.env.production` are in your `.gitignore` file:
```
# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local
```

---

## Step 4: Run Database Migration

### 4.1 Access SQL Editor

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**

### 4.2 Run Migration Script

Copy and paste the following migration script:

```sql
-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  brand TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);

-- Create demo categories
INSERT INTO products (name, description, price, image_url, category, brand) VALUES
('Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 199.99, 'https://drive.google.com/uc?export=download&id=1ABC123', 'Electronics', 'TechBrand'),
('Bluetooth Speaker', 'Portable Bluetooth speaker with 12-hour battery life', 79.99, 'https://drive.google.com/uc?export=download&id=2DEF456', 'Electronics', 'AudioPro'),
('Gaming Keyboard', 'Mechanical keyboard with RGB lighting', 129.99, 'https://drive.google.com/uc?export=download&id=3GHI789', 'Gaming', 'GameGear'),
('Smartphone Case', 'Durable protective case for smartphones', 24.99, 'https://drive.google.com/uc?export=download&id=4JKL012', 'Accessories', 'SafePhone'),
('Laptop Stand', 'Adjustable aluminum laptop stand', 49.99, 'https://drive.google.com/uc?export=download&id=5MNO345', 'Accessories', 'DeskPro');

-- Enable RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON products
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON products
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON products
    FOR DELETE USING (auth.role() = 'authenticated');
```

### 4.3 Execute Migration

1. Click **Run**
2. Confirm with **Run** again

You should see "Query successful" if everything worked.

---

## Step 5: Seed Products

### 5.1 Verify Data

After running the migration:

1. Go to **Table Editor** in Supabase
2. Select the **products** table
3. Verify that 5 demo products were inserted

### 5.2 Update Product Images (Optional)

If you have your own images:

1. Upload images to Google Drive
2. Get shareable links
3. Update the `image_url` in the products table using SQL Editor:

```sql
-- Update product images with your Google Drive links
UPDATE products
SET image_url = 'https://drive.google.com/uc?export=download&id=YOUR_IMAGE_ID'
WHERE id = 'YOUR_PRODUCT_UUID';
```

---

## Step 6: Verify Setup

### 6.1 Check Database Tables

1. Go to **Table Editor** in Supabase
2. Confirm the `products` table exists and has data

### 6.2 Test API Connection

Create a test endpoint to verify connection:

1. In your React project, create `src/lib/test-supabase.js`:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1)

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}
```

2. Test in browser console:
```javascript
// Replace with your test function
const result = await testConnection()
console.log(result)
```

### 6.3 Check Environment Variables

Verify your environment variables are loaded:
```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY)
```

---

## Toggling Between Mock and Supabase

### Using Environment Variable to Toggle

In your API code, use environment variables to switch between mock and real data:

```javascript
// In your API routes
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'

export async function GET(request) {
  if (USE_MOCK_DATA) {
    // Return mock data
    return Response.json(mockProducts)
  }

  // Return real data from Supabase
  const { data } = await supabase.from('products').select()
  return Response.json(data)
}
```

### Update Environment Files

**`.env.local`** for Supabase:
```env
VITE_USE_MOCK_DATA=false
```

**`.env.local`** for Mock data (temporarily):
```env
VITE_USE_MOCK_DATA=true
```

---

## Troubleshooting

### Common Issues

#### 1. "Connection Error: Failed to connect to Supabase"

**Solution**:
- Verify your Supabase URL is correct
- Check that your anon key is properly copied
- Ensure no extra spaces in environment variables
- Confirm your project is ready in Supabase dashboard

#### 2. "No 'Access-Control-Allow-Origin' header"

**Solution**:
- This should be handled by Supabase CORS settings
- Check your Supabase project settings → Configuration → CORS
- Add your local development URL:
  ```
  http://localhost:3000
  ```

#### 3. "Database permission denied"

**Solution**:
- Ensure RLS policies are correctly set
- Check you're using the anon key for client operations
- Verify user is authenticated for protected operations

#### 4. Environment variables not loading

**Solution**:
- Restart your development server after changing `.env` files
- Verify file names are correct (`.env.local`, not `.env`)
- Check for syntax errors in environment files

#### 5. CORS issues in production

**Solution**:
- Update Supabase CORS settings to include your production domain
- Ensure you're using the correct environment file in production

### Debug Steps

1. **Check Network Tab**:
   - Open browser DevTools
   - Check Network tab for API calls
   - Look for error responses

2. **Console Logging**:
   - Add console.log statements to track data flow
   - Log environment variables to confirm they're loaded

3. **Supabase Logs**:
   - Check Supabase dashboard → Analytics → Logs
   - Look for error messages related to your queries

---

## Next Steps

### 1. Implement Authentication

Set up Supabase Auth for user authentication:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, key)

// Sign up
const { user, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// Sign in
const { session, error } = await supabase.auth.signIn({
  email: 'user@example.com',
  password: 'password123'
})
```

### 2. Create CRUD Operations

Implement full CRUD operations for products:
```javascript
// Create product
const { data, error } = await supabase
  .from('products')
  .insert([{
    name: 'New Product',
    price: 99.99,
    category: 'Electronics'
  }])

// Update product
const { data, error } = await supabase
  .from('products')
  .update({ price: 89.99 })
  .eq('id', 'product-id')

// Delete product
const { error } = await supabase
  .from('products')
  .delete()
  .eq('id', 'product-id')
```

### 3. Add Real-time Features

Enable real-time updates:
```javascript
// Subscribe to product changes
supabase
  .from('products')
  .on('INSERT', payload => {
    console.log('New product:', payload.new)
  })
  .subscribe()
```

### 4. Implement Image Upload

Add file upload to Supabase Storage:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, key)

// Upload image
const { data, error } = await supabase.storage
  .from('product-images')
  .upload('folder/image.jpg', file)
```

---

## Production Deployment

### 1. Update Production Environment

Create `.env.production` with production values:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-key
VITE_API_BASE_URL=https://yourdomain.com/api
VITE_USE_MOCK_DATA=false
```

### 2. Configure Supabase for Production

1. Update CORS settings in Supabase:
   - Add your production domain
   - Remove localhost (optional)

2. Set up authentication providers in Supabase:
   - Go to Authentication → Providers
   - Enable Google, GitHub, etc.

3. Configure storage buckets:
   - Create storage for product images
   - Set appropriate permissions

### 3. Deploy Your Application

Use your preferred deployment method:
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod
```

### 4. Monitor Production Setup

1. Check that all environment variables are loaded
2. Verify API calls work in production
3. Monitor Supabase usage and logs
4. Set up error tracking (optional)

---

## Summary

You've successfully set up Supabase as the backend for your React application! The setup includes:

- ✅ Supabase project created
- ✅ Database tables and data seeded
- ✅ Environment variables configured
- ✅ API endpoints ready
- ✅ Documentation created

Your application now has a real database backend ready for production use. The mock data option provides a fallback during development, and the Supabase integration provides scalability and real-time features.

For additional features and optimizations, refer to the "Next Steps" section above.