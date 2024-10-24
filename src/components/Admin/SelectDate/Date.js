import { DatePicker, Space } from 'antd';
import React from 'react';
function Date({ onChange, dateKey, className }) {
    const handleChange = (date, dateString) => {
        onChange(dateKey, dateString);
    };

    return (
        <div>
            <Space direction="vertical">
                <DatePicker
                    onChange={handleChange}
                    className={className}
            //        style={{ width: 140, height: 32 }}
                    format="YYYY-MM-DD"
                />
            </Space>
        </div>
    );
}

export default Date;
