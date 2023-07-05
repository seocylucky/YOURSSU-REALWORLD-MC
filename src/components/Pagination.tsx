import React from 'react'

const Pagination = ({
  totalPage,
  offset,
  setOffset,
}: {
  totalPage: number
  offset: number
  setOffset: (page: number) => void
}) => {
  let pageCount = totalPage / 10
  if (totalPage % 10 > 0) pageCount++
  const pageArr = Array.from({ length: pageCount }, (v, i) => i + 1)
  return (
    <ul className="pagination">
      {pageArr.map((page, index) => (
        <li
          className={`page-item ng-scope ${offset / 10 + 1 === page && 'active'}`}
          key={index}
        >
          <div
            className="page-link ng-binding"
            onClick={() => {
              console.log(page)
              console.log(10 * (page - 1))
              setOffset(10 * (page - 1))
            }}
          >
            {page}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default Pagination
