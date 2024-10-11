import React, { useEffect, useState } from 'react';
import { Input, Select, Button, Modal, DatePicker } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { fetchDataClass } from '../../../api/ScheduleTracker_api';
import { SelectBox } from '../../../components/Admin/Selectbox/SelectBox';
import moment from 'moment';
import DataTable from '../../../components/Admin/Table/DataTable';

const { Option } = Select;

function Class() {
    const [scheduleData, setScheduleData] = useState([]);
    const [classOptions, setClassOptions] = useState([]);
    const [filteredScheduleData, setFilteredScheduleData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);
    const [moduleOptions, setModuleOptions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [selectedTraining, setSelectedTraining] = useState(null);

    const [trainingOptions, setTrainingOptions] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [deliveryOptions, setDeliveryOptions] = useState([]);

    const getScheduleData = async () => {
        try {
            const resultClass = await fetchDataClass();
            setScheduleData(resultClass);
            if (Array.isArray(resultClass)) {

                const deliveryTypes = [...new Set(resultClass.map(item => item.contentDeliveryType).filter(Boolean))];
                const deliveryOptions = deliveryTypes.map(type => ({ label: type, value: type }));
                const statusTypes = [...new Set(resultClass.map(item => item.contentName).filter(Boolean))];
                const statusOptions = statusTypes.map(type => ({ label: type, value: type }));
                const trainingTypes = [...new Set(resultClass.map(item => item.contentTrainingFormat).filter(Boolean))];
                const trainingOptions = trainingTypes.map(type => ({ label: type, value: type }));
                const classTypes = [...new Set(resultClass.map(item => item.className).filter(Boolean))];
                const classOptions = classTypes.map(type => ({ label: type, value: type }));
                const trainerTypes = [...new Set(resultClass.map(item => item.trainerId).filter(Boolean))];
                const trainerOptions = trainerTypes.map(type => ({ label: type, value: type }));


                setTrainingOptions(trainingOptions);
                setStatusOptions(statusOptions);
                setDeliveryOptions(deliveryOptions);



                setClassOptions(classOptions);
                setFilteredScheduleData(resultClass);
            } else {
                console.error('Result is not an array:', resultClass);
            }
        } catch (error) {
            console.error('Error fetching schedule data:', error);
        }
    };

    useEffect(() => {
        getScheduleData();
    }, []);

    const handleSelectClass = (value) => {
        setSelectedClass(value);
        setSelectedModule(null);
        setShowTable(false);

        // Filter modules based on the selected class
        const filteredModules = scheduleData
            .filter(item => item.className === value)
            .map(item => item.moduleName);

        // Remove duplicates and set the options
        const uniqueModules = Array.from(new Set(filteredModules)).map(moduleName => ({
            label: moduleName,
            value: moduleName,
        }));

        setModuleOptions(uniqueModules);
        filterScheduleData('className', value); // Initial filter by class
    };

    const handleSelectModule = (value) => {
        setSelectedModule(value);
        setShowTable(true);
        filterScheduleData('moduleName', value);
    };

    const filterScheduleData = (filterKey, selectedValue) => {
        // When filtering by module, check both class and module
        const filteredData = scheduleData.filter(item =>
            (filterKey === 'className' && item[filterKey] === selectedValue) ||
            (filterKey === 'moduleName' && item.moduleName === selectedValue && item.className === selectedClass) // Ensure class matches
        );

        setFilteredScheduleData(filteredData);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="classname">
                <div className='class-module'>
                    <span className='text'>Class</span> <br />
                    <SelectBox onChange={handleSelectClass} options={classOptions} />
                </div>
                {selectedClass && (
                    <div className='class-module'>
                        <span className='text'>Module</span> <br />
                        <SelectBox
                            onChange={handleSelectModule}
                            options={moduleOptions}
                            style={{ width: 500 }}
                            showSearch
                            filterOption={(input, option) =>
                                option.label.toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </div>
                )}
            </div>



            {/* <Modal title="Filter Options" open={isModalOpen} footer={null} closable={false} onCancel={handleCancel}>
                <div className='tracker-by'>
                    <div className='options'>
                        <span className='text'>Status</span> <br />
                        <Select
                            options={statusOptions}
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            placeholder="Please select status..."
                            showSearch
                            filterOption={(input, option) =>
                                option.label.toLowerCase().includes(input.toLowerCase())
                            }
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div className='options'>
                        <span className='text'>Delivery Type</span> <br />
                        <Select
                            options={deliveryOptions}
                            value={selectedDelivery}
                            onChange={setSelectedDelivery}
                            placeholder="Please select delivery..."
                            showSearch
                            filterOption={(input, option) =>
                                option.label.toLowerCase().includes(input.toLowerCase())
                            }
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div className='options'>
                        <span className='text'>Training Format</span> <br />
                        <Select
                            options={trainingOptions}
                            value={selectedTraining}
                            onChange={setSelectedTraining}
                            placeholder="Please select training format..."
                            showSearch
                            filterOption={(input, option) =>
                                option.label.toLowerCase().includes(input.toLowerCase())
                            }
                            style={{ width: '100%' }}
                        />
                    </div>

                   
                    <div className='select'>
                        <span className='text'>Schedule (Start)</span>
                        <DatePicker style={{ width: '100%' }} />
                    </div>
                    <div className='select'>
                        <span className='text'>Schedule (End)</span>
                        <DatePicker style={{ width: '100%' }} />
                    </div>
                    <div className='select'>
                        <span className='text'>Actual (Start)</span>
                        <DatePicker style={{ width: '100%' }} />
                    </div>
                    <div className='select'>
                        <span className='text'>Actual (End)</span>
                        <DatePicker style={{ width: '100%' }} />
                    </div>
                </div>
            </Modal> */}

            {/* Schedule Table */}
            {showTable && (
                <div>
                    <h2>Trainer Schedule Table</h2>
                    <DataTable data={filteredScheduleData} /> {/* Pass filteredScheduleData as a prop */}
                </div>
            )}
        </div>
    );
}

export default Class;
