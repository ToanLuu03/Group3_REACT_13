import React, { useState } from "react";
import { Select, Checkbox, Input } from "antd";
import './SelectWithCheckboxes.css';

const SelectWithCheckboxes = ({ options, selectedState, setState, placeholder, inputStyle, onDropdownVisibleChange }) => {
    const [searchValue, setSearchValue] = useState("");

    const handleSelectAll = () => {
        if (selectedState.length === options.length) {
            setState([]);
        } else {
            setState(options);
        }
    };

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <Select
            mode="multiple"
            placeholder={placeholder}
            maxTagCount="responsive"
            onChange={setState}
            value={selectedState}
            style={inputStyle}
            onDropdownVisibleChange={onDropdownVisibleChange}
            dropdownStyle={{ overflow: 'hidden' }}
            dropdownRender={(menu) => (
                <div className="custom-dropdown">
                    <div className="search-container">
                        <Input
                            placeholder="Search"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>

                    <div className="dropdown-container">
                        <Checkbox
                            onChange={handleSelectAll}
                            checked={selectedState.length === options.length}
                        >
                            Select All
                        </Checkbox>
                    </div>
                    <div className="options-container">
                        {filteredOptions.map(option => (
                            <div className="option-item" key={option}>
                                <Checkbox
                                    checked={selectedState.includes(option)}
                                    onChange={() => {
                                        if (selectedState.includes(option)) {
                                            setState(selectedState.filter(item => item !== option));
                                        } else {
                                            setState([...selectedState, option]);
                                        }
                                    }}
                                />
                                <span className="option-item-text">{option}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        />
    );
};

export default SelectWithCheckboxes;