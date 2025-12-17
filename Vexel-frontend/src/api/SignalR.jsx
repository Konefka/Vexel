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
  return await connection.invoke("Register", email, password);
}

export async function login(email, password) {
  await startConnection();
  return await connection.invoke("Login", email, password);
}

export function saveToken(token) {
  sessionStorage.setItem("jwt", token);
  alert("Udało się! Zapisano token!");
}

export function getToken() {
  return sessionStorage.getItem("jwt");
}

export function removeToken() {
  sessionStorage.removeItem("jwt");
}