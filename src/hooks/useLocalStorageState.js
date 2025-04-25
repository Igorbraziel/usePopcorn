import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, storedKey){
  const [value, setValue] = useState(function(){
    const stored = localStorage.getItem(storedKey)
    return stored ? JSON.parse(stored) : initialState;
  });

  useEffect(function(){
    localStorage.setItem(storedKey, JSON.stringify(value));
  }, [value, storedKey]);

  return [value, setValue];
}