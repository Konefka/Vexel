let errorHandler = null;
const domain = import.meta.env.VITE_BACKEND_API_URL;

export function setErrorHandler(functions) {
  errorHandler = functions;
}

export async function setUsername(username) {
  try {
    const response = await fetch(`${domain}/account/setUsername`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({username}) // raw string JSON
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData?.error) return errorData.error;
    }

    return true;

  } catch (err) {
    return "setUsername error: " + err.message;
  }
}