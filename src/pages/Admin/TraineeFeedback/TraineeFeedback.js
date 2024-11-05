import React, { useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import ClassTemplate from './ClassTemPlate/ClassTemPlate';
import CustomTemplate from './CustomTemPlate/CustomTemPlate';
import FeedBack from './FeedBack/FeedBack';
import { Tabs, Menu } from 'antd';

const TraineeFeedback = () => {
    const [activeKey, setActiveKey] = useState('1');



    const tabItems = [
        {
            key: '1',
            label: "Class Template",
            children: <ClassTemplate setActiveKey={setActiveKey} />, // Pass setActiveKey as prop
        },
        {
            key: '2',
            label: "Custom Template",
            children: <CustomTemplate setActiveKey={setActiveKey}/>,
        },
        {
            key: '3',
            label: "Feedback",
            children: <FeedBack setActiveKey={setActiveKey}/>,
        },
    ];

    return (
        <div className='pt-16'>
            <h1 className="text-xl font-semibold mb-4">Trainee Feedback</h1>
            
            <Tabs 
                activeKey={activeKey}
                onChange={setActiveKey}
                items={tabItems.map(item => ({
                    ...item,
                    children: (
                        <div className='container-tracker'>
                            {item.children}
                        </div>
                    ),
                }))} 
            />
        </div>
    );
}

export default TraineeFeedback;
