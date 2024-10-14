import React from 'react'
import './ReportPage.css';  // Import the external CSS file
import { Tabs } from "antd";
import { useEffect } from "react";
import { useOutletContext } from 'react-router-dom';
import TabReport from '../../../components/Trainer/TabReport/TabReport';
import TabTraining from '../../../components/Trainer/TabTraining/TabTraining';
function ReportPage() {
    const { selectMenuItem } = useOutletContext();
    useEffect(() => {
        selectMenuItem('3');
    }, [selectMenuItem]);
    const tabItems = [
        {
            key: '1',
            label: "Training",
            children: (
                <div className='container-tracker'>
                    <TabTraining />
                </div>
            )
        },
        {
            key: '2',
            label: "Report",
            children: (
                <div className='container-tracker'>
                    <TabReport />
                </div>
            )
        },

    ]
    return (
        <div>
            <Tabs defaultActiveKey='1' centered items={tabItems} />
        </div>
    )
}

export default ReportPage