import PropTypes from 'prop-types';

const TrendingMovies = ({ trendingMovies }) => {
  if (!trendingMovies.length) return null;

  return (
    <section className="trending">
      <h2>Trending Movies</h2>
      <ul>
        {trendingMovies.map((movie, index) => (
          <li key={movie.$id}>
            <p>{index + 1}</p>
            <img src={movie.poster_url} alt={movie.title} />
            <p>{movie.title}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

TrendingMovies.propTypes = {
  trendingMovies: PropTypes.array.isRequired
};

export default TrendingMovies;