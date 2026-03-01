import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos")
    return saved ? JSON.parse(saved) : []
  })
  const [input, setInput] = useState("")
  const [options, setOptions] = useState([])

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  },  [todos]) // whenever todos list change, save it to localstorage
  
  const addTodo =()=>{
    if(input=="") return // refuse added empty tasks
    setTodos([...todos, { id: Date.now(), text: input, completed: false }])
    setInput("") // clear input
  }

  const deleteTodo = (id) =>{
    // Filtering out the task to be deleted and setting it out
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => {
      todo.id === id ? {...todo, completed: !todo.completed } : todo // if id doesn't match, just return the original task
    }))
  }

  const addOption = () => {
      if(input=="") return
      setOptions([...options, {id: Date.now(), text: input}])
      setInput("")
  }

  return (
    // Add drop down for type
    <>
      <div className="search-group">
        <input
          type="text"
          placeholder="Add task"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <select id="select-group">
          <option>option 1</option>
        </select>
        <button onClick={addTodo}>Add</button>
      </div>
      <input
        type="text"
        placeholder="Add a category"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={addOption}>Add category</button>

      <div className="todo-list">
        {todos.map(todo => (
          <div key={todo.id} className="todo-item">
            <p 
              style={{textDecoration: todo.completed ? "line-through" : "none"}}
              onClick={() => toggleComplete(todo.id)}>
              {todo.text}
            </p>
            <button onClick={() => deleteTodo(todo.id)}>🗑️</button>
          </div>
        ))}
      </div>
    </>
  )
}

export default App
