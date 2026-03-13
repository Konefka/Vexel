import { createContext, useContext, useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";

const domain = import.meta.env.VITE_BACKEND_API_URL;
const SignalRContext = createContext(null);

export function SignalRProvider({ children }) {

  const connectionRef = useRef(null);
  const listenersRef = useRef(new Set());
  const activeConversationRef = useRef(null);

  useEffect(() => {

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${domain}/messageHub`, {
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveMessage", (conversationId, message) => {
      listenersRef.current.forEach(listener => listener(conversationId, message));
    });

    connection
      .start()
      .then(() => console.log("SignalR: połączono z hubem"))
      .catch(err => console.error("SignalR: błąd połączenia:", err));

    connectionRef.current = connection;

    return () => {
      connection.stop();
    };

  }, []);

  const sendMessage = async (conversationId, text) => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      await connectionRef.current.invoke("SendMessage", conversationId, text);
    }
  };

  const subscribe = (callback) => {
    listenersRef.current.add(callback);
    return () => listenersRef.current.delete(callback);
  };

  const setActiveConversation = (conversationId) => {
    activeConversationRef.current = conversationId;
  };

  return (
    <SignalRContext.Provider value={{ 
      sendMessage, 
      subscribe, 
      setActiveConversation,
      activeConversationRef
    }}>
      {children}
    </SignalRContext.Provider>
  );
}

export function useSignalR() {
  return useContext(SignalRContext);
}