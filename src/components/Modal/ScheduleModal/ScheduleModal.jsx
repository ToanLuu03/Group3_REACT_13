import React, { useState } from "react";
import { Modal, Button } from "antd";
import { MdPerson, MdDomain, MdModeEdit, MdDelete } from 'react-icons/md'; // Import icons from react-icons
import './schedulemodal.css'; // Import the CSS for ScheduleModal
import EditModal from "../EditModal/EditModal";

const ScheduleModal = ({ isVisible, event, onClose, onDelete }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Function to handle the opening of the Edit modal
  const handleEditClick = () => {
    setIsEditModalVisible(true);
  };

  // Function to handle saving changes in the Edit modal
  const handleSaveEdit = (updatedData) => {
    console.log("Updated Data:", updatedData);
    setIsEditModalVisible(false);
    onClose(); // Close the main modal as well after saving changes
  };

  return (
    <>
      {/* Main event modal */}
      <Modal
        title={<span className="modal-title">{event?.title}</span>}
        visible={isVisible}
        onOk={onClose}
        onCancel={onClose}
        footer={null} // Remove footer for a cleaner look
      >
        <div className="modal-section">
          <MdDomain className="modal-icon" />
          <div>
            <p><b>Location:</b> {event?.location}</p>
          </div>
        </div>

        <div className="modal-section">
          <MdPerson className="modal-icon modal-admin-icon" />
          <div>
            <p><b>Admin:</b> {event?.admin}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="modal-divider"></div>

        {/* Edit and Remove buttons */}
        <div className="modal-button-section">
          <Button className="modal-button" onClick={handleEditClick} icon={<MdModeEdit />} type="default">
            Edit
          </Button>

          <Button className="modal-button" onClick={onDelete} icon={<MdDelete />} type="danger">
            Remove
          </Button>
        </div>
      </Modal>

      {/* Edit modal */}
      <EditModal
        isVisible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        initialData={event}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default ScheduleModal;
