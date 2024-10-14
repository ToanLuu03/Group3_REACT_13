import { Tabs, Divider } from "antd";
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './TagMenu.css'
import TrainerInformation from "../../../pages/Trainer/TrainerInformationPage/TrainerInformationPage";
import TrainerUnitPrice from '../../../pages/Trainer/TrainerUnitPricePage/TrainerUnitPricePage'
import ClassList from "../../../pages/Trainer/ClassListPage/ClassListPage";
import Schedule from "../../../pages/Trainer/SchedulePage/SchedulePage";
import PortalPage from "../../../pages/Trainer/PortalPage/PortalPage";
import ReportPage from "../../../pages/Trainer/ReportPage/ReportPage";
const { TabPane } = Tabs;
function TagMenu({ titleMenu }) {
    const location = useLocation();
    const [activeKey, setActiveKey] = useState('1');
    const [currentTitle, setCurrentTitle] = useState('');

    useEffect(() => {
        if (location.state?.defaultActiveKey) {
            setActiveKey(location.state.defaultActiveKey);
        }
    }, [location]);

    useEffect(() => {
        switch (activeKey) {
            case '1':
                setCurrentTitle("Trainer Profile");
                break;
            case '2':
                setCurrentTitle("Trainer Profile - Trần Thị Bành Bạch");
                break;
            case '3':
                setCurrentTitle("Class List - Trần Thị Bành Bạch");
                break;
            case '4':
                setCurrentTitle("Trainer Calendar");
                break;
            case '5':
                setCurrentTitle("Report");
                break;
            default:
                setCurrentTitle("Statistics - Trần Thị Bành Bạch");
        }
    }, [activeKey]);
    return (
        <div>
            <div className='titleMenu'>{currentTitle}</div>
            <Divider style={{ margin: '15px 0px 0px' }} />
            <Tabs activeKey={activeKey} onChange={setActiveKey} size="large" style={{ margin: '0px 15px ' }}>
                <TabPane tab="Trainer Information" key="1">
                    <TrainerInformation />
                </TabPane>
                <TabPane tab="Trainer Unit Price" key="2">
                    <TrainerUnitPrice />
                </TabPane>
                <TabPane tab="Class List" key="3">
                    <ClassList />
                </TabPane>
                <TabPane tab="Schedule" key="4">
                    <Schedule />
                </TabPane>
                <TabPane tab="Schedule Tracker" key="5">
                    <ReportPage />
                </TabPane>
                <TabPane tab="Portal" key="6">
                    <PortalPage />
                </TabPane>
            </Tabs>
        </div>
    );
}

export default TagMenu;
