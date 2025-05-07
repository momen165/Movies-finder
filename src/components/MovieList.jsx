import PropTypes from 'prop-types';
import MovieCard from './MovieCard';
import Spinner from './Spinner';
import FilterSort from './FilterSort';
import PaginationControls from './PaginationControls';

const MovieList = ({
  isLoading,
  errorMessage,
  movieList,
  handleSelectMovie,
  isFavorite,
  toggleFavorite,
  debouncedSearchTerm,
  filters,
  sortOption,
  handleFilterChange,
  handleSortChange,
  currentPage,
  totalPages,
  setCurrentPage,
  scrollToTop
}) => {
  return (
    <section className="all-movies">
      <h2>All Movies</h2>

      {!debouncedSearchTerm && (
        <FilterSort
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          currentFilters={filters}
          currentSort={sortOption}
        />
      )}

      {isLoading ? (
        <Spinner />
      ) : errorMessage ? (
        <p className="text-red-500">{errorMessage}</p>
      ) : (
        <>
          <ul>
            {movieList.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelectMovie={handleSelectMovie}
                isFavorite={isFavorite(movie.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </ul>
          <PaginationControls 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            scrollToTop={scrollToTop}
          />
        </>
      )}
    </section>
  );
};

MovieList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  movieList: PropTypes.array.isRequired,
  handleSelectMovie: PropTypes.func.isRequired,
  isFavorite: PropTypes.func.isRequired,
  toggleFavorite: PropTypes.func.isRequired,
  debouncedSearchTerm: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  sortOption: PropTypes.string.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  handleSortChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  scrollToTop: PropTypes.func.isRequired
};

export default MovieList;