import React from "react";
import { GrFormPrevious } from "react-icons/gr";
import { MdOutlineNavigateNext, MdSkipNext, MdSkipPrevious } from "react-icons/md";

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange, onPageSizeChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center gap-4  mt-4">
      {/* Items per Page Dropdown on the left */}
      <div className="flex items-center">
        <span className="mr-2">Items per page:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border rounded-lg px-2 py-1"
        >
          <option value={4}>4</option>
          <option value={8}>8</option>
          <option value={12}>12</option>
        </select>
      </div>

      {/* Page Numbers */}
      <div>
          {currentPage} - {totalPages} of {totalPages}
        </div>

      {/* Pagination Controls */}
      <div className="flex items-center ">
        {/* First Page Button */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-2  hover:bg-gray-100"
        >
        <MdSkipPrevious />
        </button>

        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2  hover:bg-gray-100"
        >
          <GrFormPrevious />
        </button>

        

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2  hover:bg-gray-100"
        >
          <MdOutlineNavigateNext />
        </button>

        {/* Last Page Button */}
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-2  hover:bg-gray-100"
        >
         <MdSkipNext />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
