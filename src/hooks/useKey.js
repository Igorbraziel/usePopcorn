import { useEffect } from "react";

export function useKey(key, action){
  useEffect(
    function () {
      const handleKeydownEvent = function (e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          action();
        }
      };
      document.addEventListener("keydown", handleKeydownEvent);

      return () => document.removeEventListener("keydown", handleKeydownEvent);
    },
    [key, action]
  );
}