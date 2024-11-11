import { Select } from "antd";
import React, { useState } from "react";

const Filter = ({
  options,
  onTrainerSelect,
  onClassSelect,
  onModuleSelect,
}) => {
  const [selectedValues, setSelectedValues] = useState({
    Trainer: null,
    Class: null,
    Module: null,
  });

  const handleChange = (filterName, value) => {
    const newSelectedValues = { ...selectedValues, [filterName]: value };

    if (filterName === "Trainer") {
      newSelectedValues.Class = null;
      newSelectedValues.Module = null;
      onTrainerSelect(value);
    } else if (filterName === "Class") {
      newSelectedValues.Module = null;
      onClassSelect(value);
    } else if (filterName === "Module") {
      onModuleSelect(value);
    }

    setSelectedValues(newSelectedValues);
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-screen-md">
        {options.map((filterGroup) => (
          <Select
            key={filterGroup.name}
            className="bg-white text-gray-600 text-lg shadow-sm w-full"
            placeholder={filterGroup.name}
            value={selectedValues[filterGroup.name]}
            onChange={(value) => handleChange(filterGroup.name, value)}
            allowClear
          >
            {filterGroup.options.map((option, idx) => (
              <Select.Option key={idx} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        ))}
      </div>
    </div>
  );
};

export default Filter;
