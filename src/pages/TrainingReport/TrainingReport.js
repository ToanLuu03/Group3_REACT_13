import { Tabs, Modal } from 'antd'
import React, { useState, useRef } from 'react'
import CategoryTrainingReport from '../../components/Header/Category/CategoryTrainingReport'
import SelectWithCheckboxes from '../../components/Admin/SelectWithCheckboxes/SelectWithCheckboxes'

function TrainingReport() {
    const [showPopup, setShowPopup] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedModules, setSelectedModules] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const buttonRef = useRef(null);

    const moduleOptions = ['Module 1', 'Module 2', 'Module 3', 'Module 4', 'Module 5', 'Module 5', 'Module 5'];

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

            <Modal
                open={showModal}
                onCancel={() => setShowModal(false)}
                title={
                    <div className="text-2xl font-normal text-white">
                        Export Schedule Tracker data
                    </div>
                }
                footer={[
                    <button 
                        key="cancel"
                        className="mr-5 px-4 py-2 border rounded"
                        onClick={() => setShowModal(false)}
                    >
                        Cancel
                    </button>,
                    <button 
                        key="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                        onClick={() => {
                            console.log('Selected modules:', selectedModules);
                            setShowModal(false);
                        }}
                    >
                        Submit
                    </button>
                ]}
                width={600}
                
                styles={{
                    content: {
                        height: isDropdownOpen ? '520px' : '280px', // Expand when dropdown is open
                        padding: 0,
                        transition: 'height 0.5s ease', // Smooth transition
                    },

                    header: {
                        background: '#6366f1', // Purple background
                        padding: '16px 24px',
                    },
                    
                 body: {
                    padding: '16px 24px',
                    },

                    footer: {
                        padding: '16px 24px',
                    }

                }}
                classNames={{
                    header: 'rounded-t-lg',
                }}
            >
                <div className="mb-4">
                    <label className="block mb-2">Module</label>
                    <SelectWithCheckboxes
                        options={moduleOptions}
                        selectedState={selectedModules}
                        setState={setSelectedModules}
                        placeholder="Please select module"
                        inputStyle={{ width: '100%' }}
                        onDropdownVisibleChange={(visible) => setIsDropdownOpen(visible)} 
                    />
                </div>
            </Modal>

            <Tabs defaultActiveKey='1' items={CategoryTrainingReport} />
        </div>
    )
}

export default TrainingReport