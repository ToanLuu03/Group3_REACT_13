import React, { useEffect } from "react";
import ArrowBack from "../../../assets/image/arrowback.png";
import Setting from "../../../assets/image/u_setting.png";

const ModalNotification = ({ isOpen, onClose }) => {
  // Close modal on 'Esc' key press for accessibility
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Return null if modal is not open
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: "Confirm Your Upcoming Class",
      content:
        'Hi VinhNT37, please confirm your new class "HCM24_FRF_FJW_04" on 30-Aug-2024. Thanks!',
      time: "1m ago",
    },
    {
      id: 2,
      title: "Confirm Your Upcoming Class",
      content:
        'Hi VinhNT37, please confirm your new class "HCM24_FRF_JAVA_01" on 30-Aug-2024. Thanks!',
      time: "10m ago",
    },
    // More notifications...
  ];

  return (
    <div className="fixed inset-0 flex justify-end z-50 mt-16">
      {/* Overlay to close modal */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white shadow-lg w-[400px] max-h-[40vh] overflow-y-auto z-50">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <button className="text-gray-500 focus:outline-none" onClick={onClose} aria-label="Close modal">
            <img src={ArrowBack} alt="Back" className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <div className="flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs rounded-full">5</div>
          </div>
          <button className="focus:outline-none">
            <div className="p-2 rounded-full bg-yellow-500">
              <img className="w-6 h-6" src={Setting} alt="Settings" />
            </div>
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-3 space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex justify-between items-start rounded-lg space-x-4 "
            >
              {/* Avatar/Icon Placeholder */}
              <div className="w-[42px] h-[42px] rounded-full overflow-hidden bg-gray-300 flex-shrink-0 ">
                <img
                  src="https://via.placeholder.com/42"
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Notification Content */}
              <div className="mt-[-15px]">
                <div className="font-semibold text-gray-800">{notification.title}</div>
                <p className="text-gray-600 text-sm mt-[-20px]">{notification.content}</p>
              </div>

              {/* Time */}
              <div className="text-right flex-shrink-0">
                <span className="text-xs text-gray-500">{notification.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalNotification;
