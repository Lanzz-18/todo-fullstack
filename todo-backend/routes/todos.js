const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const { protect } = require("../middleware/auth");

// Get all todos from a user
router.get("/", protect, async (req, res, next) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
  } catch (err) {
    next(err);
  }
 });

// Add todo
router.post("/", protect, async (req, res, next) => {
  try {
    const todo = new Todo({ ...req.body, user: req.user.id });
    await todo.save();
    res.json(todo);
  } catch (err) {
    next(err);
  }
});

// Delete todo
router.delete("/:id", protect, async (req, res, next) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted" });
  } catch (err) {
    next(err);
  }
});

// Mark as complete
router.patch("/:id", protect, async(req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id)
    if (!todo) {
      return res.status(404).json({
        message: "Todo not found"
      });
    }
    todo.completed = !todo.completed
    await todo.save()
    res.status(200).json(todo)
  } catch (err) {
    next(err);
  }
})

module.exports = router;

