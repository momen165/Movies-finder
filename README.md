# [MovieFinder](https://movies-finder-lemon.vercel.app/)  

Discover, search, and save your favorite movies with **MovieFinder**—a sleek, modern React application built using cutting-edge technologies like **React 19**, **Vite**, **Tailwind CSS**, and **Appwrite**.  

![MovieFinder Screenshot](/public/hero.png)

## 🚀 Live Preview  
Check out the live app: [MovieFinder Live Demo](https://movies-finder-lemon.vercel.app/)  

## Features

- **Movie Search**: Search across a database of 15 million movies
- **Trending Movies**: View what's popular based on user searches
- **Filtering & Sorting**: Filter movies by genre, year, and various sorting options
- **Movie Details**: View comprehensive information about movies including trailers
- **Favorites**: Save and manage your favorite movies
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## Tech Stack

- [React 19](https://react.dev/) - UI Library
- [Vite](https://vitejs.dev/) - Build tool and development server
- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- [Appwrite](https://appwrite.io/) - Backend as a Service for storing trending searches
- [TMDB API](https://www.themoviedb.org/documentation/api) - Movie database API

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

   ```sh
   git clone <your-repo-url>
   cd my-first-full-app
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env.local` file in the project root with your API keys:

   ```
   VITE_TMDB_API_KEY=your_tmdb_api_key
   VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
   VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id
   VITE_APPWRITE_COLLECTION_ID=your_appwrite_collection_id
   ```

4. Start the development server:

   ```sh
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173`

### Building for Production

```sh
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
/
├── public/               # Static assets
├── src/
│   ├── assets/           # Local assets
│   ├── components/       # Reusable UI components
│   ├── App.jsx           # Main application component
│   ├── appwrite.js       # Appwrite configuration and helpers
│   ├── index.css         # Global styles
│   └── main.jsx          # Application entry point
├── .env.local            # Environment variables (create this file locally)
├── index.html            # HTML template
└── vite.config.js        # Vite configuration
```

## Key Features Implementation

### Movie Search

The application uses the TMDB API to search for movies. Search results are debounced to avoid excessive API calls.

### Trending Movies

Popular searches are stored in Appwrite and displayed on the home page. Each search query is counted, and the most frequent searches are shown.

### Movie Filtering

Users can filter movies by:

- Genre (Action, Drama, Comedy, etc.)
- Release year
- Various sorting options (popularity, rating, release date, title)

### Favorites

Movie favorites are stored in the browser's localStorage, allowing users to maintain a list of their preferred movies across sessions.



