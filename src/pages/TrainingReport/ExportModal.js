import React from 'react';
import { useState, useEffect } from 'react';
import { Modal } from 'antd';
import SelectWithCheckboxes from '../../components/Admin/SelectWithCheckboxes/SelectWithCheckboxes';
import { useLocation } from 'react-router-dom';
import TrainerAPI from '../../services/trainer';
import { exportSchedule } from '../../api/TrainingReportAPI/ClassList_api';

function ExportModal({ 
    showModal, 
    setShowModal, 
    selectedModules, 
    setSelectedModules, 
    isDropdownOpen, 
    setIsDropdownOpen 
}) {
    const [moduleOptions, setModuleOptions] = useState([]);
    const location = useLocation();
    const classId = location.state?.classId;
    const [moduleData, setModuleData] = useState([]);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await TrainerAPI.getScheduleByClass(token, classId);
                setModuleData(response.data);
                const moduleNames = response.data.map(module => module.name);
                setModuleOptions(moduleNames);
            } catch (error) {
                console.error('Error fetching modules:', error);
            }
        };

        fetchModules();
    }, []);

    const handleSubmit = async () => {
        try {
            const selectedModuleIds = moduleData
                .filter(module => selectedModules.includes(module.name))
                .map(module => module.id);
            
            if (selectedModuleIds.length === 0) {
                throw new Error('Please select at least one module');
            }
            
            await exportSchedule(selectedModuleIds);
            setShowModal(false);
        } catch (error) {
            console.error('Error exporting schedule:', error);
           
        }
    };


    return (
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
                        handleSubmit();
                        setShowModal(false);
                    }}
                >
                    Submit
                </button>
            ]}
            width={600}
            styles={{
                content: {
                    height: isDropdownOpen ? '520px' : '280px',
                    padding: 0,
                    transition: 'height 0.5s ease',
                },
                header: {
                    background: '#6366f1',
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
    );
}

export default ExportModal;