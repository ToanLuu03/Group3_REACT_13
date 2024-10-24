import React from "react";
import { Select } from "antd";

const SelectOptions = ({ placeholder, options, onChange, mode }) => (
  <Select
    mode={mode}
    showSearch
    className="w-[150px]"
    optionFilterProp="label"
    options={options}
    onChange={onChange}
    placeholder={placeholder}
  />
);

export default SelectOptions;
