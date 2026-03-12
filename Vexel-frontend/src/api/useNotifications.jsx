import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignalR } from "./SignalRContext";

import hashSymbol from "/src/assets/svg/hash.svg";

export function useNotifications(conversations) {
  const { subscribe, activeConversationRef } = useSignalR();
  const navigate = useNavigate();

  useEffect(() => {

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    const unsubscribe = subscribe((conversationId, message) => {

      if (conversationId === activeConversationRef.current) return;
      if (!("Notification" in window) || Notification.permission !== "granted") return;

      const conversation = conversations.find(c => c.id === conversationId);
      const conversationName = conversation?.name ?? "Nowa wiadomość";

      const notification = new Notification(conversationName, {
        body: `${message.senderName}: ${message.text}`,
        icon: hashSymbol,
        tag: `conversation-${conversationId}`,
      });

      notification.onclick = () => {
        window.focus();
        navigate(`/dashboard/messages/${conversationId}`);
      };
    });

    return () => unsubscribe();
  }, [conversations, subscribe, activeConversationRef]);
}