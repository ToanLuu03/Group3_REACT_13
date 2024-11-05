import React, { useState } from 'react';
import Modal from '../../Modal/ImportModal/ImportModal';

const Title = ({ title, showImportButton, showAddNewTemplate, onAddNewClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center">
      <span className="font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 sm:mb-0">
        {title}
      </span>
      {showImportButton && (
        <button
          className="bg-[#5750DF] text-white hover:bg-blue-600 px-2 py-1 md:px-4 md:py-2 rounded-full"
          onClick={toggleModal}
        >
          Import feedback
        </button>
      )}
      {showAddNewTemplate && (
        <button
          className="bg-[#5750DF] text-white hover:bg-blue-600 px-2 py-1 md:px-4 md:py-2 rounded-full"
          onClick={onAddNewClick}  // Trigger onAddNewClick when clicked
        >
          Add New Template
        </button>
      )}
      <Modal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
};

export default Title;
