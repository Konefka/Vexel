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
    .build();

  return connection;
}

export async function startConnection() {
  if (!connection) createConnection();
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

export async function login(email, password) {
  await startConnection();
  const result = await connection.invoke("Login", email, password);
  if (result.error) {
    errorHandler(result.error.toString());
  } else {
    saveToken(result.token);
  }
}

export function saveToken(token) {
  sessionStorage.setItem("jwt", token);
  console.log("Token saved");
  window.location.reload();
}

export function getToken() {
  return sessionStorage.getItem("jwt");
}

export function removeToken() {
  sessionStorage.removeItem("jwt");
}