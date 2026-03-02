import { useState, useEffect } from 'react'
import { login, register, addTodos, getTodos, deleteTodo, toggleTodo} from './api'
import './App.css'

function App() {
  const [input, setInput] = useState("")
  const [todos, setTodos] = useState([])
  const [categoryInput, setCategoryInput] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [isRegistering, setIsRegistering] = useState(false)
 
  useEffect(() => {
    if(token) {
      fetchTodos()
    }
  }, [token])

  const fetchTodos = async () => {
    const data = await getTodos()
    setTodos(data)
  }

  const handleLogin = async () => {
    const data = await login(username, password)
    if (data.token) {
      localStorage.setItem("token", data.token)
      setToken(data.token)
    } else {
      alert(data.message)
    }
  }

  const handleRegister = async () => {
    const data = await register(username, password)
    alert(data.message)
    setIsRegistering(false)
  }
  
  const handleAddTodo = async () => {
    if(input === "") return
    const newTodo = await addTodos(input, "General")
    console.log(newTodo)
    setTodos([...todos, newTodo])
    setInput("")
  }

  const handleDelete = async (id) => {
    await deleteTodo(id)
    setTodos(todos.filter(todo => todo._id !== id))
  }

  const handleToggle = async (id) => {
    const updated = await toggleTodo(id)
    setTodos(todos.map(todo => todo._id === id ? updated : todo))
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setTodos([])
  }

  if (!token) {
    // show login screen
    return (
      <div className="auth-container">
        <h1>{isRegistering ? "Register" : "Login"}</h1>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        {isRegistering ? (
          <>
            <button onClick={handleRegister}>Register</button>
            <p onClick={() => setIsRegistering(false)}>Already have an account? Login</p>
          </>
        ) : (
          <>
            <button onClick={handleLogin}>Login</button>
            <p onClick={() => setIsRegistering(true)}>Don't have an account? Register</p>
          </>
        )}
      </div>
    )
  }
  return (
    // Add drop down for type
    <>
      <button onClick={handleLogout}>Logout</button>
      <div className="search-group">
        <input
          type="text"
          placeholder="Add task"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      
      <div className="todo-list">
        {todos.map(todo => (
          <div key={todo._id} className="todo-item">
            <p 
              style={{textDecoration: todo.completed ? "line-through" : "none"}}
              onClick={() => handleToggle(todo._id)}>
              {todo.name}
            </p>
            <button onClick={() => handleDelete(todo._id)}>🗑️</button>
          </div>
        ))}
      </div>
    </>
  )
  
}

export default App

/*
<input
  type="text"
  placeholder="Add a category"
  value={categoryInput}
  onChange={(e) => setInput(e.target.value)}
/>
<button onClick={addOption}>Add category</button>
*/