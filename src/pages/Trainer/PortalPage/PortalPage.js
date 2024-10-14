import React, { useEffect, useState } from "react";
import { Tabs, DatePicker } from "antd";
import GpaChart from "../../../components/Trainer/GpaChart/GpaChart.js";
import FeedbackChart from "../../../components/Trainer/FeedbackChart/FeedbackChart.js";
import SelectWithCheckboxes from '../../../components/Trainer/SelectWithCheckboxes/SelectWithCheckboxes.js'
import { topicsDataStatic, classesDataStatic, metricsDataStatic } from "../../../data/staticData.js";
import { useOutletContext } from 'react-router-dom';
import './PortalPage.css';  

const { RangePicker } = DatePicker;

const PortalPage = () => {
    const { selectMenuItem } = useOutletContext();
    useEffect(() => {
        selectMenuItem('3');
    }, [selectMenuItem]);

    const [dateRange, setDateRange] = useState([null, null]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [selectedGpaClasses, setSelectedGpaClasses] = useState([]);
    const [selectedFeedbackClasses, setSelectedFeedbackClasses] = useState([]);
    const [selectedMetrics, setSelectedMetrics] = useState([]);
    const [activeTab, setActiveTab] = useState('1');

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
                    <div className="portal-page">   
                        <div className="select-container">
                            <div>
                                <h4>Select Topics</h4>
                                <SelectWithCheckboxes
                                    inputStyle={{ width: 250 }}
                                    options={topicsDataStatic}
                                    selectedState={selectedTopics}
                                    setState={setSelectedTopics}
                                    placeholder={topicsDataStatic.join(', ')}
                                />
                            </div>
                            <div>
                                <h4>Select Classes</h4>
                                <SelectWithCheckboxes
                                    inputStyle={{ width: 250 }}
                                    options={classesDataStatic}
                                    selectedState={selectedGpaClasses}
                                    setState={setSelectedGpaClasses}
                                    placeholder={classesDataStatic.join(', ')}
                                />
                            </div>
                            <div>
                                <h4>Select Date Range</h4>
                                <RangePicker
                                    value={dateRange}
                                    onChange={handleDateRangeChange}
                                    format="YYYY"
                                    picker="year"
                                    placeholder={['Start Year', 'End Year']}
                                />
                            </div>
                        </div>
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
        {
            key: '2',
            label: 'Feedback',
            children: (
                <div className="container-portal">
                    <div className="select-container">
                        <div>
                            <h4>Select Metrics</h4>
                            <SelectWithCheckboxes
                                inputStyle={{ width: 250 }}
                                options={metricsDataStatic}
                                selectedState={selectedMetrics}
                                setState={setSelectedMetrics}
                                placeholder={metricsDataStatic.join(', ')}
                            />
                        </div>
                        <div>
                            <h4>Select Classes</h4>
                            <SelectWithCheckboxes
                                inputStyle={{ width: 250 }}
                                options={classesDataStatic}
                                selectedState={selectedFeedbackClasses}
                                setState={setSelectedFeedbackClasses}
                                placeholder={classesDataStatic.join(', ')}
                            />
                        </div>
                        <div>
                            <h4>Select Date Range</h4>
                            <RangePicker
                                value={dateRange}
                                onChange={handleDateRangeChange}
                                format="YYYY"
                                picker="year"
                                placeholder={['Start Year', 'End Year']}
                            />
                        </div>
                    </div>

                    {selectedMetrics.length > 0 && selectedFeedbackClasses.length > 0 && dateRange[0] && dateRange[1] && (
                        <div className="chart-title">
                            <p>Feedback Bar Chart</p>
                        </div>
                    )}

                    <FeedbackChart selectedMetrics={selectedMetrics} selectedClasses={selectedFeedbackClasses} dateRange={dateRange} />
                </div>
            )
        }
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
