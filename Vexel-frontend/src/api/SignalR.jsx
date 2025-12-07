import * as signalR from "@microsoft/signalr";

const BASE_URL = "http://localhost:5155";
let connection = null;

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
    console.log("SignalR połączony");
  } catch (err) {
    console.error("SignalR error: ", err);
  }
}

export async function register(username, email, password) {
  await startConnection();
  return await connection.invoke("Register", username, email, password);
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