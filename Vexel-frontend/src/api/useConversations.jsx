import { useState, useEffect } from 'react';

export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchConversations() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('https://localhost:7159/conversation/list', {
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

  return { conversations, loading, error };
}