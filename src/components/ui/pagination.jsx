import React from 'react'

export default function Pagination(props) {
  const { pages, pageCount, setPage } = props;

  let pageButtons = pages.map((page, index) => {
    return (
      <button key={index} className="join-item btn" onClick={() => { setPage(page) }} >
        {page == 1 ? "<<" : page == pageCount ? ">>" : page}</button>
    )

  });
  return (
    <div className='flex justify-center'>
      <div className="join w-56">
        {
          pageButtons
        }
      </div>
    </div>
  )
}
