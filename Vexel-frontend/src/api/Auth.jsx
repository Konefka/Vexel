export async function login(email, password) {
    const response = await fetch("https://localhost:7159/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Login failed");
    }

    const text = await response.text();
    if (!text) {
        console.log("Brak body, ale request OK");
        return;
    }

    const data = JSON.parse(text);

    if (data.success) {
        console.log("udało się, w końcu!");
    }
}
