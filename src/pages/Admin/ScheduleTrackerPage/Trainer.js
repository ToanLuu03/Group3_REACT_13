import React, { useEffect, useState } from 'react';
import { Input, Button, Modal } from 'antd';
import { fetchDataTrainer } from '../../../api/ScheduleTracker_api';
import { SelectBox, SelectOption } from '../../../components/Admin/Selectbox/SelectBox';
import Date from '../../../components/Admin/SelectDate/Date';
import DataTable from '../../../components/Admin/Table/DataTable';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import './ScheduleTrackerPage.css';

function Trainer() {
    const [scheduleData, setScheduleData] = useState([]);
    const [trainerOptions, setTrainerOptions] = useState([]);
    const [classOptions, setClassOptions] = useState([]);
    const [moduleOptions, setModuleOptions] = useState([]);
    const [filteredScheduleData, setFilteredScheduleData] = useState([]);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [selectedClass, setSelectedClass] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [showTable, setShowTable] = useState(false);
    const [deliveryOptions, setDeliveryOptions] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [trainingOptions, setTrainingOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedTraining, setSelectedTraining] = useState(null);

    const getScheduleData = async () => {
        try {
            const resultData = await fetchDataTrainer();
            if (Array.isArray(resultData)) {
                setScheduleData(resultData);
                setTrainerOptions(getUniqueOptions(resultData, 'trainerId'));
                setClassOptions(getUniqueOptions(resultData, 'className'));
                setFilteredScheduleData(resultData);
            }
        } catch (error) {
            console.error('Error fetching schedule data:', error);
        }
    };

    const getUniqueOptions = (data, key) => {
        return [...new Set(data.map(item => item[key]).filter(Boolean))].map(option => ({
            label: option,
            value: option,
        }));
    };

    useEffect(() => {
        getScheduleData();
    }, []);

    const handleSelectTrainer = (value) => {
        setSelectedTrainer(value);
        resetFilters();
    };

    const handleSelectClass = (values) => {
        setSelectedClass(values);
        setShowTable(true);
        filterScheduleData(values, selectedModule);
    };

    const handleSelectModule = (value) => {
        setSelectedModule(value || null);
        const filteredData = scheduleData.filter(item =>
            selectedClass.includes(item.className) &&
            (value ? item.moduleName === value : true)
        );
        //    updateOptions(filteredData);
        filterScheduleData(selectedClass, value);
    };

    const updateOptions = (filteredData) => {
        if (!filteredData || !Array.isArray(filteredData) || filteredData.length === 0) {
            setDeliveryOptions([]);
            setTrainingOptions([]);
            setStatusOptions([]);
            return;
        }
        const deliveryTypes = [...new Set(scheduleData.map(item => item.contentDeliveryType).filter(Boolean))];
        const deliveryOptions = deliveryTypes.map(type => ({ label: type, value: type }));
        setDeliveryOptions(deliveryOptions);
        const trainingFormats = [...new Set(scheduleData.map(item => item.contentTrainingFormat).filter(Boolean))];
        const trainingOptions = trainingFormats.map(type => ({ label: type, value: type }));
        setTrainingOptions(trainingOptions);
        const statuses = [...new Set(scheduleData.map(item => item.contentIsDone ? 'Reported' : 'On going'))];
        const statusOptions = statuses.map(type => ({ label: type, value: type }));
        setStatusOptions(statusOptions);

    };
    useEffect(() => {
        filterScheduleData(selectedClass, selectedModule, selectedDelivery, selectedStatus, selectedTraining, searchTerm);
    }, [selectedClass, selectedModule, selectedDelivery, selectedStatus, selectedTraining, searchTerm]);
    useEffect(() => {
        if (selectedClass.length > 0) {
            const uniqueModules = [...new Set(scheduleData
                .filter(item => selectedClass.includes(item.className))
                .map(item => item.moduleName))];
            setModuleOptions(uniqueModules.map(module => ({ label: module, value: module })));
            setSelectedModule(null);
        } else {
            setModuleOptions([]);
        }
    }, [selectedClass, scheduleData]);


    const resetFilters = () => {
        setSelectedClass([]);
        setSelectedModule([]); // Set to an empty array
        setSelectedDelivery([]);
        setSelectedTraining([]);
        setSelectedStatus([]);
        setFilteredScheduleData(scheduleData); // Reset to original data
    };

    const filterScheduleData = (classes, module, delivery, status, training, searchTerm) => {
        const modulesToCheck = module || [];
        const deliveryCheck = delivery || [];
        const statusCheck = status || [];
        const trainingCheck = training || [];

        const filteredData = scheduleData.filter(item => {
            const classMatch = classes.length === 0 || classes.includes(item.className);
            const moduleMatch = (modulesToCheck.length === 0 || modulesToCheck.includes(item.moduleName));
            const deliveryMatch = deliveryCheck.length === 0 || deliveryCheck.some(deliveryType => item.contentDeliveryType === deliveryType);
            const statusMatch = statusCheck.length === 0 ||
                (item.contentIsDone ? 'Reported' : 'On going') && statusCheck.includes(item.contentIsDone ? 'Reported' : 'On going');
            const trainingMatch = trainingCheck.length === 0 || (item.contentTrainingFormat && trainingCheck.includes(item.contentTrainingFormat));
            const searchMatch = !searchTerm || (item.contentDeliveryType && item.contentDeliveryType.toLowerCase().includes(searchTerm.toLowerCase()));
            return classMatch && moduleMatch && deliveryMatch && statusMatch && trainingMatch && searchMatch;
        });

        setFilteredScheduleData(filteredData);
        updateOptions(filteredData);
    };


    const handleSelectDelivery = (values) => {
        setSelectedDelivery(values);
        filterScheduleData(selectedClass, selectedModule, values, null, null);
    };

    const handleSelectTraining = (values) => {
        setSelectedTraining(values);
        filterScheduleData(selectedClass, selectedModule, null, null, values);
    };

    const handleSelectStatus = (values) => {
        setSelectedStatus(values);
        filterScheduleData(selectedClass, selectedModule, null, values, null);
    };

    return (
        <div>
            <div className="trainer-selection">
                <div className='trainer'>
                    <span className='text'>Trainer</span>
                    <br />
                    <SelectBox
                        onChange={handleSelectTrainer}
                        options={trainerOptions}
                    />
                </div>
                <div className='d-flex '>
                    {selectedTrainer && (<div className='class-module'>
                        <span className='text'>Class</span> <br />
                        <SelectBox
                            onChange={handleSelectClass}
                            options={classOptions}
                            mode="multiple"
                        />
                    </div>)}
                    {selectedClass.length > 0 && (
                        <div className='class-module'>
                            <span className='text'>Module</span> <br />
                            <SelectBox
                                onChange={handleSelectModule}
                                options={moduleOptions}
                                showSearch
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </div>
                    )}
                </div>
            </div>

            {selectedModule && (
                <div className='tracker-body d-flex'>
                    <div className='options'>
                        <span className='text'>Delivery Type</span> <br />
                        <SelectOption
                            isMulti
                            options={deliveryOptions}
                            value={selectedDelivery}
                            onChange={handleSelectDelivery}
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
                        <SelectOption
                            options={trainingOptions}
                            value={selectedTraining}
                            onChange={handleSelectTraining}
                            placeholder="Please select training format..."
                            showSearch
                            filterOption={(input, option) =>
                                option.label.toLowerCase().includes(input.toLowerCase())
                            }
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div className='options'>
                        <span className='text'>Status</span> <br />
                        <SelectOption
                            options={statusOptions}
                            value={selectedStatus}
                            onChange={handleSelectStatus}
                            placeholder="Please select status..."
                            showSearch
                            filterOption={(input, option) =>
                                option.label.toLowerCase().includes(input.toLowerCase())
                            }
                            style={{ width: '100%' }}
                        />
                    </div>

                    {/* Select Date */}
                    <div className='select'>
                        <span className='text'>Schedule (Start)</span>
                        <Date />
                    </div>
                    <div className='select'>
                        <span className='text'>Schedule (End)</span>
                        <Date />
                    </div>
                    <div className='select'>
                        <span className='text'>Actual (Start)</span>
                        <Date />
                    </div>
                    <div className='select'>
                        <span className='text'>Actual (End)</span>
                        <Date />
                    </div>

                    <div className=''>
                        <span className='text'>Search</span>
                        <div className='d-flex'>
                            <Input
                                placeholder='Search...'
                                className='search'
                                style={{ marginLeft: 0, width: '150px' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className='icon'>
                                <a href='#1'><SearchOutlined className='search-icon' /></a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showTable && (
                <div>
                    <h2>Trainer Schedule Table</h2>
                    <DataTable data={filteredScheduleData} />
                </div>
            )}
        </div>
    );
}

export default Trainer;
