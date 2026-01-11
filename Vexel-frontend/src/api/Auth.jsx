let errorHandler = null;

export function setErrorHandler(functions) {
  errorHandler = functions;
}

export async function checkAuth() {
  try {
      const response = await fetch("https://localhost:7159/auth/status", {
      method: "POST",
      credentials: "include"
    });

    const data = await response.json()
    return data.success;
    
  } catch (err) {
    if (errorHandler)
      if (err.toString().includes("TypeError: NetworkError when attempting to fetch resource."))
        errorHandler("Backend server is not running right now. We apologize for the inconvenience");
      else if (err.toString().includes("SyntaxError")) {} else errorHandler(err.toString());
    return false;
  }
}

export async function register(email, password) {
  await fetch("https://localhost:7159/auth/register", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(async response => {
    const data = await response.json();
    console.log(data.error || "Zarejestrowano!")
    window.location.reload();
  })
  .catch(err => {
    console.error("Unexpected register error:", err);
    if (errorHandler) errorHandler(err.toString());
  });
}

export async function login(email, password) {
  await fetch("https://localhost:7159/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(async response => {
    const data = await response.json();
    console.log(data.error || "Zalogowano!")
    window.location.reload();
  })
  .catch(err => {
    console.error("Unexpected login error:", err);
    if (errorHandler) errorHandler(err.toString());
  });
}

export async function logout() {
  await fetch("https://localhost:7159/auth/logout", {
    method: "POST",
    credentials: "include"
  })
  .then(() => {
    window.location.reload();
  })
  .catch(err => {
    console.error("Unexpected logout error:", err);
    if (errorHandler) errorHandler(err.toString());
  });
}