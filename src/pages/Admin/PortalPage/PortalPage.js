import React, { useEffect, useState } from "react";
import { Tabs, DatePicker } from "antd";
import GpaChart from "../../../components/Admin/GpaChart/GpaChart.js";
import FeedbackChart from "../../../components/Admin/FeedbackChart/FeedbackChart.js";
import SelectWithCheckboxes from '../../../components/Admin/SelectWithCheckboxes/SelectWithCheckboxes.js'
import { topicsDataStatic, classesDataStatic, metricsDataStatic } from "../../../data/staticData.js";
import { useOutletContext } from 'react-router-dom';
import { Row, Col, Grid, Typography } from "antd"; // Import Ant Design's Grid components
import './PortalPages.css';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const PortalPage = () => {
    

    const [dateRange, setDateRange] = useState([null, null]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [selectedGpaClasses, setSelectedGpaClasses] = useState([]);
    const [selectedFeedbackClasses, setSelectedFeedbackClasses] = useState([]);
    const [selectedMetrics, setSelectedMetrics] = useState([]);
    const [activeTab, setActiveTab] = useState('1');
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint(); 

    const handleDateRangeChange = (dates) => {
        if (dates) {
            setDateRange(dates);
        } else {
            setDateRange([null, null]);
        }
    };

    const handleTabClick = (key) => {
        setActiveTab(key);

        if (key === '1') {
            setSelectedTopics([]);
            setSelectedGpaClasses([]);
            setDateRange([null, null]);
        }

        if (key === '2') {
            setSelectedMetrics([]);
            setSelectedFeedbackClasses([]);
            setDateRange([null, null]);
        }
    };

    const tabItems = [
        {
            key: '1',
            label: 'GPA',
            children: (
                <div className="container-portal">
                    <div>
                        <Row gutter={[16, 16]}>
                            {/* Select Topics */}
                            <Col xs={24} sm={12} md={12} xl={8}>
                                <Typography.Title level={3}> Select Topics</Typography.Title >
                                <SelectWithCheckboxes
                                    inputStyle={{  width: screens.xs ? '90%' : '250px' }}  // Responsive width
                                    options={topicsDataStatic}
                                    selectedState={selectedTopics}
                                    setState={setSelectedTopics}
                                    placeholder={topicsDataStatic.join(', ')}
                                />
                            </Col>

                            {/* Select Classes */}
                            <Col xs={24} sm={12} md={12} xl={8}>
                            <Typography.Title level={3}> Select Classes</Typography.Title >
                                <SelectWithCheckboxes
                                    inputStyle={{ width: screens.xs ? '90%' : '250px' }}  // Responsive width
                                    options={classesDataStatic}
                                    selectedState={selectedGpaClasses}
                                    setState={setSelectedGpaClasses}
                                    placeholder={classesDataStatic.join(', ')}
                                />
                            </Col>

                            <Col xs={24} sm={12} md={12} xl={8}>
                            <Typography.Title level={3}> Select Date Range</Typography.Title >
                                <RangePicker
                                style={{ width: screens.xs ? '90%' : '250px' }}
                                    value={dateRange}
                                    onChange={handleDateRangeChange}
                                    format="YYYY"
                                    picker="year"
                                    placeholder={['Start Year', 'End Year']}
                                />
                            </Col>

                        </Row>
                    </div>

                    {selectedTopics.length > 0 && selectedGpaClasses.length > 0 && dateRange[0] && dateRange[1] && (
                        <div className="chart-title">
                            <p>GPA Bar Chart</p>
                        </div>
                    )}

                    <GpaChart selectedTopics={selectedTopics} selectedClasses={selectedGpaClasses} dateRange={dateRange} />
                </div>
            )
        },

    ];

    return (
        <div>
            <div>
                <div>
                    <Tabs defaultActiveKey="1" centered items={tabItems} onTabClick={handleTabClick} />
                </div>
            </div>
        </div>
    );
};

export default PortalPage;
