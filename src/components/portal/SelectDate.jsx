import React from "react";
import { DatePicker, Space } from "antd";

const SelectDate = ({ placeholder, onChange }) => (
  <Space direction="vertical">
    <DatePicker onChange={onChange} placeholder={placeholder} />
  </Space>
);
export default SelectDate;
