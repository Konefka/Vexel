import { useState, useEffect } from 'react';
import { useSignalR } from './SignalRContext';

export function useMessages({ conversationId, howMuch = 20, onNewMessage }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const signalR = useSignalR();

  useEffect(() => {
    if (!conversationId) return;

    setMessages([]);
    setHasMore(true);

    async function fetchMessages() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`https://localhost:7159/conversation/${conversationId}/messages`, {
          method: "POST",
          credentials: 'include',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationId, take: howMuch })
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        setMessages(data.messages || []);
        setHasMore(data.hasMore ?? true);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [conversationId, howMuch]);

  useEffect(() => {
    if (!conversationId || !signalR) return;

    const unsubscribe = signalR.subscribe((incomingConversationId, message) => {
      if (incomingConversationId?.toString() !== conversationId?.toString()) return;

      setMessages(prev => {
        const isDuplicate = prev.some(m => m.id === message.id);
        if (isDuplicate) return prev;

        onNewMessage?.(message);

        return [...prev, message];
      });
    });

    return () => unsubscribe();

  }, [conversationId, signalR]);

  const loadMore = async () => {
    if (!hasMore || loading || messages.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const oldestMessage = messages[0];
      const oldestDate = new Date(oldestMessage.dateStamp).toISOString();

      const res = await fetch(`https://localhost:7159/conversation/${conversationId}/messages?take=${howMuch}&before=${oldestDate}`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, take: howMuch, before: oldestDate })
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      if (data.messages && data.messages.length > 0) {
        setMessages(prev => [...data.messages, ...prev]);
        setHasMore(data.hasMore ?? false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more messages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { messages, setMessages, loadMore, loading, hasMore, error };
}