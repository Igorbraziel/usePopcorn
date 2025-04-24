import Movie from "./Movie";

export default function MovieList({ movies, onMovieClick }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onMovieClick={onMovieClick} />
      ))}
    </ul>
  );
}