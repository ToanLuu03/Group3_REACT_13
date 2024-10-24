import React from 'react'
import './ReportPage.css';  // Import the external CSS file
import { Tabs } from "antd";
import TabReport from '../../../components/Trainer/TabReport/TabReport';
import TabTraining from '../../../components/Trainer/TabTraining/TabTraining';
function ReportPage() {

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