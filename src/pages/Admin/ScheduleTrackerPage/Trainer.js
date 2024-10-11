import React, { useState, useEffect } from 'react';
import { SelectBox } from '../../../components/Admin/Selectbox/SelectBox';
import { fetchDataTrainer } from '../../../api/ScheduleTracker_api';
import DataTable from '../../../components/Admin/Table/DataTable';

function Trainer() {
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [scheduleData, setScheduleData] = useState([]);
    const [classOptions, setClassOptions] = useState([]);
    const [filteredScheduleData, setFilteredScheduleData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);
    const [moduleOptions, setModuleOptions] = useState([]);
    const [trainerOptions, setTrainerOptions] = useState([]);

    const getScheduleDataTrainer = async () => {
        try {
            const resultData = await fetchDataTrainer();
            setScheduleData(resultData);

            // Set trainer options based on fetched data
            const trainers = [...new Set(resultData.map(item => item.trainerId))];
            const options = trainers.map(trainer => ({ label: `Trainer ${trainer}`, value: trainer }));
            setTrainerOptions(options);

            // Set class options based on fetched data
            const classTypes = [...new Set(resultData.map(item => item.className).filter(Boolean))];
            const classOptions = classTypes.map(type => ({ label: type, value: type }));
            setClassOptions(classOptions);
        } catch (error) {
            console.error('Error fetching schedule data:', error);
        }
    };

    useEffect(() => {
        getScheduleDataTrainer();
    }, []);

    const handleSelectTrainer = (value) => {
        setSelectedTrainer(value);
        setSelectedClass(null);
        setSelectedModule(null);
        setShowTable(false);
    };

    const handleSelectClass = (value) => {
        setSelectedClass(value);
        setSelectedModule(null); // Reset selected module when class changes
        setShowTable(false); // Hide table until module is selected

        // Log the selected class for debugging
        console.log("Selected class:", value);

        // Filter modules based on the selected class
        const filteredModules = Array.from(
            new Set(
                scheduleData
                    .filter(item => item.className === value) // Filter by selected class
                    .map(item => item.moduleName) // Get unique module names
            )
        ).map(moduleName => ({
            label: moduleName,
            value: moduleName
        }));

        console.log("Filtered modules for selected class:", filteredModules); // Log filtered modules

        setModuleOptions(filteredModules); // Update the module options based on filtered modules
        filterScheduleData('className', value); // Filter schedule data based on selected class
    };

    const handleSelectModule = (value) => {
        setSelectedModule(value);
        setShowTable(true);
        filterScheduleData('moduleName', value); // Filter the schedule data based on the selected module
    };

    const filterScheduleData = (filterKey, selectedValue) => {
        // First filter by class
        const filteredByClass = scheduleData.filter(item => item.className === selectedClass);

        // Now filter by module if selected
        const finalFilteredData = selectedModule 
            ? filteredByClass.filter(item => item.moduleName === selectedValue && item.trainerId === selectedTrainer) 
            : filteredByClass;

        setFilteredScheduleData(finalFilteredData); // Update the filtered schedule data
    };

    return (
        <div>
            {/* Select box for Trainer */}
            <div className='trainer-selection'>
                <span className='text'>Trainer</span> <br />
                <SelectBox onChange={handleSelectTrainer} options={trainerOptions} />
            </div>

            <div className="classname">
                <div className='class-module'>
                    <span className='text'>Class</span> <br />
                    <SelectBox
                        onChange={handleSelectClass}
                        options={classOptions}
                    />
                </div>
                {selectedClass && (
                    <div className='class-module'>
                        <span className='text'>Module</span> <br />
                        <SelectBox
                            onChange={handleSelectModule}
                            options={moduleOptions} // Only show modules related to the selected class
                            style={{ width: 500 }}
                            showSearch
                            filterOption={(input, option) =>
                                option.label.toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </div>
                )}
            </div>

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
