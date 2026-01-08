import * as signalR from "@microsoft/signalr";

const BASE_URL = "http://localhost:5155";
let connection = null;
let errorHandler = null;

export function setErrorHandler(functions) {
  errorHandler = functions;
}

export function createConnection() {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${BASE_URL}/AuthHub`)
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.None)
    .build();

  connection.on("Welcome", (userId) => {
    console.log("Zalogowany user ID:", userId);
  });

  connection.on("ReceiveMessage", ({ userId, message }) => {
    console.log(userId, message);
  });

  return connection;
}

export async function startConnection() {
  if (!connection) await createConnection();
  if (connection.state === "Connected") return;

  try {
    await connection.start();
    console.log("SignalR connected");
  } catch (err) {
    console.error("SignalR error: ", err);
    if (errorHandler) errorHandler(err.toString());
  }
}

export async function register(email, password) {
  await startConnection();
  const result = await connection.invoke("Register", email, password);
  if (result.error) {
    errorHandler(result.error.toString());
  } else {
    saveToken(result.token);
  }
}

export async function login_old(email, password) {
  await startConnection();
  const result = await connection.invoke("Login", email, password);
  if (result.error) {
    // errorHandler(result.error.toString());
    console.log(result.error);
  } else if (result.success) {
    console.log("udało się?");
    await connection.stop();
    await new Promise(resolve => setTimeout(resolve, 2500));
    await startConnection();
    console.log("login reload");
    // window.location.reload();
  } else {
    console.log("nie udało się");
    // saveToken(result.token);
  }
}

export async function logout() {
  await startConnection();
  const result= await connection.invoke("Logout");
  if (!!result) {
    errorHandler(result.error.toString());
  } else {
    removeToken();
  }
}

export function saveToken(token) {
  sessionStorage.setItem("jwt", token);
  console.log("Token reload");
  // window.location.reload();
}

export function getToken() {
  return sessionStorage.getItem("jwt");
}

export function removeToken() {
  sessionStorage.removeItem("jwt");
  window.location.reload();
}