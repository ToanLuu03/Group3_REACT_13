import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import { MdPerson, MdDomain } from "react-icons/md";
import "./schedulemodal.css";
import EditModal from "../EditModal/EditModal";
import { fetchScheduleDetails } from "../../../services/schedule";


const ScheduleModal = ({ isVisible, event, onClose, onDelete }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [eventDetails, setEventDetails] = useState({ location: "", admin: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getEventDetails = async () => {
      if (isVisible && event?.id) {
        try {
          const response = await fetchScheduleDetails(event.id, token);
          setEventDetails({
            location: response.data[0].location,
            admin: response.data[0].admin,
          });
        } catch (error) {
          console.error("Error fetching event details:", error);
        }
      }
    };

    getEventDetails();
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
            <p>
              <b>Location:</b> {eventDetails.location}
            </p>
          </div>
        </div>

        <div className="modal-section">
          <MdPerson className="modal-icon modal-admin-icon" />
          <div>
            <p>
              <b>Admin:</b> {eventDetails.admin}
            </p>
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
