// Holds all my API calls in one place
const BASE_URL = "http://localhost:5000/api"
const getToken = () => localStorage.getItem("token")

export const register = async (username, password) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type":"application/json"},
        body: JSON.stringify({ username, password })
    })
    return res.json()
}

export const login = async (username, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, password })
    })
    return res.json()
}

export const getTodos = async () => {
    const res = await fetch(`${BASE_URL}/todos`, {
        method: 'GET',
        headers: { "Authorization":`Bearer ${getToken()}`}
    })
    return res.json()
}

export const addTodos = async (name, category) => {
    const res = await fetch(`${BASE_URL}/todos`, {
        method: 'POST',
        headers: { 
            "Content-Type":"application/json",
            "Authorization":`Bearer ${getToken()}`
        },
        body: JSON.stringify({name, category})
    })
    return res.json()
}

export const deleteTodo = async (id) => {
    const res = await fetch(`${BASE_URL}/todos/${id}`, {
        method: "DELETE",
        headers: {"Authorization":`Bearer ${getToken()}`}
    })
    return res.json()
}

export const toggleTodo = async (id) => {
    const res = await fetch(`${BASE_URL}/todos/${id}`, {
        method: "PATCH",
        headers: {"Authorization":`Bearer ${getToken()}`}
    })
    return res.json()
}