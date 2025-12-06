import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut 
} from 'firebase/auth';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        // Firebase listener for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        // Cleanup the listener on component unmount
        return () => unsubscribe();
    }, []);

    // Function to handle login
    const login = async (email, password) => {
        setAuthError(null);
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Success handled by onAuthStateChanged listener
        } catch (error) {
            console.error("Login Error:", error);
            // Translate error for better user message
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                setAuthError("Invalid email or password.");
            } else {
                setAuthError("An unexpected error occurred during login.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Function to handle logout
    const logout = async () => {
        try {
            await signOut(auth);
            // Optionally redirect to home or login page after logout
            window.location.pathname = '/'; 
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return { user, loading, authError, login, logout };
};

export default useAuth;