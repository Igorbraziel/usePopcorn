import { useEffect, useState } from "react";

import Box from "./components/Box";
import ErrorMessage from "./components/ErrorMessage";
import Loader from "./components/Loader";
import Logo from "./components/Logo";
import MainContent from "./components/MainContent";
import MovieDetails from "./components/MoviesDetails";
import MovieList from "./components/MovieList";
import NavigationBar from "./components/NavigationBar";
import Results from "./components/Results";
import Search from "./components/Search";
import WatchedSummary from "./components/WatchedSummary";
import WatchedList from "./components/WatchedList";

export const KEY = "9954924f";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleMovieClick(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleAddMovieWatched(movie) {
    setWatched([...watched.filter((m) => m.imdbID !== movie.imdbID), movie]);
    setSelectedId(null);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleDeleteWatchedMovie(id) {
    setWatched((watchedMovies) =>
      watchedMovies.filter((movie) => movie.imdbID !== id)
    );
  }

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
      
      handleCloseMovie();
      fetchMovies();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <NavigationBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Results movies={movies} />
      </NavigationBar>

      <MainContent>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onMovieClick={handleMovieClick} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddMovieWatched={handleAddMovieWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                onMovieDelete={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </MainContent>
    </>
  );
}
