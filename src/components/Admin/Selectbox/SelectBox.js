import { Select } from 'antd'
import React from 'react'

export const SelectBox = ({ options, onChange, className, placeholder }) => {
    return (
        <div>
            <Select
                options={options}
                onChange={onChange}
                className={className}
                placeholder={placeholder}
                maxTagCount={1}
                maxTagPlaceholder={() => '...'}
                //        style={{ width: 350, height: 32 }}
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
export const SelectOption = ({ options, value, onChange, placeholder, className }) => {
    return (
        <div>
            <Select
                //        mode="multiple"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={className}
                maxTagCount={1}
                maxTagPlaceholder={() => '...'}
                //    style={{ width: 140, height: 32 }}
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



