export async function register(email, password) {
    await fetch("https://localhost:7159/auth/register", { // Takes the data from the endpoint
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(async response => {
        const data = await response.json();
        console.log(data.error || "Zarejestrowano!")
    })
    .catch(err => {
        console.error("Unexpected error:", err);
    });
}

export async function login(email, password) {
    await fetch("https://localhost:7159/auth/login", { // Takes the data from the endpoint
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(async response => {
        const data = await response.json();
        console.log(data.error || "Zalogowano!")
    })
    .catch(err => {
        console.error("Unexpected error:", err);
    });
}

export async function test(email, password) {
    await fetch("https://localhost:7159/auth/test", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(async response => {
        const data = await response.json();
        console.log(data.success)
    })
    .catch(err => {
        console.error("Unexpected test error:", err);
    });
}