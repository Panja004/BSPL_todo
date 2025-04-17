// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const Todo = require("./models/Todo");
const authRoutes = require("./routes/auth");
const auth = require("./middleware/auth");

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(cookieParser());
app.use(bodyParser.json());

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
};

// Input validation middleware
const validateTodoInput = (req, res, next) => {
  // If we're only updating the checked status, skip title validation
  if (req.body.hasOwnProperty('checked') && Object.keys(req.body).length === 1) {
    return next();
  }
  
  // Otherwise, validate title for create/update operations
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: "Title is required" });
  }
  next();
};

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    // Start server only after successful database connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);

// Create Todo
app.post("/api/todos", [auth, validateTodoInput], async (req, res) => {
  try {
    const { title, description } = req.body;
    const todo = await Todo.create({ 
      title, 
      description,
      date: new Date(),
      user: req.user.userId
    });
    res.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// Get Todos with Pagination
app.get("/api/todos", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    
    const [todos, total] = await Promise.all([
      Todo.find({ user: req.user.userId })
        .skip(skip)
        .limit(limit)
        .sort({ date: -1 }),
      Todo.countDocuments({ user: req.user.userId })
    ]);
    
    res.json({ 
      todos,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Fetch todos error:', error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// Get Single Todo
app.get("/api/todos/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.userId
    });
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
  } catch (error) {
    console.error('Fetch todo error:', error);
    res.status(500).json({ error: "Failed to fetch todo" });
  }
});

// Update Todo
app.put("/api/todos/:id", [auth, validateTodoInput], async (req, res) => {
  try {
    const { title, description, checked } = req.body;
    const updateData = {};
    
    // Only include fields that are present in the request
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (checked !== undefined) updateData.checked = checked;

    const updated = await Todo.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId
      },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(updated);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// Delete Todo
app.delete("/api/todos/:id", auth, async (req, res) => {
  try {
    const deleted = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });
    if (!deleted) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// Use error handling middleware
app.use(errorHandler);
