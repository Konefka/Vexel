import { useState, useEffect } from 'react';

const domain = import.meta.env.VITE_BACKEND_API_URL;

export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [convLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchConversations() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${domain}/conversation/list`, {
          method: "POST",
          credentials: 'include',
          headers: { "Content-Type": "application/json" }
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setConversations(data.conversations || data || []);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();
  }, []);

  return { conversations, convLoading, error };
}