// src/hooks/useProducts.js

import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, getDocs, orderBy, addDoc } from 'firebase/firestore'; 

// Comprehensive LIC Plan List (Same as before)
const MOCK_PRODUCTS = [
    // 1. ENDOWMENT/SAVINGS PLANS
    { policy_name: "LIC Jeevan Anand (915)", tagline: "Lifetime cover with lump sum maturity benefit.", min_age: 18, max_age: 50, key_features: ["Savings", "Endowment", "Whole Life", "Tax Benefit"], is_featured: true },
    { policy_name: "LIC Jeevan Labh (936)", tagline: "Limited premium payment, participating plan with high returns.", min_age: 8, max_age: 59, key_features: ["Savings", "Limited Premium", "Tax Benefit"], is_featured: true },
    { policy_name: "LIC Bima Jyoti (860)", tagline: "Non-participating, guaranteed additions and savings.", min_age: 0, max_age: 60, key_features: ["Savings", "Guaranteed Payout", "Tax Benefit"], is_featured: false },
    { policy_name: "LIC Jeevan Azad (868)", tagline: "Limited premium-paying endowment plan with protection and savings.", min_age: 0, max_age: 65, key_features: ["Savings", "Limited Premium"], is_featured: false },

    // 2. WHOLE LIFE PLANS
    { policy_name: "LIC Jeevan Umang (945)", tagline: "8% of Sum Assured as survival benefit every year for life.", min_age: 0, max_age: 55, key_features: ["Whole Life", "Guaranteed Payout", "Savings", "Retirement Plans"], is_featured: true },
    { policy_name: "LIC Jeevan Utsav (871)", tagline: "Guaranteed annual 10% payout after premium term for life.", min_age: 0, max_age: 65, key_features: ["Whole Life", "Guaranteed Payout", "Savings"], is_featured: false },

    // 3. TERM INSURANCE (PROTECTION)
    { policy_name: "LIC New Tech-Term (954)", tagline: "Pure risk coverage, available online with special rates for women.", min_age: 18, max_age: 65, key_features: ["Term Insurance", "Pure Protection", "Tax Benefit"], is_featured: true },
    { policy_name: "LIC New Jeevan Amar (955)", tagline: "Pure risk, non-linked, offline plan with flexible sum assured options.", min_age: 18, max_age: 65, key_features: ["Term Insurance", "Pure Protection"], is_featured: false },
    { policy_name: "LIC Saral Jeevan Bima (859)", tagline: "Standardized term plan for simple, affordable protection.", min_age: 18, max_age: 65, key_features: ["Term Insurance", "Pure Protection"], is_featured: false },

    // 4. RETIREMENT / PENSION PLANS
    { policy_name: "LIC New Jeevan Shanti (858)", tagline: "Single premium, deferred annuity plan for lifelong pension.", min_age: 30, max_age: 79, key_features: ["Retirement Plans", "Guaranteed Payout", "Annuity"], is_featured: true },
    { policy_name: "LIC Jeevan Akshay-VII (857)", tagline: "Immediate annuity plan with 10 payout options.", min_age: 30, max_age: 85, key_features: ["Retirement Plans", "Guaranteed Payout", "Annuity"], is_featured: false },
    
    // 5. CHILD PLANS
    { policy_name: "LIC New Children's Money Back (932)", tagline: "Periodic money back benefits aligned with child's education milestones.", min_age: 0, max_age: 12, key_features: ["Child Plans", "Money Back", "Savings"], is_featured: false },
    { policy_name: "LIC Jeevan Tarun (934)", tagline: "Protection and savings plan for child's higher education.", min_age: 0, max_age: 12, key_features: ["Child Plans", "Savings"], is_featured: false },

    // 6. ULIP/MARKET LINKED
    { policy_name: "LIC Index Plus (873)", tagline: "ULIP plan that combines insurance and market-linked savings.", min_age: 0, max_age: 60, key_features: ["ULIP", "Investment Plan", "Wealth Creation"], is_featured: false },
];

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollectionRef = collection(db, "products");
        const q = query(
          productsCollectionRef, 
          orderBy("policy_name", "asc") 
        );
        const querySnapshot = await getDocs(q);
        
        const fetchedProducts = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() });
        });
        
        // --- SEEDING LOGIC: If DB is empty, use mock data and push it to Firebase ---
        if (fetchedProducts.length === 0) {
             console.warn("No data in products collection. Seeding Firebase with mock data.");
             
             // 1. Add mock data to Firebase
             const addPromises = MOCK_PRODUCTS.map(product => addDoc(productsCollectionRef, product));
             await Promise.all(addPromises);
             
             // 2. Re-fetch the newly added data to update state
             const seededSnapshot = await getDocs(query(productsCollectionRef, orderBy("policy_name", "asc")));
             const seededProducts = seededSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

             setProducts(seededProducts);
             
             // Ab Admin Dashboard aur Products Page dono me data aa jayega.
        } else {
             // If data exists in Firebase, use it directly
             setProducts(fetchedProducts);
        }

      } catch (err) {
        console.error("Error fetching or seeding products:", err);
        setError("Failed to fetch product data. Check Firebase connection/rules.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); 

  return { products, loading, error };
};

export default useProducts;