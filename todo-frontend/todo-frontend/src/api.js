// Holds all my API calls in one place
const BASE_URL = "http://localhost:5000/api"

const authFetch = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
 
  // Attach access token if we have one
  if (window.__accessToken) {
    headers['Authorization'] = `Bearer ${window.__accessToken}`;
  }
 
  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // sends the httpOnly cookie automatically
  });
 
  // If access token expired, try to refresh it then retry the original request
  if (res.status === 401) {
    const body = await res.json();
    if (body.code === 'TOKEN_EXPIRED') {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry the original request with the new token
        return authFetch(url, options);
      }
    }
    // If refresh failed, send them back to login
    window.__accessToken = null;
    window.location.href = '/';
    return;
  }
 
  return res;
};
 
// call /auth/refresh 
const refreshAccessToken = async () => {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) return false;
    const data = await res.json();
    window.__accessToken = data.accessToken;
    return true;
  } catch {
    return false;
  }
};


// calls
export const register = async (username, password) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type":"application/json"},
        body: JSON.stringify({ username, password })
    })
    return res.json()
};

export const login = async (username, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        credentials: 'include',
        body: JSON.stringify({ username, password })
    })
    const data = await res.json();
    if(data.accessToken) {
        window.__accessToken = data.accessToken; // store token in memory
    }
    return data;
}

export const logout = async () => {
    await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    })
    window.__accessToken = null;
}

export const getTodos = async () => {
    const res = await authFetch(`${BASE_URL}/todos`)
    return res.json()
}

export const addTodos = async (name, category) => {
    const res = await authFetch(`${BASE_URL}/todos`, {
        method: 'POST',
        body: JSON.stringify({name, category})
    })
    return res.json()
}

export const deleteTodo = async (id) => {
    const res = await authFetch(`${BASE_URL}/todos/${id}`, {
        method: "DELETE",
    })
    return res.json()
}

export const toggleTodo = async (id) => {
    const res = await authFetch(`${BASE_URL}/todos/${id}`, {
        method: "PATCH",
    })
    if (!res) return null
    return res.json()
}