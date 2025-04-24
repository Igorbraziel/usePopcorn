import WatchedMovie from "./WatchedMovie";

export default function WatchedList({ watched, onMovieDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onMovieDelete={() => onMovieDelete(movie.imdbID)}
        />
      ))}
    </ul>
  );
}