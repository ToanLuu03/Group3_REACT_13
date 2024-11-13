import React, { useState } from "react";
import { Button } from "antd";
import Title from "../Title/Title";
import ClassTemplateDM from "../../../pages/DeliveryManager/TraineeManagement/TraineeFeedback/ClassTemplate/ClassTemplate";
import CustomTemplateDM from "../../../pages/DeliveryManager/TraineeManagement/TraineeFeedback/CustomTemplate/CustomTemplate";
import FeedbackDM from "../../../pages/DeliveryManager/TraineeManagement/TraineeFeedback/Feedback/Feedback";
import EditTemplate from "../../../pages/DeliveryManager/TraineeManagement/TraineeFeedback/EditTemplate/EditTemplate";
import Schedule from "../../../pages/DeliveryManager/TraineeManagement/TraineeFeedback/Schedule/Schedule";

const CategoryDM = () => {
  const [activeFeedback, setActiveFeedback] = useState(0);
  const [showEditTemplate, setShowEditTemplate] = useState(false);
  const [selectedModuleData, setSelectedModuleData] = useState(null);

  const handleAddNewTemplateClick = () => {
    setShowEditTemplate(true);
    setActiveFeedback(0);
  };

  const handleBackToClassTemplate = () => {
    setShowEditTemplate(false);
  };

  const handleEditTemplate = (index) => {
    setShowEditTemplate(true);
    setSelectedModuleData(index);
  };

  const FeedbackTemplate = showEditTemplate
    ? [{ name: "Edit Template", link: "/edit-template" }]
    : [
        { name: "Class Template", link: "/class-template" },
        { name: "Custom Template", link: "/custom-template" },
        { name: "Feedback", link: "/feedback" },
        { name: "Schedule", link: "/schedule" },
      ];

  const showAddNewTemplate = [0, 1, 2, 3].includes(activeFeedback);

  return (
<div className="w-full mt-20 border-gray-200">
  <Title
    selectedModuleData={selectedModuleData}
    title={`${FeedbackTemplate[activeFeedback].name}`}
    showAddNewTemplate={showAddNewTemplate}
    onAddNewClick={handleAddNewTemplateClick}
  />
  <div className="flex space-x-8 border-b-2 mt-5 border-gray-200">
    {FeedbackTemplate.map((tab, index) => (
      <button
        key={index}
        onClick={() => {
          setActiveFeedback(index);
          setShowEditTemplate(false); // Reset showEditTemplate when changing tabs
        }}
        className={`text-gray-600 pb-2 ${
          activeFeedback === index
            ? "text-purple-500 border-b-2 border-purple-500"
            : "hover:text-purple-500"
        }`}
      >
        {tab.name}
      </button>
    ))}
  </div>
  <div className="mt-3 min-h-0">
    {showEditTemplate ? (
      <>
  <EditTemplate />
  <div className="sticky bottom-0 flex space-x-4 p-4 border-t border-gray-200 bg-white w-full justify-between">
        <Button
          type="default"
          className="px-4 py-2"
          onClick={handleBackToClassTemplate}
        >
          Back to Class Template
        </Button>
        <Button
          type="primary"
          className="px-4 py-2"
          htmlType="submit"
        >
          Save
        </Button>
      </div>
    

</>

    ) : (
      <>
        {activeFeedback === 0 && (
              <ClassTemplateDM onEditTemplate={handleEditTemplate} />
            )}
            {activeFeedback === 1 && (
              <CustomTemplateDM onEditTemplate={handleEditTemplate} />
            )}
            {activeFeedback === 2 && <FeedbackDM />}
        {activeFeedback === 3 && <Schedule/>}
      </>
    )}
  </div>
</div>

  );
};

export default CategoryDM;
