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

  const filteredData = useMemo(() => {
    if (selectedTrainers.length === 0) return data;
    return data.filter((item) =>
      selectedTrainers.includes(item.trainerAccount)
    );
  }, [data, selectedTrainers]);

  const classOptions = Array.from(new Set(filteredData.map((item) => item.className)));
  const moduleOptions = Array.from(new Set(filteredData.map((item) => item.moduleName)));
  const trainerOptions = Array.from(new Set(data.map((item) => item.trainerAccount)));

  const handleTrainerChange = (selectedValues) => {
    setSelectedTrainers(selectedValues);
    setSelectedClasses([]);
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
    const allClassesSelected = selectedClasses.length === classOptions.length ? [] : classOptions;
    setSelectedClasses(allClassesSelected);
    onFilterChange({
      trainers: selectedTrainers,
      classes: allClassesSelected,
      modules: selectedModules,
      years: selectedYears,
    });
  };

  const handleSelectAllModules = () => {
    const allModulesSelected = selectedModules.length === moduleOptions.length ? [] : moduleOptions;
    setSelectedModules(allModulesSelected);
    onFilterChange({
      trainers: selectedTrainers,
      classes: selectedClasses,
      modules: allModulesSelected,
      years: selectedYears,
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* Trainer Options Section */}
      <div className="flex flex-col">
        <label className="font-semibold flex gap-1 items-center">
          Trainer <img src={Star} className="h-2" alt="required" />
        </label>
        <Select
          showSearch
          placeholder="Select Trainer"
          className="w-full"
          optionFilterProp="children"
          maxTagCount="responsive"
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
      <div className="flex flex-col">
        <label className="font-semibold flex gap-1 items-center">
          Class <img src={Star} className="h-2" alt="required" />
        </label>
        <Select
          mode="multiple"
          value={selectedClasses}
          onChange={handleClassChange}
          placeholder="Select Class"
          maxTagCount="responsive"
          className="w-full"
          dropdownRender={() => (
            <div>
              <div className="p-2">
                <Checkbox
                  onChange={handleSelectAllClasses}
                  checked={selectedClasses.length === classOptions.length}
                  indeterminate={
                    selectedClasses.length > 0 && selectedClasses.length < classOptions.length
                  }
                >
                  Select All
                </Checkbox>
              </div>
              <div className="p-2 space-y-2">
                {classOptions.map((className) => (
                  <Checkbox
                    key={className}
                    checked={selectedClasses.includes(className)}
                    onChange={() => handleClassCheckboxChange(className)}
                  >
                    {className}
                  </Checkbox>
                ))}
              </div>
            </div>
          )}
        />
      </div>

      {/* Module Options Section */}
      <div className="flex flex-col">
        <label className="font-semibold flex gap-1 items-center">
          Module <img src={Star} className="h-2" alt="required" />
        </label>
        <Select
          mode="multiple"
          value={selectedModules}
          onChange={handleModuleChange}
          placeholder="Select Module"
          maxTagCount="responsive"
          className="w-full"
          dropdownRender={() => (
            <div>
              <div className="p-2">
                <Checkbox
                  onChange={handleSelectAllModules}
                  checked={selectedModules.length === moduleOptions.length}
                  indeterminate={
                    selectedModules.length > 0 && selectedModules.length < moduleOptions.length
                  }
                >
                  Select All
                </Checkbox>
              </div>
              <div className="p-2 space-y-2">
                {moduleOptions.map((moduleName) => (
                  <Checkbox
                    key={moduleName}
                    checked={selectedModules.includes(moduleName)}
                    onChange={() => handleModuleCheckboxChange(moduleName)}
                  >
                    {moduleName}
                  </Checkbox>
                ))}
              </div>
            </div>
          )}
        />
      </div>

      {/* Year Picker Section */}
      <div className="flex flex-col">
        <label className="font-semibold flex gap-1 items-center">
          Year <img src={Star} className="h-2" alt="required" />
        </label>
        <RangePicker
          picker="year"
          style={{ width: "100%" }}
          onChange={handleYearChange}
        />
      </div>
    </div>
  );
};

export default FilterSection;
