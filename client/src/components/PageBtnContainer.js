import { useAppContext } from '../context/appContext'
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'
import Wrapper from '../assets/wrappers/PageBtnContainer'

const PageBtnContainer = () => {
  const { numOfPages, page, changePage } = useAppContext()

  const nextPage = () => {
    let newPage = page + 1
    if (newPage > numOfPages) {
      newPage = 1
    }
    changePage(newPage)
  }

  const prevPage = () => {
    let newPage = page - 1
    if (newPage < 1) {
      newPage = numOfPages
    }
    changePage(newPage)
  }

  // Generate compact page numbers: prev, current, next
  const generatePageNumbers = () => {
    const pages = []

    // Add previous page if not on first page
    if (page > 1) {
      pages.push(page - 1)
    }

    // Always add current page
    pages.push(page)

    // Add next page if not on last page
    if (page < numOfPages) {
      pages.push(page + 1)
    }

    return pages
  }

  const pages = generatePageNumbers()

  return (
    <Wrapper>
      <button className='prev-btn' onClick={prevPage} disabled={page === 1}>
        <HiChevronDoubleLeft />
        prev
      </button>
      <div className='btn-container'>
        {pages.map((pageNumber) => {
          return (
            <button
              type='button'
              className={pageNumber === page ? 'pageBtn active' : 'pageBtn'}
              key={pageNumber}
              onClick={() => changePage(pageNumber)}
            >
              {pageNumber}
            </button>
          )
        })}
      </div>
      <button className='next-btn' onClick={nextPage} disabled={page === numOfPages}>
        next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  )
}

export default PageBtnContainer
