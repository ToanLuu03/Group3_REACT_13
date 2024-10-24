import React, { useState } from 'react';
import Modal from '../../Modal/ImportModal/ImportModal';  // Import modal from the Modal component

const Title = ({ title, showImportButton }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center">
      {/* Responsive text size */}
      <span className="px-4 font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 sm:mb-0">
        {title}
      </span>

      {/* Show Import Feedback Button if showImportButton is true */}
      {showImportButton && (
        <button
          className="bg-[#5750DF] text-white hover:bg-blue-600 px-2 py-1 md:px-4 md:py-2 rounded-full"
          onClick={toggleModal}
        >
          Import feedback
        </button>
      )}

      {/* Use Modal component */}
      <Modal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
};

export default Title;
