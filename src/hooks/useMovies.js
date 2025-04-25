import { useState, useEffect } from "react";

const KEY = "9954924f";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      async function fetchMovies() {
        let response;
        try {
          setIsLoading(true);
          setError("");

          response = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!response || !response.ok) {
            throw new Error("Something went wrong with fetching movies");
          }

          const data = await response.json();

          if (data.Response === "False") {
            throw new Error("Movie Not Found");
          }

          setMovies(data.Search);
        } catch (err) {
          if (err.name === "AbortError") return;
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  return {movies, isLoading, error};
}
