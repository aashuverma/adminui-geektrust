import React, { useState } from "react";
import "./pagination.css";

const Pagination = ({ userPerPage, totalUser, handlePageNumber }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const pageNumbers = [];

  //add page number based on the total users available
  for (let page = 1; page <= Math.ceil(totalUser / userPerPage); page++) {
    pageNumbers.push(page);
  }

  return (
    <div>
      <ul style={{ textDecoration: "none" }}>
        <div className="pagination">
          <>
            <div
              className="pagination-display"
              onClick={() => {
                handlePageNumber(1);
                setPageNumber(1);
              }}
            >
              {"<<"}
            </div>
            <div
              className="pagination-display"
              onClick={() => {
                if (pageNumber - 1 > 0) {
                  handlePageNumber(pageNumber - 1);
                  setPageNumber(pageNumber - 1);
                }
              }}
            >
              {"<"}
            </div>
          </>
          <>
            {pageNumbers.map((number) => (
              <div
                key={number}
                className={
                  pageNumber === number
                    ? "pagination-display-selected"
                    : "pagination-display mobile-page"
                }
                onClick={() => {
                  handlePageNumber(number);
                  setPageNumber(number);
                }}
              >
                {number}
              </div>
            ))}
          </>
          <>
            <div
              className="pagination-display"
              onClick={() => {
                if (pageNumber + 1 <= pageNumbers.length) {
                  handlePageNumber(pageNumber + 1);
                  setPageNumber(pageNumber + 1);
                }
              }}
            >
              {">"}
            </div>
            <div
              className="pagination-display"
              onClick={() => {
                handlePageNumber(pageNumbers[pageNumbers.length - 1]);
                setPageNumber(pageNumbers[pageNumbers.length - 1]);
              }}
            >
              {">>"}
            </div>
          </>
        </div>
      </ul>
    </div>
  );
};

export default Pagination;
