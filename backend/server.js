import express, { json } from 'express';
import { verify } from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import cache from 'node-cache';
import { PrismaClient } from '@prisma/client';
const app = express();

const prisma = new PrismaClient();

// Middleware
app.use(json());

// Cache initialization
const productCache = new cache({ stdTTL: 600 }); // 10 minutes TTL

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Products routes
app.get('/api/products', limiter, async (req, res) => {
  try {
    // Check cache first
    const cachedProducts = productCache.get('products');
    if (cachedProducts) {
      return res.json(cachedProducts);
    }

    // Implement pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  
      // Fetch products using Prisma
      const products = await prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });
  

      const total = await prisma.product.count();

      const response = {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        },
      };

    // Cache the response
    productCache.set('products', response);
  
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const { name, price, rating } = req.body;

    // Validation
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const product = await prisma.product.create({
        data: {
          name,
          price,
          rating: rating || null,
        },
      });
  
      // Clear cache
      productCache.del('products');
  
      res.status(201).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.patch('/api/products/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
  
      const product = await prisma.product.update({
        where: { id: parseInt(id) },
        data: updates,
      });
  
      // Clear cache
      productCache.del('products');
  
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
});
  

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
  
      await prisma.product.delete({
        where: { id: parseInt(id) },
      });
  
      // Clear cache
      productCache.del('products');
  
      res.sendStatus(204);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
});
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});