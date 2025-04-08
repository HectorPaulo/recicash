import { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../lib/firebase/firebase';

const auth = getAuth(app);
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Suscribirse a los cambios de estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Limpiar la suscripción cuando se desmonta
    return unsubscribe;
  }, []);

  // Los valores que proporcionará el contexto
  const value = {
    currentUser,
    isAuthenticated: !!currentUser
  };

  // No renderizar los hijos hasta que se complete la verificación de autenticación
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}