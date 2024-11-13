import React, { useState, useEffect } from "react";
import { Button, Select, Tag, message, Row, Col, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import TrainerAPI from "../../../../services/trainer";
import { toggleFetchFlag } from "../../../../features/trainerInfo/trainerSlice";

const { Option } = Select;

const GeneralInfo = ({ userInfoData = {} }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(userInfoData || {});
  const trainerData = useSelector((state) => state.trainer.trainerInfo);
  const username = useSelector((state) => state.users.users.userName.username);
  const token = useSelector((state) => state.users.users.userName.token);
  const [originalUserInfo, setOriginalUserInfo] = useState(userInfoData || {});
  const [cancleFlag, setCancleFlag] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (trainerData && trainerData.trainerInfo) {
      setUserInfo(trainerData.trainerInfo.generalInfo || []);
      
    }
  }, [trainerData, cancleFlag]);
  const handleSaveClick = async () => {
    try {
      const response = await TrainerAPI.updateTrainerInfo(
        token,
        username,
        userInfo
      );
      if (response && response.data) {
        message.success("Trainer information updated successfully!");
        dispatch(toggleFetchFlag());
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update trainer info:", error);
      message.error("Failed to update information. Please try again.");
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setUserInfo(originalUserInfo);
    setCancleFlag(!cancleFlag);
  };

  const renderSelectField = (field, options) =>
    isEditing ? (
      <Select
        value={userInfo?.[field] || ""}
        onChange={(value) => setUserInfo({ ...userInfo, [field]: value })}
        className="w-full"
      >
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    ) : field === "status" ? (
      renderStatusTag(userInfo?.[field])
    ) : (
      <span>{userInfo?.[field] || "-"}</span>
    );

  const renderInputField = (field) =>
    isEditing ? (
      <input
        type="text"
        name={field}
        value={userInfo?.[field] || ""}
        onChange={(e) => setUserInfo({ ...userInfo, [field]: e.target.value })}
        className="border border-gray-400 p-1 w-full h-10 text-sm rounded-lg"
      />
    ) : (
      <span className="inline-block min-w-[100px]">
        {userInfo?.[field] || "-"}
      </span>
    );

  const renderStatusTag = (status) => {
    let color;
    switch (status) {
      case "AVAILABLE":
        color = "green";
        break;
      case "BUSY":
        color = "red";
        break;
      case "OUT":
        color = "yellow";
        break;
      case "ONSITE":
        color = "blue";
        break;
      default:
        color = "gray";
    }
    return <Tag color={color}>{status || "Unavailable"}</Tag>;
  };

  const renderRow = (fields) => (
    <tr>
      {fields.map(({ label, field, options }) => (
        <React.Fragment key={field}>
          <td className="px-4 py-3 bg-stone-200 border border-gray-300 font-semibold text-sm">
            {label}
          </td>
          <td className="px-4 py-3 border border-gray-300 text-sm">
            {options
              ? renderSelectField(field, options)
              : field === "status"
              ? renderStatusTag(userInfo?.[field])
              : renderInputField(field)}
          </td>
        </React.Fragment>
      ))}
    </tr>
  );

  const renderCard = (fields) => (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      {fields.map(({ label, field, options }) => (
        <div key={field} className="flex justify-between mb-2">
          <span className="font-semibold">{label}:</span>
          <span className="text-sm">
            {options
              ? renderSelectField(field, options)
              : field === "status"
              ? renderStatusTag(userInfo?.[field])
              : renderInputField(field)}
          </span>
        </div>
      ))}
    </div>
  );


  return (
    <div className="m-5">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={24}>
          <table className="min-w-full table-auto border-collapse border border-stone-200 text-left hidden md:table">
            <tbody>
              {renderRow([
                { label: "Full Name", field: "name" },
                { label: "Account", field: "account" },
                { label: "Contact Email", field: "email" },
              ])}
              {renderRow([
                { label: "Phone", field: "phone" },
                { label: "Employee ID", field: "employeeId" },
                { label: "National ID", field: "nationalId" },
              ])}
              {renderRow([
                { label: "Site", field: "site" },
                {
                  label: "Trainer Type",
                  field: "type",
                  options: [
                    { label: "INTERNAL", value: "INTERNAL" },
                    { label: "EXTERNAL", value: "EXTERNAL" },
                    { label: "STAFF", value: "STAFF" },
                  ],
                },
                {
                  label: "Contribution Type",
                  field: "educatorContributionType",
                  options: [
                    { label: "TRAINER", value: "TRAINER" },
                    { label: "MENTOR", value: "MENTOR" },
                  ],
                },
              ])}
              {renderRow([
                {
                  label: "Trainer Rank",
                  field: "trainerRank",
                },
                {
                  label: "Professional Level",
                  field: "professionalLevel",
                  options: [
                    { label: "ADVANCE", value: "ADVANCE" },
                    { label: "STANDARD", value: "STANDARD" },
                    { label: "EXPERT", value: "EXPERT" },
                  ],
                },
                {
                  label: "Train The Trainer Certificate",
                  field: "trainTheTrainerCert",
                  options: [
                    { label: "BASIC", value: "BASIC" },
                    { label: "ADVANCE", value: "ADVANCE" },
                    { label: "NONE", value: "NONE" },
                  ],
                },
              ])}
              {renderRow([
                { label: "Job Rank", field: "jobRank" },
                { label: "Professional Index", field: "professionalIndex" },
                {
                  label: "Training Competency Index",
                  field: "trainingCompetencyIndex",
                },
              ])}
              {renderRow([
                {
                  label: "Status",
                  field: "status",
                  options: [
                    { label: "AVAILABLE", value: "AVAILABLE" },
                    { label: "BUSY", value: "BUSY" },
                    { label: "OUT", value: "OUT" },
                    { label: "ONSITE", value: "ONSITE" },
                  ],
                },
                { label: "Note", field: "note" },
              ])}
            </tbody>
          </table>
        </Col>

        {/* For Mobile */}
        <Col xs={24} className="md:hidden max-h-[400px] overflow-y-auto">
          {renderCard([
            { label: "Full Name", field: "name" },
            { label: "Account", field: "account" },
            { label: "Contact Email", field: "email" },
          ])}
          {renderCard([
            { label: "Phone", field: "phone" },
            { label: "Employee ID", field: "employeeId" },
            { label: "National ID", field: "nationalId" },
          ])}
          {renderCard([
            { label: "Site", field: "site" },
            {
              label: "Trainer Type",
              field: "type",
              options: [
                { label: "INTERNAL", value: "INTERNAL" },
                { label: "EXTERNAL", value: "EXTERNAL" },
              ],
            },
            {
              label: "Contribution Type",
              field: "educatorContributionType",
              options: [
                { label: "TRAINER", value: "TRAINER" },
                { label: "MENTOR", value: "MENTOR" },
                { label: "AUDITOR", value: "AUDITOR" },
              ],
            },
          ])}
          {renderCard([
            {
              label: "Trainer Rank",
              field: "trainerRank",
            },
            {
              label: "Professional Level",
              field: "professionalLevel",
              options: [
                { label: "BEGINNER", value: "BEGINNER" },
                { label: "INTERMEDIATE", value: "INTERMEDIATE" },
                { label: "EXPERT", value: "EXPERT" },
              ],
            },
            {
              label: "Train The Trainer Certificate",
              field: "trainTheTrainerCert",
              options: [
                { label: "BASIC", value: "BASIC" },
                { label: "ADVANCED", value: "ADVANCED" },
              ],
            },
          ])}
          {renderCard([
            {
              label: "Status",
              field: "status",
              options: [
                { label: "AVAILABLE", value: "AVAILABLE" },
                { label: "BUSY", value: "BUSY" },
                { label: "OUT", value: "OUT" },
                { label: "ONSITE", value: "ONSITE" },
              ],
            },
            { label: "Note", field: "note" },
          ])}
        </Col>
      </Row>

      <div className="flex justify-end mt-4">
        {isEditing ? (
          <>
            <Button
              onClick={handleCancelClick}
              className="rounded-full bg-white text-red py-2 px-4 text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveClick}
              className="rounded-full bg-blue-500 text-white py-2 px-4 mx-3 text-sm"
            >
              Save
            </Button>
          </>
        ) : (
          <Button
            onClick={handleEditClick}
            className="rounded-full bg-blue-500 text-white py-1 px-3 text-sm"
          >
            Edit General Info
          </Button>
        )}
      </div>
    </div>
  );
};

export default GeneralInfo;
