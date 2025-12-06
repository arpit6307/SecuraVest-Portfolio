// src/hooks/useTeamAgents.js

import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore'; 

const useTeamAgents = () => {
  const [teamAgents, setTeamAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamAgents = async () => {
      try {
        // Fetch agents, ordered by policies (highest first)
        const q = query(
          collection(db, "team_agents"), 
          orderBy("policies", "desc") 
        );
        const querySnapshot = await getDocs(q);
        
        const agents = [];
        querySnapshot.forEach((doc) => {
          agents.push({ id: doc.id, ...doc.data() });
        });
        
        // Use mock data as fallback if DB returns empty
        if (agents.length === 0) {
             console.warn("No data in team_agents. Using mock data for display.");
             // Fallback mock data with working URLs (assuming these are placed in /public folder)
             agents.push(
                { id: 1, name: "Arjun Sharma (Mock)", title: "Top Performer", policies: 120, img: "/vite.svg" },
                { id: 2, name: "Priya Verma (Mock)", title: "Rising Star", policies: 85, img: "/vite.svg" }
             );
        }
        
        setTeamAgents(agents);

      } catch (err) {
        console.error("Error fetching team agents:", err);
        setError("Failed to fetch team data.");
        // Use placeholder images if DB fails completely to prevent 404 errors
        setTeamAgents([
            { id: 1, name: "Placeholder Agent 1", title: "Fallback", policies: 0, img: "/vite.svg" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamAgents();
  }, []);

  return { teamAgents, loading, error };
};

export default useTeamAgents;