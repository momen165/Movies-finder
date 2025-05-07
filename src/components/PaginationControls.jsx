import PropTypes from 'prop-types';

const PaginationControls = ({ currentPage, totalPages, onPageChange, scrollToTop }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        onClick={() => {
          onPageChange(Math.max(currentPage - 1, 1));
          scrollToTop();
        }}
        disabled={currentPage === 1}
        className="pagination-btn"
      >
        Previous
      </button>
      <span className="page-info">Page {currentPage} of {totalPages}</span>
      <button
        onClick={() => {
          onPageChange(Math.min(currentPage + 1, totalPages));
          scrollToTop();
        }}
        disabled={currentPage === totalPages}
        className="pagination-btn"
      >
        Next
      </button>
    </div>
  );
};

PaginationControls.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  scrollToTop: PropTypes.func.isRequired
};

export default PaginationControls;