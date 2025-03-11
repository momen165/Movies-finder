import { useState } from 'react'
import PropTypes from 'prop-types'

const MovieCard = ({
    movie,
    onSelectMovie,
    isFavorite = false,
    onToggleFavorite
}) => {
    const { id, title, vote_average, poster_path, release_date, original_language } = movie
    const [imageError, setImageError] = useState(false)

    const handleFavoriteClick = (e) => {
        e.stopPropagation() // Prevent card click event from triggering
        onToggleFavorite(movie)
    }

    const handleImageError = () => {
        setImageError(true)
    }

    const posterUrl = poster_path && !imageError
        ? `https://image.tmdb.org/t/p/w500/${poster_path}`
        : 'https://placehold.co/500x750?text=No+Poster'

    return (
        <div
            className="movie-card"
            onClick={() => onSelectMovie && onSelectMovie(id)}
        >
            <div className="poster-container">
                <img
                    src={posterUrl}
                    alt={title}
                    onError={handleImageError}
                />

                {onToggleFavorite && (
                    <button
                        className={`favorite-btn ${isFavorite ? 'is-favorite' : ''}`}
                        onClick={handleFavoriteClick}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path
                                fill={isFavorite ? "#ff0000" : "none"}
                                stroke={isFavorite ? "#ff0000" : "#ffffff"}
                                strokeWidth="2"
                                d="M12,21.35L10.55,20.03C5.4,15.36 2,12.28 2,8.5C2,5.42 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.09C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.42 22,8.5C22,12.28 18.6,15.36 13.45,20.03L12,21.35Z"
                            />
                        </svg>
                    </button>
                )}
            </div>

            <div className="movie-info">
                <h3 className="movie-title">{title}</h3>
                <div className="movie-meta">
                    <div className="rating">
                        <img src="star.svg" alt="rating" />
                        <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                    </div>
                    <span className="separator">•</span>
                    <p className="lang">{original_language}</p>
                    <span className="separator">•</span>
                    <p className="year">
                        {release_date ? release_date.split('-')[0] : 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    )
}

MovieCard.propTypes = {
    movie: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        vote_average: PropTypes.number,
        poster_path: PropTypes.string,
        release_date: PropTypes.string,
        original_language: PropTypes.string.isRequired
    }).isRequired,
    onSelectMovie: PropTypes.func,
    isFavorite: PropTypes.bool,
    onToggleFavorite: PropTypes.func
}

export default MovieCard