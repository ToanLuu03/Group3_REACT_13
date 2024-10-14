import { Select } from 'antd'
import React from 'react'

export const SelectBox = ({ options, onChange }) => {
    return (
        <div>
            <Select
                mode="multiple"
                options={options}
                onChange={onChange}
                className='select-option'
                maxTagCount={1}
                maxTagPlaceholder={() => '...'}
                style={{ width: 400, height: 32 }}
                tagRender={(props) => {
                    const { label } = props;
                    return (
                        <span className='select-option1'>
                            {label}
                        </span>
                    );
                }}
            />
        </div>
    );
}

const { Option } = Select;
export const SelectOption = ({ options, value, onChange, placeholder }) => {
    return (
        <div>
            <Select
                mode="multiple"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className='choose-select'
                maxTagCount={3}
                maxTagPlaceholder={() => '...'}
                style={{ width: 140, height: 32 }}
                tagRender={(props) => {
                    const { label } = props;
                    return (
                        <span className='select-option'>
                            {label}
                        </span>
                    );
                }}
            >
                {options.map(option => (
                    <Option key={option.value} value={option.value} style={{ paddingRight: 10 }}>
                        {option.label}
                    </Option>
                ))}
            </Select>
        </div>
    );
};



