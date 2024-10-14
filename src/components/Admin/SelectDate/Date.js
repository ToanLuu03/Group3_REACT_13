import { DatePicker, Space } from 'antd'
import React from 'react'

function Date() {
    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };
    return (
        <div>
            <Space direction="vertical">
                <DatePicker onChange={onChange} className='choose-select' style={{ width: 140, height: 32 }} />
            </Space>
        </div>
    )
}

export default Date;
