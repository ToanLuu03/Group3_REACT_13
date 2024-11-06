import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import { Modal, Button } from "antd";
import { MdPerson, MdDomain, MdModeEdit, MdDelete } from 'react-icons/md';
import './schedulemodal.css';
import EditModal from "../EditModal/EditModal";

const ScheduleModal = ({ isVisible, event, onClose, onDelete }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [eventDetails, setEventDetails] = useState({ location: "", admin: "" }); 
  useEffect(() => {
    if (isVisible && event?.id) { // Fetch only when modal is visible and event ID is available
      axios.get(`https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainer-management/schedule-detail/${event?.id}`)
        .then(response => {
          setEventDetails({
            location: response.data.data[0].location,
            admin: response.data.data[0].admin,
          });
        })
        
        .catch(error => {
          console.error("Error fetching event details:", error);
        });
    }
  }, [isVisible, event?.id]);

  const handleEditClick = () => {
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = (updatedData) => {
    console.log("Updated Data:", updatedData);
    setIsEditModalVisible(false);
    onClose();
  };

  return (
    <>
      {/* Main event modal */}
      <Modal
        title={<span className="modal-title">{event?.title}</span>}
        visible={isVisible}
        onOk={onClose}
        onCancel={onClose}
        footer={null}
  
      >
        <div className="modal-section">
          <MdDomain className="modal-icon" />
          <div>
            <p><b>Location:</b> {eventDetails.location}</p>
          </div>
        </div>

        <div className="modal-section">
          <MdPerson className="modal-icon modal-admin-icon" />
          <div>
            <p><b>Admin:</b> {eventDetails.admin}</p>
          </div>
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
