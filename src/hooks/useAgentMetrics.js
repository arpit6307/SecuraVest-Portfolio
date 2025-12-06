// src/hooks/useAgentMetrics.js

import { useState, useEffect } from 'react';
// Import the database instance (db) from our firebase setup file
import { db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore';

const useAgentMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Reference the single document in the 'agent_data' collection
        const docRef = doc(db, "agent_data", "main_metrics"); 
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // If the document exists, set the metrics state
          setMetrics(docSnap.data());
        } else {
          // If the document doesn't exist (important for error checking)
          setError("No agent metrics data found in the database.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch metrics data.");
      } finally {
        // Stop loading regardless of success or failure
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Return the data, loading state, and error state
  return { metrics, loading, error };
};

export default useAgentMetrics;