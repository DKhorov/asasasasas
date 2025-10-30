import React, { createContext, useContext, useState, useEffect } from 'react';
const LoadingContext = createContext();
export const useLoading = () => useContext(LoadingContext);
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 500); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, setLoading, initialLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}; 