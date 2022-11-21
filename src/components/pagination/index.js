import ReactPaginate from 'react-paginate';
import PaginationArrowRight from '../../assets/icons/PaginationArrowRight'
import PaginationArrowLeft from '../../assets/icons/PaginationArrowLeft'

const Pagination = ({ currentPage, pageCount, onChange }) => (
  <ReactPaginate
    // initialPage={currentPage}
    forcePage={currentPage}
    pageCount={pageCount}
    pageRangeDisplayed={3}
    marginPagesDisplayed={1}
    nextLabel={<PaginationArrowRight />}
    previousLabel={<PaginationArrowLeft />}
    pageClassName="page-item"
    previousClassName="page-item"
    nextClassName="page-item"
    breakLabel="..."
    breakClassName="page-item"
    containerClassName="pagination"
    activeClassName="active"
    onPageChange={onChange}
    renderOnZeroPageCount={null}
    // renderOnZeroPageCount={false}
    // pageLinkClassName="page-link"
    // previousLinkClassName="page-link"
    // nextLinkClassName="page-link"
    // breakLinkClassName="page-link"
  />
)

export default Pagination