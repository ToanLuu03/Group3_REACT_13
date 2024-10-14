import React, { useEffect, useState } from 'react'; 
import { SelectBox, SelectOption } from '../../../components/Admin/Selectbox/SelectBox';
import DataTable from '../../../components/Admin/Table/DataTable';
import { fetchDataClass } from '../../../api/ScheduleTracker_api';
import Date from '../../../components/Admin/SelectDate/Date';
import { Input } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';


function Class() {
    const [scheduleData, setScheduleData] = useState([]);
    const [classOptions, setClassOptions] = useState([]);
    const [moduleOptions, setModuleOptions] = useState([]);
    const [deliveryTypeOptions, setDeliveryTypeOptions] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [trainingFormatOptions, setTrainingFormatOptions] = useState([]);

    const [filteredScheduleData, setFilteredScheduleData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedClass, setSelectedClass] = useState([]);
    const [selectedModule, setSelectedModule] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState([]);

    const [showTable, setShowTable] = useState(false);
    const [deliveryOptions, setDeliveryOptions] = useState([]);
    const [trainingOptions, setTrainingOptions] = useState([]);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [selectedTraining, setSelectedTraining] = useState(null);

    const getScheduleDat = async () => {
        try {
            const resultClass = await fetchDataClass();
            console.log('rs',resultClass)
            console.log('Raw API response:', resultClass);

            if (Array.isArray(resultClass)) {
                setScheduleData(resultClass);
                setClassOptions(getUniqueOptions(resultClass, 'className'));
                setModuleOptions(getUniqueOptions(resultClass, 'moduleName'));
                setDeliveryTypeOptions(getUniqueOptions(resultClass, 'contentDeliveryType'));
                setStatusOptions(getUniqueOptions(resultClass, 'contentIsDone'));
                setTrainingFormatOptions(getUniqueOptions(resultClass, 'contentTrainingFormat'));
                setFilteredScheduleData(resultClass);
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
        getScheduleDat();
    }, []);

    useEffect(() => {
        if (selectedClass.length > 0) {
            const uniqueModules = [...new Set(scheduleData
                .filter(item => selectedClass.includes(item.className))
                .map(item => item.moduleName))];
            setModuleOptions(getUniqueOptions(scheduleData, 'moduleName').filter(option =>
                uniqueModules.includes(option.value)
            ));
            setSelectedModule([]);
            setSelectedModule(null);
        } else {
            setModuleOptions([]);
        }
    }, [selectedClass, scheduleData]);

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
    
    return (
        <div>
            <div className="classname">
                <div className='class-module'>
                    <span className='text'>Class</span> <br />
                    <SelectBox
                        onChange={handleSelectClass}
                        options={classOptions}
                        mode="multiple"
                    />
                </div>

                {selectedClass.length > 0 && (
                    <>
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

                        {/* Delivery Type Dropdown */}
                        
                    </>
                )}

                {selectedClass.length > 0 && (
                    <>
                       {/* Wrap Status and Training Format in a new div */}
                        {/* Status Dropdown */}
                       

                        {/* Training Format Dropdown */}
                      
                    </>
                )}
            </div>
            {selectedModule && (
                <div className='tracker-body d-flex'>
                   <div className='class-module'>
                            <span className='text'>Delivery Type</span> <br />
                            <SelectOption
                                onChange={handleSelectDelivery}
                                options={deliveryTypeOptions} 
                                mode="multiple"
                                showSearch
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </div>

                        <div className='class-module'>
                            <span className='text'>Training Format</span> <br />
                            <SelectOption
                                onChange={handleSelectTraining}
                                options={trainingFormatOptions} 
                                mode="multiple"
                                showSearch
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </div>

                        <div className='class-module'>
                            <span className='text'>Status</span> <br />
                            <SelectOption
                                onChange={handleSelectStatus}
                                options={statusOptions} 
                                mode="multiple"
                                showSearch
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().includes(input.toLowerCase())
                                }
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

export default Class;
