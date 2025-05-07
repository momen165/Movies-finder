import { useState } from 'react';
import PropTypes from 'prop-types';

const FilterSort = ({ onFilterChange, onSortChange, currentFilters, currentSort }) => {
    // Local state for form controls
    const [isExpanded, setIsExpanded] = useState(false);

    // Genre options based on TMDB
    const genreOptions = [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Adventure' },
        { id: 16, name: 'Animation' },
        { id: 35, name: 'Comedy' },
        { id: 80, name: 'Crime' },
        { id: 18, name: 'Drama' },
        { id: 14, name: 'Fantasy' },
        { id: 27, name: 'Horror' },
        { id: 10749, name: 'Romance' },
        { id: 878, name: 'Science Fiction' },
        { id: 53, name: 'Thriller' }
    ];

    // Sort options
    const sortOptions = [
        { value: 'popularity.desc', label: 'Popularity (High to Low)' },
        { value: 'popularity.asc', label: 'Popularity (Low to High)' },
        { value: 'vote_average.desc', label: 'Rating (High to Low)' },
        { value: 'vote_average.asc', label: 'Rating (Low to High)' },
        { value: 'release_date.desc', label: 'Release Date (Newest)' },
        { value: 'release_date.asc', label: 'Release Date (Oldest)' },
        { value: 'original_title.asc', label: 'Title (A-Z)' },
        { value: 'original_title.desc', label: 'Title (Z-A)' },
    ];

    const handleGenreChange = (e) => {
        const genreId = parseInt(e.target.value);
        const isChecked = e.target.checked;

        if (isChecked) {
            onFilterChange('with_genres', [...(currentFilters.with_genres || []), genreId]);
        } else {
            onFilterChange('with_genres',
                (currentFilters.with_genres || []).filter(id => id !== genreId));
        }
    };

    const handleYearChange = (e) => {
        const year = e.target.value;
        onFilterChange('year', year ? parseInt(year) : null);
    };

    const handleSortChange = (e) => {
        onSortChange(e.target.value);
    };

    const toggleExpand = () => {
        setIsExpanded(prev => !prev);
    };

    const clearFilters = () => {
        onFilterChange('year', null);
        onFilterChange('with_genres', []);
        onSortChange('popularity.desc');
    };

    // Check if any filters are active
    const hasActiveFilters =
        currentFilters.year ||
        (currentFilters.with_genres && currentFilters.with_genres.length > 0) ||
        currentSort !== 'popularity.desc';

    return (
        <div className="filter-sort" role="region" aria-label="Movie filters">
            <button
                className="filter-toggle"
                onClick={toggleExpand}
                aria-expanded={isExpanded}
                aria-controls="filter-options-panel"
            >
                {isExpanded ? 'Hide Filters' : 'Show Filters'}
                {hasActiveFilters && !isExpanded && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-light-100/20 rounded-full" aria-label="Filters are currently active">
                        Active Filters
                    </span>
                )}
                <span className="icon" aria-hidden="true">{isExpanded ? '▲' : '▼'}</span>
            </button>

            {isExpanded && (
                <div className="filter-options" id="filter-options-panel">
                    <div className="filter-section">
                        <h3 id="sort-heading">Sort By</h3>
                        <select
                            value={currentSort}
                            onChange={handleSortChange}
                            aria-labelledby="sort-heading"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-section">
                        <h3>Release Year</h3>
                        <input
                            type="number"
                            min="1900"
                            max={new Date().getFullYear()}
                            value={currentFilters.year || ''}
                            onChange={handleYearChange}
                            placeholder="Enter year"
                            aria-label="Filter by release year"
                        />
                    </div>

                    <div className="filter-section">
                        <h3>Genres</h3>
                        <div className="genre-options">
                            {genreOptions.map(genre => (
                                <label key={genre.id} className="genre-checkbox">
                                    <input
                                        type="checkbox"
                                        value={genre.id}
                                        checked={(currentFilters.with_genres || []).includes(genre.id)}
                                        onChange={handleGenreChange}
                                    />
                                    {genre.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        className="clear-filters"
                        onClick={clearFilters}
                        disabled={!hasActiveFilters}
                        style={{ opacity: hasActiveFilters ? 1 : 0.5 }}
                    >
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    );
};

FilterSort.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
    onSortChange: PropTypes.func.isRequired,
    currentFilters: PropTypes.object.isRequired,
    currentSort: PropTypes.string.isRequired
};

export default FilterSort;
