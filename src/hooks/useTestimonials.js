// src/hooks/useTestimonials.js

import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs, where, limit } from 'firebase/firestore'; 

const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // --- ADVANCED FEATURE: Only fetch reviews marked as 'Approved' ---
        const q = query(
          collection(db, "testimonials"), 
          where("status", "==", "Approved"), // केवल Approved समीक्षाएँ दिखाएँ
          orderBy("order", "asc"), // पुरानी ordering बरकरार
          limit(5) // केवल 5 सबसे अच्छी समीक्षाएँ दिखाएँ
        );
        const querySnapshot = await getDocs(q);
        
        const reviews = [];
        querySnapshot.forEach((doc) => {
          reviews.push({ id: doc.id, ...doc.data() });
        });
        
        setTestimonials(reviews);
      } catch (err) {
        console.error("Error fetching approved testimonials:", err);
        setError("Failed to fetch client testimonials.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return { testimonials, loading, error };
};

export default useTestimonials;