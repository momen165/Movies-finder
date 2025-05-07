import PropTypes from 'prop-types';
import Search from './search';

const Header = ({ searchTerm, setSearchTerm }) => {
  return (
    <header>
      <img src="/hero.png" alt="The movies" />
      <h1>Find <span className="text-gradient">Movies</span> You&#39;ll enjoy without the hassle</h1>
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </header>
  );
};

Header.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired
};

export default Header;