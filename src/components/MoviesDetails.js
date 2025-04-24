import { useState, useEffect } from "react";
import StarRatings from "./StarRatings";
import Loader from "./Loader";
import { KEY } from "../App";

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddMovieWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isAlreadyRated = watched.map((wm) => wm.imdbID).includes(selectedId);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useEffect(
    function () {
      const handleKeydownEvent = function (e) {
        if (e.code === "Escape") {
          onCloseMovie();
        }
      };
      document.addEventListener("keydown", handleKeydownEvent);

      return () => document.removeEventListener("keydown", handleKeydownEvent);
    },
    [onCloseMovie]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `MOVIE: ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  useEffect(
    function () {
      async function fetchMovieById() {
        setIsLoading(true);
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );

        const data = await response.json();
        setMovie(data);
        setIsLoading(false);
      }

      fetchMovieById();
    },
    [selectedId]
  );

  function handleAdd() {
    onAddMovieWatched({
      imdbID: selectedId,
      Title: title,
      Year: year,
      Poster: poster,
      runtime: Number(runtime.split(" ")[0]),
      imdbRating: Number(imdbRating),
      userRating: userRating,
    });
  }

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`}></img>
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb Rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isAlreadyRated ? (
                <>
                  <StarRatings maxRating={10} onSetRating={setUserRating} />
                  {userRating !== null && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add To List
                    </button>
                  )}
                </>
              ) : (
                <p>
                  {`You rated this movie with ${
                    watched.find((m) => m.imdbID === selectedId)?.userRating
                  }`}{" "}
                  <span>⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>
              Starring: <strong>{actors}</strong>
            </p>
            <p>
              Directed by: <strong>{director}</strong>
            </p>
          </section>
        </>
      )}
    </div>
  );
}
