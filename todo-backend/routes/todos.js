const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const jwt = require("jsonwebtoken");

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]
  if (!token){
    return res.status({
      message: 'No token'
    })
  }
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token'})
  }
}

// Get all todos from a user
router.get("/", auth, async (req, res) => {
  const todos = await Todo.find({ user: req.user.id });
  res.json(todos);
});

// Add todo
router.post("/", auth, async (req, res) => {
  const todo = new Todo({ ...req.body, user: req.user.id });
  await todo.save();
  res.json(todo);
});

// Delete todo
router.delete("/:id", auth, async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Todo deleted" });
});

// Mark as complete
router.patch("/:id", auth, async(req, res) => {
  const todo = await Todo.findById(req.params.id)
  todo.completed = !todo.completed
  await todo.save()
  res.json(todo)
})

module.exports = router;

