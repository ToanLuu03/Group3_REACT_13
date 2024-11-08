import React, { useState, useMemo } from "react";
import { Select, DatePicker, Checkbox } from "antd";
import Star from "../../../../assets/image/star.png";

const { Option } = Select;
const { RangePicker } = DatePicker;

const FilterSection = ({ data, onFilterChange }) => {
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [selectedTrainers, setSelectedTrainers] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);

  // Filter data based on selected trainers
  const filteredData = useMemo(() => {
    if (selectedTrainers.length === 0) return data;
    return data.filter((item) =>
      selectedTrainers.includes(item.trainerAccount)
    );
  }, [data, selectedTrainers]);

  // Dynamically generate class and module options based on filtered data
  const classOptions = Array.from(
    new Set(filteredData.map((item) => item.className))
  );
  const moduleOptions = Array.from(
    new Set(filteredData.map((item) => item.moduleName))
  );
  const trainerOptions = Array.from(
    new Set(data.map((item) => item.trainerAccount))
  );

  const handleTrainerChange = (selectedValues) => {
    setSelectedTrainers(selectedValues);
    setSelectedClasses([]); // Reset classes and modules when trainer changes
    setSelectedModules([]);
    onFilterChange({
      trainers: selectedValues,
      classes: [],
      modules: [],
      years: selectedYears,
    });
  };

  const handleClassChange = (selectedValues) => {
    setSelectedClasses(selectedValues);
    onFilterChange({
      trainers: selectedTrainers,
      classes: selectedValues,
      modules: selectedModules,
      years: selectedYears,
    });
  };

  const handleModuleChange = (selectedValues) => {
    setSelectedModules(selectedValues);
    onFilterChange({
      trainers: selectedTrainers,
      classes: selectedClasses,
      modules: selectedValues,
      years: selectedYears,
    });
  };

  const handleYearChange = (dates) => {
    setSelectedYears(dates ? [dates[0].year(), dates[1].year()] : []);
    onFilterChange({
      trainers: selectedTrainers,
      classes: selectedClasses,
      modules: selectedModules,
      years: dates ? [dates[0].year(), dates[1].year()] : [],
    });
  };

  const handleClassCheckboxChange = (checkedValue) => {
    const updatedClasses = selectedClasses.includes(checkedValue)
      ? selectedClasses.filter((item) => item !== checkedValue)
      : [...selectedClasses, checkedValue];
    setSelectedClasses(updatedClasses);
    onFilterChange({
      trainers: selectedTrainers,
      classes: updatedClasses,
      modules: selectedModules,
      years: selectedYears,
    });
  };

  const handleModuleCheckboxChange = (checkedValue) => {
    const updatedModules = selectedModules.includes(checkedValue)
      ? selectedModules.filter((item) => item !== checkedValue)
      : [...selectedModules, checkedValue];
    setSelectedModules(updatedModules);
    onFilterChange({
      trainers: selectedTrainers,
      classes: selectedClasses,
      modules: updatedModules,
      years: selectedYears,
    });
  };

  const handleSelectAllClasses = () => {
    const allClassesSelected =
      selectedClasses.length === classOptions.length ? [] : classOptions;
    setSelectedClasses(allClassesSelected);
    onFilterChange({
      trainers: selectedTrainers,
      classes: allClassesSelected,
      modules: selectedModules,
      years: selectedYears,
    });
  };

  const handleSelectAllModules = () => {
    const allModulesSelected =
      selectedModules.length === moduleOptions.length ? [] : moduleOptions;
    setSelectedModules(allModulesSelected);
    onFilterChange({
      trainers: selectedTrainers,
      classes: selectedClasses,
      modules: allModulesSelected,
      years: selectedYears,
    });
  };

  return (
    <div className="flex gap-4 p-4">
      {/* Trainer Options Section */}
      <div>
        <label className="font-semibold flex gap-2">
          Trainer <img src={Star} className="h-[10px] mt-1" alt="required" />
        </label>
        <Select
          mode="multiple"
          showSearch
          placeholder="Select Trainer"
          className="w-52"
          optionFilterProp="children"
          maxTagCount={2}
          onChange={handleTrainerChange}
          value={selectedTrainers}
        >
          {trainerOptions.map((trainer) => (
            <Option key={trainer} value={trainer}>
              {trainer}
            </Option>
          ))}
        </Select>
      </div>

      {/* Class Options Section */}
      <div>
        <label className="font-semibold flex gap-2">
          Class <img src={Star} className="h-[10px] mt-1" alt="required" />
        </label>
        <Select
          mode="multiple"
          value={selectedClasses}
          onChange={handleClassChange}
          placeholder="Select Class"
          className="w-52"
          dropdownRender={() => (
            <div>
              <div className="p-2">
                <Checkbox
                  onChange={handleSelectAllClasses}
                  checked={selectedClasses.length === classOptions.length}
                  indeterminate={
                    selectedClasses.length > 0 &&
                    selectedClasses.length < classOptions.length
                  }
                >
                  Select All
                </Checkbox>
              </div>
              <div className="p-2">
                {classOptions.map((className) => (
                  <div key={className} className="flex items-center mb-2">
                    <Checkbox
                      checked={selectedClasses.includes(className)}
                      onChange={() => handleClassCheckboxChange(className)}
                    >
                      {className}
                    </Checkbox>
                  </div>
                ))}
              </div>
            </div>
          )}
        />
      </div>

      {/* Module Options Section */}
      <div>
        <label className="font-semibold flex gap-2">
          Module <img src={Star} className="h-[10px] mt-1" alt="required" />
        </label>
        <Select
          mode="multiple"
          value={selectedModules}
          onChange={handleModuleChange}
          placeholder="Select Module"
          className="w-52"
          dropdownRender={() => (
            <div>
              <div className="p-2">
                <Checkbox
                  onChange={handleSelectAllModules}
                  checked={selectedModules.length === moduleOptions.length}
                  indeterminate={
                    selectedModules.length > 0 &&
                    selectedModules.length < moduleOptions.length
                  }
                >
                  Select All
                </Checkbox>
              </div>
              <div className="p-2">
                {moduleOptions.map((moduleName) => (
                  <div key={moduleName} className="flex items-center mb-2">
                    <Checkbox
                      checked={selectedModules.includes(moduleName)}
                      onChange={() => handleModuleCheckboxChange(moduleName)}
                    >
                      {moduleName}
                    </Checkbox>
                  </div>
                ))}
              </div>
            </div>
          )}
        />
      </div>

      {/* Year Picker Section */}
      <div>
        <label className="font-semibold flex gap-2">
          Year <img src={Star} className="h-[10px] mt-1" alt="required" />
        </label>
        <RangePicker
          picker="year"
          style={{ height: "32px" }}
          onChange={handleYearChange}
        />
      </div>
    </div>
  );
};

export default FilterSection;
