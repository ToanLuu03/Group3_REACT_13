import React, { useEffect, useState } from 'react';
import { Tabs, Divider } from "antd";
import { useLocation } from 'react-router-dom';
import TrainerProfile from '../../../pages/Admin/TrainerProfilePage/TrainerProfile';
import TrainerUnitPricePage from '../../../pages/Admin/TrainerUnitPricePage/TrainerUinitPricePage';
import ClassListPages from '../../../pages/Admin/ClassListPages/ClassListPages';
import SchedulePage from '../../../pages/Admin/SchedulePage/SchedulePage';
import PortalPage from '../../../pages/Admin/PortalPage/PortalPage';
const { TabPane } = Tabs;

function TagMenu({ titleMenu }) {
    const location = useLocation();
    const [activeKey, setActiveKey] = useState('1');
    useEffect(() => {
        if (location.state?.defaultActiveKey) {
            setActiveKey(location.state.defaultActiveKey);
        }
    }, [location]);
    return (
        <div>
            <div>
                <div className='titleMenu'>{titleMenu}</div>
                <Divider style={{ margin: '15px 0px 0px' }} />
                <Tabs activeKey={activeKey} onChange={setActiveKey} size="large" style={{ margin: '0px 15px ' }}>
                    <TabPane tab="Trainer Information" key="1">
                        <TrainerProfile />
                    </TabPane>
                    <TabPane tab="Trainer Unit Price" key="2">
                        <TrainerUnitPricePage />
                    </TabPane>
                    <TabPane tab="Class List" key="3">
                        <ClassListPages />
                    </TabPane>
                    <TabPane tab="Schedule" key="4">
                        <SchedulePage />
                    </TabPane>
                    <TabPane tab="Schedule Tracker" key="5">
                        chưa add
                    </TabPane>
                    <TabPane tab="Portal" key="6">
                        <PortalPage />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    )
}

export default TagMenu