const average = (arr) => {
  return (
    arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0) /
    arr.length
  );
};

export default function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating)) || 0;
  const avgUserRating = average(watched.map((movie) => movie.userRating)) || 0;
  const avgRuntime = average(watched.map((movie) => movie.runtime)) || 0;

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(1)} min</span>
        </p>
      </div>
    </div>
  );
}