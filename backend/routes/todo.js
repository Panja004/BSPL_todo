const express = require('express');
const router = express.Router();
const { getTodos, createTodo, updateTodo, deleteTodo } = require('../controllers/todo');
const auth = require('../middleware/auth');

// All routes are protected by auth middleware
router.use(auth);

// Get all todos with pagination
router.get('/', getTodos);

// Create a new todo
router.post('/', createTodo);

// Update a todo
router.put('/:id', updateTodo);

// Delete a todo
router.delete('/:id', deleteTodo);

module.exports = router; 