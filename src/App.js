import { useState } from "react";

import Box from "./components/Box";
import ErrorMessage from "./components/ErrorMessage";
import Loader from "./components/Loader";
import Logo from "./components/Logo";
import MainContent from "./components/MainContent";
import MovieDetails from "./components/MovieDetails";
import MovieList from "./components/MovieList";
import NavigationBar from "./components/NavigationBar";
import Results from "./components/Results";
import Search from "./components/Search";
import WatchedSummary from "./components/WatchedSummary";
import WatchedList from "./components/WatchedList";

import { useMovies } from "./hooks/useMovies";
import { useLocalStorageState } from "./hooks/useLocalStorageState";

export const KEY = "9954924f";

export default function App() {
  const [watched, setWatched] = useLocalStorageState([], "watched");
  
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const {movies, isLoading, error} = useMovies(query);

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
