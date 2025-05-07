import { useEffect, useState, useCallback } from 'react';
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";
import { Analytics } from '@vercel/analytics/react';

// Component imports
import Header from './components/Header';
import TrendingMovies from './components/TrendingMovies';
import MovieList from './components/MovieList';
import MovieDetailsModal from './components/MovieDetailsModal';

// Constants moved outside component to prevent recreation on renders
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
};

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('movieFavorites');
        return saved ? JSON.parse(saved) : [];
    });
    const [filters, setFilters] = useState({
        with_genres: [],
        year: null
    });
    const [sortOption, setSortOption] = useState('popularity.desc');
    // Movie details modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [movieDetails, setMovieDetails] = useState(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

    // Memoize fetchMovies with useCallback to prevent recreation on every render
    const fetchMovies = useCallback(async (query = '', page = 1) => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            let endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
                : `${API_BASE_URL}/discover/movie?sort_by=${sortOption}&page=${page}`;

            // Add filters to the endpoint
            if (!query) {
                if (filters.with_genres && filters.with_genres.length > 0) {
                    endpoint += `&with_genres=${filters.with_genres.join(',')}`;
                }
                if (filters.year) {
                    endpoint += `&primary_release_year=${filters.year}`;
                }
            }

            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error(`Network response error: ${response.status}`);
            }

            const data = await response.json();

            if (data.Response === 'False') {
                setErrorMessage(data.Error || 'Failed to fetch movies');
                setMovieList([]);
                return;
            }

            setMovieList(data.results || []);
            setTotalPages(data.total_pages > 500 ? 500 : data.total_pages); // TMDB API limits to 500 pages max

            // Only update search count if there are results
            if (query && data.results?.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }
        } catch (error) {
            console.error('Movie fetch error:', error);
            if (error.message.includes('Network response error')) {
                setErrorMessage(`API Error: ${error.message}. Please check your internet connection.`);
            } else if (error.message.includes('Failed to fetch')) {
                setErrorMessage('Unable to connect to movie database. Please check your internet connection.');
            } else {
                setErrorMessage('Something went wrong. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [filters, sortOption]);


    // Function to fetch movie details
    const fetchMovieDetails = useCallback(async (movieId) => {
        if (!movieId) return;

        setIsLoadingDetails(true);

        try {
            // Fetch basic movie details
            const detailsResponse = await fetch(
                `${API_BASE_URL}/movie/${movieId}?append_to_response=credits,videos`,
                API_OPTIONS
            );

            if (!detailsResponse.ok) {
                throw new Error(`Failed to fetch movie details: ${detailsResponse.status}`);
            }

            const details = await detailsResponse.ok ? await detailsResponse.json() : null;
            setMovieDetails(details);
        } catch (error) {
            console.error('Error fetching movie details:', error);
            setErrorMessage('Failed to load movie details');
        } finally {
            setIsLoadingDetails(false);
        }
    }, []);

    // Handle filter changes
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    // Handle sort changes
    const handleSortChange = (sortValue) => {
        setSortOption(sortValue);
        setCurrentPage(1); // Reset to first page when sort changes
    };

    // Load trending movies (memoized)
    const loadTrendingMovies = useCallback(async () => {
        try {
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);
        } catch (error) {
            console.error(`Error fetching trending movies: ${error}`);
        }
    }, []);

    // Effect for searching movies
    useEffect(() => {
        const fetchData = async () => {
            await fetchMovies(debouncedSearchTerm, currentPage);
        };
        
        fetchData();
        
        // No cleanup needed as we're not using any state variable
    }, [debouncedSearchTerm, currentPage, fetchMovies]);

    // Effect for initial load of trending movies
    useEffect(() => {
        loadTrendingMovies();
    }, [loadTrendingMovies]);

    // Updated handleSelectMovie function to open the modal with details
    const handleSelectMovie = (movieId) => {
        setIsModalOpen(true);

        // Find the basic movie data from our list
        const movie = movieList.find(m => m.id === movieId);
        setSelectedMovie(movie);

        // Fetch additional details
        fetchMovieDetails(movieId);
    };

    // Add modal close function
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
        setMovieDetails(null);
    };

    const toggleFavorite = (movie) => {
        setFavorites(prev => {
            const isFavorited = prev.some(fav => fav.id === movie.id);

            let newFavorites;
            if (isFavorited) {
                newFavorites = prev.filter(fav => fav.id !== movie.id);
            } else {
                newFavorites = [...prev, movie];
            }

            localStorage.setItem('movieFavorites', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    const isFavorite = (movieId) => {
        return favorites.some(fav => fav.id === movieId);
    };
    
    // Scroll to the movies cards 
    const scrollToTop = () => {
        const moviesSection = document.querySelector('.all-movies');
        if (moviesSection) {
            moviesSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToTop();
    }, []);

    return (
        <main>
            <div className="pattern" />
            <div className="wrapper">
                <Header 
                    searchTerm={searchTerm} 
                    setSearchTerm={setSearchTerm} 
                />

                <TrendingMovies trendingMovies={trendingMovies} />

                <MovieList
                    isLoading={isLoading}
                    errorMessage={errorMessage}
                    movieList={movieList}
                    handleSelectMovie={handleSelectMovie}
                    isFavorite={isFavorite}
                    toggleFavorite={toggleFavorite}
                    debouncedSearchTerm={debouncedSearchTerm}
                    filters={filters}
                    sortOption={sortOption}
                    handleFilterChange={handleFilterChange}
                    handleSortChange={handleSortChange}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                    scrollToTop={scrollToTop}
                />

                <MovieDetailsModal
                    isModalOpen={isModalOpen}
                    selectedMovie={selectedMovie}
                    movieDetails={movieDetails}
                    isLoadingDetails={isLoadingDetails}
                    closeModal={closeModal}
                />
            </div>
            <Analytics />
        </main>
    );
};

export default App;