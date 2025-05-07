import PropTypes from 'prop-types';
import Spinner from './Spinner';

const MovieDetailsModal = ({ 
  isModalOpen, 
  selectedMovie, 
  movieDetails, 
  isLoadingDetails, 
  closeModal 
}) => {
  if (!isModalOpen || !selectedMovie) return null;

  return (
    <div className="movie-details-modal" onClick={closeModal}>
      <div className="movie-details-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={closeModal}>×</button>

        {isLoadingDetails ? (
          <div className="p-8 flex flex-col items-center justify-center">
            <Spinner />
            <p className="mt-4 text-light-200">Loading movie details...</p>
          </div>
        ) : movieDetails ? (
          <div className="movie-details-header">
            <img
              className="movie-poster"
              src={movieDetails.poster_path
                ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
                : '/no-poster.png'
              }
              alt={movieDetails.title}
            />

            <div className="movie-info">
              <h2>{movieDetails.title}</h2>

              {movieDetails.tagline && (
                <div className="tagline">{movieDetails.tagline}</div>
              )}

              <div className="movie-meta">
                {movieDetails.release_date && (
                  <span className="year">{new Date(movieDetails.release_date).getFullYear()}</span>
                )}
                {movieDetails.release_date && movieDetails.runtime && (
                  <span className="separator">•</span>
                )}
                {movieDetails.runtime && (
                  <span className="runtime">{movieDetails.runtime} mins</span>
                )}
                {movieDetails.runtime && movieDetails.vote_average && (
                  <span className="separator">•</span>
                )}
                {movieDetails.vote_average && (
                  <div className="rating">
                    <img src="/star.svg" alt="rating" />
                    <p>{movieDetails.vote_average?.toFixed(1) || 'N/A'}</p>
                  </div>
                )}
              </div>

              {movieDetails.genres && movieDetails.genres.length > 0 && (
                <div className="genres">
                  {movieDetails.genres.map(genre => (
                    <span key={genre.id} className="genre-tag">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="overview">
                <h3 className="text-xl font-bold text-white mb-2">Overview</h3>
                <p className="text-light-200 leading-relaxed">{movieDetails.overview || 'No overview available'}</p>
              </div>

              {movieDetails.credits && movieDetails.credits.cast && movieDetails.credits.cast.length > 0 && (
                <div className="cast">
                  <h3 className="text-xl font-bold text-white mb-2">Cast</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {movieDetails.credits.cast
                      .slice(0, 5)
                      .map((person, index, array) => (
                        <span key={person.id} className="text-light-200">
                          {person.name}
                          {index < array.length - 1 && ', '}
                        </span>
                      ))
                    }
                  </div>
                </div>
              )}

              {movieDetails.videos &&
                movieDetails.videos.results &&
                movieDetails.videos.results.length > 0 && (() => {
                  // Filter official trailers
                  const officialTrailer = movieDetails.videos.results.find(
                    (video) => video.type === "Trailer" && video.site === "YouTube"
                  );

                  // If no official trailer, pick the first available video
                  const selectedVideo = officialTrailer || movieDetails.videos.results[0];

                  return selectedVideo ? (
                    <div className="trailer-container">
                      <h3 className="text-xl font-bold text-white mb-4">Trailer</h3>
                      <iframe
                        className="rounded-lg w-full aspect-video"
                        src={`https://www.youtube.com/embed/${selectedVideo.key}`}
                        title={selectedVideo.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : null;
                })()}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-light-200">
            Failed to load movie details
          </div>
        )}
      </div>
    </div>
  );
};

MovieDetailsModal.propTypes = {
  isModalOpen: PropTypes.bool,
  selectedMovie: PropTypes.object,
  movieDetails: PropTypes.object,
  isLoadingDetails: PropTypes.bool,
  closeModal: PropTypes.func
};

export default MovieDetailsModal;