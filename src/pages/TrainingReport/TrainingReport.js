import { Tabs } from 'antd'
import React, { useState, useRef } from 'react'
import CategoryTrainingReport from '../../components/Header/Category/CategoryTrainingReport'
import SelectWithCheckboxes from '../../components/Admin/SelectWithCheckboxes/SelectWithCheckboxes'
import ExportModal from './ExportModal'

function TrainingReport() {
    const [showPopup, setShowPopup] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedModules, setSelectedModules] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const buttonRef = useRef(null);

    const handleExportClick = () => {
        setShowPopup(!showPopup);
    };

    const handleScheduleTrackerClick = () => {
        setShowPopup(false);
        setShowModal(true);
    };

    return (
        <div className='pt-16'>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Class Detail: ...</h1>
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
                                    Export Trainning Data
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

            <Tabs defaultActiveKey='1' items={CategoryTrainingReport} />
        </div>
    )
}

export default TrainingReport