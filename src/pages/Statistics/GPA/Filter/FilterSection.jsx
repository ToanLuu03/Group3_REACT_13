// src/components/FilterSection.js

import React, { useState } from "react";
import { Select, DatePicker, Input, Checkbox } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import Star from "../../../../assets/image/star.png";
const { Option } = Select;
const { RangePicker } = DatePicker;

const FilterSection = () => {
  const classOptions = ["Java01", "Java02", "Java03"];
  const moduleOptions = ["HTML CSS", "JS", "ReactJS"];
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  // Handle selection and "Select All" functionality
  const handleClassChange = (selectedValues) => {
    setSelectedClasses(selectedValues);
  };

  const handleModuleChange = (selectedValues) => {
    setSelectedModules(selectedValues);
  };

  // Handle checkbox change for individual options
  const handleCheckboxChange = (checkedValue) => {
    if (selectedClasses.includes(checkedValue)) {
      setSelectedClasses(
        selectedClasses.filter((item) => item !== checkedValue)
      );
    } else {
      setSelectedClasses([...selectedClasses, checkedValue]);
    }
  };

  // Handle "Select All" checkbox
  const handleSelectAllClasses = () => {
    if (selectedClasses.length === classOptions.length) {
      setSelectedClasses([]);
    } else {
      setSelectedClasses(classOptions);
    }
  };
  const handleSelectAllModules = () => {
    if (selectedModules.length === moduleOptions.length) {
      setSelectedModules([]);
    } else {
      setSelectedModules(moduleOptions);
    }
  };
  return (
    <div className="flex gap-4 p-4">
      <div>
        <div>
          <label className="font-semibold flex gap-2">
            Trainer <img src={Star} className=" h-[10px] mt-1" />
          </label>
          <Select
            mode="multiple"
            showSearch
            placeholder="Select Trainer"
            className="w-52"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            maxTagCount={2} // Show up to 2 tags, then show "+X" for additional selections
            dropdownRender={(menu) => (
              <div>
                {/* Custom Search Field */}
                <div className="p-2">
                  <Input
                    type="text"
                    placeholder="Search"
                    className="w-full px-2  border border-gray-300 rounded"
                  />
                </div>
                {menu}
              </div>
            )}
          >
            <Option value="Trang<33000">
              Trang&lt;33000 <CheckOutlined className="ml-2" />
            </Option>
            <Option value="Trang01">Trang01</Option>
            <Option value="Trang02">Trang02</Option>
            <Option value="Trang03">Trang03</Option>
          </Select>
        </div>
      </div>
      <div>
        <div>
          <label className="font-semibold flex gap-2">
            Class <img src={Star} className=" h-[10px] mt-1" />
          </label>
          <Select
            mode="multiple"
            value={selectedClasses}
            onChange={handleClassChange}
            placeholder="JAVA01,JAVA02,JAVA03"
            className="w-52"
            dropdownRender={() => (
              <div>
                <div>
                  {/* Custom Search Field */}
                  <div className="p-2">
                    <Input
                      type="text"
                      placeholder="Search"
                      className="w-full px-2  border border-gray-300 rounded"
                    />
                  </div>
                </div>
                <div className="p-2 ">
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
                        onChange={() => handleCheckboxChange(className)}
                      >
                        {className}
                      </Checkbox>
                    </div>
                  ))}
                </div>
              </div>
            )}
          >
            {/* Empty Option tags to allow controlled Select component */}
            {classOptions.map((className) => (
              <Option key={className} value={className} />
            ))}
          </Select>
        </div>
      </div>

      <div>
      <div>
          <label className="font-semibold flex gap-2">
            Module <img src={Star} className=" h-[10px] mt-1" />
          </label>
          <Select
            mode="multiple"
            value={selectedModules}
            onChange={handleModuleChange}
            placeholder="HTML,CSS,JS,REACTJS"
            className="w-52"
            dropdownRender={() => (
              <div>
                <div>
                  {/* Custom Search Field */}
                  <div className="p-2">
                    <Input
                      type="text"
                      placeholder="Search"
                      className="w-full px-2  border border-gray-300 rounded"
                    />
                  </div>
                </div>
                <div className="p-2 ">
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
                  {moduleOptions.map((className) => (
                    <div key={className} className="flex items-center mb-2">
                      <Checkbox
                        checked={selectedModules.includes(className)}
                        onChange={() => handleCheckboxChange(className)}
                      >
                        {className}
                      </Checkbox>
                    </div>
                  ))}
                </div>
              </div>
            )}
          >
            {/* Empty Option tags to allow controlled Select component */}
            {classOptions.map((className) => (
              <Option key={className} value={className} />
            ))}
          </Select>
        </div>
      </div>
      <div>
      <label className="font-semibold flex gap-2">
            Year <img src={Star} className=" h-[10px] mt-1" />
          </label>
        <RangePicker picker="year" className="w-52" />
      </div>
    </div>
  );
};

export default FilterSection;
