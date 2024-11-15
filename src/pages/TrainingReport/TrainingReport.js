import { Tabs } from 'antd'
import React, { useState, useRef, useEffect } from 'react'
import CategoryTrainingReport from '../../components/Header/Category/CategoryTrainingReport'
import ExportModal from './ExportModal'

function TrainingReport() {
    const [showPopup, setShowPopup] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedModules, setSelectedModules] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('1');  // Manage active tab key
    const [displayTabLabel, setDisplayTabLabel] = useState(null);  // Manage active tab label

    const buttonRef = useRef(null);

    const handleExportClick = () => {
        setShowPopup(!showPopup);
    };

    const handleScheduleTrackerClick = () => {
        setShowPopup(false);
        setShowModal(true);
    };

    const onTabChange = (key) => {
        setActiveTab(key);  // Update active tab when tab changes
    };

    // Update the displayTabLabel when activeTab changes
    useEffect(() => {
        const classcode = localStorage.getItem('classcode');

        if (activeTab === '1') {
            setDisplayTabLabel(`Class Details: ${classcode}`);
        } else if (activeTab === '2') {
            setDisplayTabLabel(`Class Details: ${classcode}`);
        } else if (activeTab === '3') {
            setDisplayTabLabel(`Class Details: ${classcode}`);
        } else if (activeTab === '4') {
            setDisplayTabLabel(`Class Details: ${classcode}`);
        } else if (activeTab === '5') {
            setDisplayTabLabel(`Class Details: ${classcode}`);
        } else if (activeTab === '6') {
            setDisplayTabLabel(`Class Details: ${classcode}`);
        } else {
            setDisplayTabLabel("Unknown Tab"); // Fallback label if no match is found
        }
    }, [activeTab]);  // Trigger effect whenever activeTab changes

    return (
        <div className='pt-16'>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">{displayTabLabel}</h1> {/* Display active tab label */}
                <div className="relative">
                    <button
                        ref={buttonRef}
                        className="bg-blue-600 p-2 rounded-[30px] mr-8"
                        onClick={handleExportClick}
                    >
                        <span className="text-white font-semibold">Export data</span>
                    </button>

                    {showPopup && (
                        <div className="absolute right-8 top-full mt-2 bg-white shadow-lg rounded-lg border border-gray-200 w-48 z-10">
                            <div className="py-1">
                                <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
                                    Export Training Data
                                </button>
                                <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
                                    Export OJT Training Data
                                </button>
                                <button
                                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                                    onClick={handleScheduleTrackerClick}
                                >
                                    Export Schedule Tracker Data
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ExportModal
                showModal={showModal}
                setShowModal={setShowModal}
                selectedModules={selectedModules}
                setSelectedModules={setSelectedModules}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
            />

            <Tabs
                defaultActiveKey='1'
                activeKey={activeTab}
                onChange={onTabChange} // Set the active tab on change
                items={CategoryTrainingReport}
            />
        </div>
    )
}

export default TrainingReport;
