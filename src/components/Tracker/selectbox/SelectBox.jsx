import { Select } from "antd";
import React, { useState, useEffect } from "react";
import { TrackByClassName } from "../../../services/schedule-tracker-admin/TrackByClassName";
import { TrackByTrainer } from "../../../services/schedule-tracker-admin/TrackByTrainer";
import { useSelector } from "react-redux";

const SelectBox = ({ onModuleSelect, onContentListChange }) => {
  const [trackBy, setTrackBy] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [classOptionsAPI, setClassOptionsAPI] = useState([]);
  const [trainerOptionsAPI, setTrainerOptionsAPI] = useState([]);
  const [moduleOptionsAPI, setModuleOptionsAPI] = useState([]);
  const [contentList, setContentList] = useState([]);

  const accessToken = useSelector((state) => state.users.users.userName.token);
  const [classData, setClassData] = useState([]);
  const [trainerData, setTrainerData] = useState([]);

  useEffect(() => {
    if (trackBy === "1") {
      fetchClassDataHandler();
    } else if (trackBy === "2") {
      fetchTrainerDataHandler();
    }
  }, [trackBy]);

  const fetchClassDataHandler = async () => {
    try {
      const data = await TrackByClassName(accessToken);
      setClassData(data);
      setClassOptionsAPI(
        data.map((item) => ({ value: item.classId, label: item.className }))
      );
    } catch (error) {
      console.error("Error fetching class data", error);
    }
  };

  const fetchTrainerDataHandler = async () => {
    try {
      const data = await TrackByTrainer(accessToken);
      setTrainerData(data);
      setTrainerOptionsAPI(
        data.map((item) => ({ value: item.trainerId, label: item.trainerName }))
      );
    } catch (error) {
      console.error("Error fetching trainer data", error);
    }
  };

  const handleTrackByChange = (value) => {
    setTrackBy(value);
    setSelectedClass(null);
    setSelectedTrainer(null);
    setSelectedModule(null);
    setModuleOptionsAPI([]);
    setContentList([]);
    onModuleSelect(null);

    if (onContentListChange) {
      onContentListChange([]);
    }
  };

  const handleClassChange = (value) => {
    if (trackBy === "1") {
      setSelectedClass(value);
      setSelectedModule(null);
      onModuleSelect(null);
      setContentList([]);

      const selectedClassData = classData.find(
        (item) => item.classId === value
      );

      if (selectedClassData && selectedClassData.modules) {
        setModuleOptionsAPI(
          selectedClassData.modules.map((module) => ({
            value: module.moduleId,
            label: module.moduleName,
          }))
        );
      } else {
        setModuleOptionsAPI([]);
      }

      if (onContentListChange) {
        onContentListChange([]);
      }
    } else if (trackBy === "2") {
      setSelectedClass(value);
      setSelectedModule(null);
      onModuleSelect(null);
      setContentList([]);

      const selectedTrainerData = trainerData.find(
        (item) => item.trainerId === selectedTrainer
      );

      if (!selectedTrainerData) {
        console.error("No trainer data found for selected trainer.");
        return;
      }

      const selectedClassData = selectedTrainerData.classes?.find(
        (item) => item.classId === value
      );

      if (selectedClassData && selectedClassData.modules) {
        setModuleOptionsAPI(
          selectedClassData.modules.map((module) => ({
            value: module.moduleId,
            label: module.moduleName,
          }))
        );
      } else {
        setModuleOptionsAPI([]);
      }

      if (onContentListChange) {
        onContentListChange([]);
      }
    }
  };

  const handleTrainerChange = (value) => {
    setSelectedTrainer(value);
    setSelectedClass(null);
    setSelectedModule(null);
    onModuleSelect(null);
    setModuleOptionsAPI([]);
    setContentList([]);

    const selectedTrainerData = trainerData.find(
      (item) => item.trainerId === value
    );

    if (selectedTrainerData && selectedTrainerData.classes) {
      setClassOptionsAPI(
        selectedTrainerData.classes.map((item) => ({
          value: item.classId,
          label: item.className,
        }))
      );
    } else {
      setClassOptionsAPI([]);
    }

    if (onContentListChange) {
      onContentListChange([]);
    }
  };

  const handleModuleChange = (value) => {
    setSelectedModule(value);
    onModuleSelect(value);

    let selectedContentList = [];

    if (trackBy === "1") {
      const selectedClassData = classData.find(
        (item) => item.classId === selectedClass
      );
      const selectedModule = selectedClassData?.modules.find(
        (module) => module.moduleId === value
      );
      selectedContentList = selectedModule?.contents || [];
    } else if (trackBy === "2") {
      const selectedTrainerData = trainerData.find(
        (item) => item.trainerId === selectedTrainer
      );
      const selectedClassData = selectedTrainerData?.classes.find(
        (item) => item.classId === selectedClass
      );
      const selectedModule = selectedClassData?.modules.find(
        (module) => module.moduleId === value
      );
      selectedContentList = selectedModule?.contents || [];
    }

    setContentList(selectedContentList);

    if (onContentListChange) {
      onContentListChange(selectedContentList);
    }
  };

  const Dropdown = ({ label, value, onChange, options, placeholder }) => (
    <div className="flex flex-col">
      <label className="font-semibold mb-1">{label}</label>
      <Select
        value={value}
        placeholder={placeholder}
        className="w-48"
        onChange={onChange}
        options={options}
      />
    </div>
  );

  return (
    <div className="px-4">
      <Dropdown
        label="Track by:"
        value={trackBy}
        onChange={handleTrackByChange}
        options={[
          { value: "1", label: "Class Name" },
          { value: "2", label: "Trainer Name" },
        ]}
        placeholder="Please select your tracking method..."
      />

      {trackBy === "1" && (
        <div className="flex space-x-4 items-center">
          <Dropdown
            label="Class"
            value={selectedClass}
            onChange={handleClassChange}
            options={classOptionsAPI}
            placeholder="Please select class..."
          />
          {selectedClass && (
            <Dropdown
              label="Module"
              value={selectedModule}
              onChange={handleModuleChange}
              options={moduleOptionsAPI}
              placeholder="Please select module..."
            />
          )}
        </div>
      )}

      {trackBy === "2" && (
        <div className="flex space-x-4 items-center">
          <Dropdown
            label="Trainer"
            value={selectedTrainer}
            onChange={handleTrainerChange}
            options={trainerOptionsAPI}
            placeholder="Please select trainer..."
          />
          {selectedTrainer && (
            <>
              <Dropdown
                label="Class"
                value={selectedClass}
                onChange={handleClassChange}
                options={classOptionsAPI}
                placeholder="Please select class..."
              />
              {selectedClass && (
                <Dropdown
                  label="Module"
                  value={selectedModule}
                  onChange={handleModuleChange}
                  options={moduleOptionsAPI}
                  placeholder="Please select module..."
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectBox;
