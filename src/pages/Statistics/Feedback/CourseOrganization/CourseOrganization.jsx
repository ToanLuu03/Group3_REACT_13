import { Col, DatePicker, Divider, Form, Row, Select, Table, Typography, Button, notification } from 'antd';
import React, { useState, useEffect } from 'react';
import { Get_Course_by_Module, get_Technical_data } from '../../../../api/AdminAPI/StatisticsFeedback';
import './CourseOrganization.css'
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title } = Typography;  // Correct import

function CourseOrganization() {
    const [trackByValue, setTrackByValue] = useState("");
    const [moduleData, setModuleData] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    //Evaluate Class Admin by Module
    const [technicalOption, setTechnicalOption] = useState([]);
    const [classOptionModule, setClassOptionModule] = useState([]);
    const [technicalValue, setTechnicalValue] = useState([]);
    const [classModuleValue, setClassModuleValue] = useState([]);

    //Module Statistics by Trainer

    const trackByOptions = ["Evaluate Class Admin by Module", "Module Statistics by Trainer"];


    const handleSelectAll = (options, setValue, selectedValues) => {
        if (selectedValues.includes("all")) {
            if (selectedValues.length === options.length + 1) {
                setValue([]);
            } else {
                setValue(options);
            }
        } else {
            setValue(selectedValues);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            if (trackByValue === "Evaluate Class Admin by Module") {
                try {
                    const response = await get_Technical_data();
                    if (response.success) {
                        // Extract the technical group names
                        const technical = response.data.map(item => item.technicalGroupName);

                        // Flatten the className arrays and remove duplicates
                        const classes = [...new Set(response.data.flatMap(item => item.classCode))];

                        setTechnicalOption(technical)
                        console.log("classOptionModule:.....", classOptionModule)
                        setClassOptionModule(classes)

                    }
                } catch (error) {
                    console.error(error);
                }
            }
        };

        fetchData();
    }, [trackByValue]);

    useEffect(() => {
        const fetchTable = async () => {
            if (trackByValue === "Evaluate Class Admin by Module" && technicalValue.length > 0 && classModuleValue.length > 0) {
                try {
                    const response = await Get_Course_by_Module({
                        classCode: classModuleValue
                    });
                    if (response.success) {
                        setModuleData(response.data);
                    } else {
                        notification.error({
                            message: 'Data Fetch Error',
                            description: 'Failed to load module statistics. Please try again.',
                        });
                    }
                } catch (error) {
                    notification.error({
                        message: 'API Error',
                        description: `There was an error fetching data: ${error.message}`,
                    });
                    console.error(error);
                }
            }
        };
        fetchTable();
    }, [classModuleValue, technicalValue]);
    const openFeedbackDetailsModule = (record, type) => {
        const feedbackList = type === "good" ? record.goodFeedbackList : record.badFeedbackList;
        const feedbackType = type === "good" ? "Good" : "Bad";

        if (!feedbackList || feedbackList.length === 0) {
            // If there are no feedbacks, show a message
            notification.warning({
                message: "No reason to show",
                placement: "topRight",
                duration: 3,
            });
        } else {
            // If there are feedbacks, proceed as usual
            const formattedFeedback = feedbackList.map((reason, index) => ({
                key: `${record.trainerName}-${record.classCode}-${index}`,
                trainerName: record.trainerName,
                classCode: record.classCode,
                moduleName: record.moduleName,
                reason: reason,
                isFirstRow: index === 0, // Flag to indicate if it's the first row for merging cells
                rowSpan: index === 0 ? feedbackList.length : 0, // Span cells vertically in the first row only
            }));
            console.log("formattedFeedback", formattedFeedback)
            setSelectedFeedback({
                feedbackType,
                feedbackData: formattedFeedback,
            });
        }
    };
    const tagRender = ({ values = [], allOptions }) => {
        if (!Array.isArray(values)) {
            values = [];
        }
        if (values.length === allOptions.length) {
            return <span>Select All</span>;
        }

        if (values.length === 1)
            return values[0].length > 40 ? values[0].slice(0, 40) + "..." : values[0];
        else {
            const textString = values.slice(0, 2).join(", ");

            return textString.length > 17
                ? textString.slice(0, 17) + "..."
                : textString;
        };
    }
    const feedbackColumnsModule = [
        { title: 'Class Admin', dataIndex: 'admin', key: 'admin', width: '20%' },
        { title: 'Class Code', dataIndex: 'classCode', key: 'classCode', width: '15%' },
        { title: 'Module', dataIndex: 'moduleName', key: 'moduleName', width: '30%' },
        { title: `Reason for ${selectedFeedback?.feedbackType || ''} Feedbacks`, dataIndex: 'reason', key: 'reason', width: '50%', align: 'center' },
    ];
    const columnsByModule = [
        {
            title: 'No.',
            key: 'index',
            render: (_, __, index) => index + 1, // Display the index (serial number), starting from 1
            width: '5%', // You can adjust the width of the serial number column as needed
            className: 'text-center font-semibold bg-gray-100 border border-gray-300', // Center align and bold for header

        },
        {
            title: 'Class Admin', dataIndex: 'admin', key: 'admin', className: 'text-center font-semibold bg-gray-100 border border-gray-300',
        },
        {
            title: 'Class Code', dataIndex: 'classCode', key: 'classCode', className: 'text-center font-semibold bg-gray-100 border border-gray-300',
        },
        {
            title: 'Module', dataIndex: 'moduleName', key: 'moduleName', className: 'text-center font-semibold bg-gray-100 border border-gray-300',
        },
        {
            title: 'Good Feedbacks',
            dataIndex: 'goodFeedbacks',
            key: 'goodFeedbacks',
            render: (text, record) => (
                <span style={{ cursor: 'pointer', color: 'green' }} onClick={() => openFeedbackDetailsModule(record, "good")}>
                    {text}
                </span>
            ),
            className: 'text-center font-semibold bg-gray-100 border border-gray-300',

        },
        {
            title: 'Bad Feedbacks',
            dataIndex: 'badFeedbacks',
            key: 'badFeedbacks',
            render: (text, record) => (
                <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => openFeedbackDetailsModule(record, "bad")}>
                    {text}
                </span>
            ),
            className: 'text-center font-semibold bg-gray-100 border border-gray-300',

        },
        {
            title: 'Average Rating', dataIndex: 'averageRating', key: 'averageRating', className: 'text-center font-semibold bg-gray-100 border border-gray-300',
        },
    ];

    return (
        <div>
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col xs={24} md={6}>
                        <Form.Item label="Track By" required tooltip="This field is required">
                            <Select
                                placeholder="Select Tracking"
                                value={trackByValue}
                                onChange={setTrackByValue}
                            >
                                {trackByOptions.map(option => (
                                    <Option key={option} value={option}>{option}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    {trackByValue && (
                        <>
                            {trackByValue === "Evaluate Class Admin by Module" && (
                                <>
                                    <Col xs={24} md={6}>
                                        <Form.Item label="Time">
                                            <RangePicker style={{ width: '100%', height: '40%' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={6}>
                                        <Form.Item label="Technical Group" required tooltip="This field is required">
                                            <Select
                                                placeholder="Select Technical Group"
                                                value={technicalValue}
                                                onChange={selectedValues => handleSelectAll(technicalOption, setTechnicalValue, selectedValues)}
                                                maxTagCount={0}
                                            >
                                                {technicalOption.map(option => (
                                                    <Option key={option} value={option}>{option}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={6}>
                                        <Form.Item label="Class" required tooltip="This field is required">
                                            <Select
                                                placeholder="Select Class"
                                                mode='multiple'
                                                value={classModuleValue}
                                                onChange={selectedValues => handleSelectAll(classOptionModule, setClassModuleValue, selectedValues)}
                                                maxTagCount={0}
                                                className="w-14 h-[32px]"
                                                tagRender={() => tagRender({ values: classModuleValue, allOptions: classOptionModule })}
                                            // tagRender={() => tagRender({ value: classModuleValue, allOption: classOptionModule })}
                                            >
                                                <Option value="all">Select All</Option>
                                                {classOptionModule.map(option => (
                                                    <Option key={option} value={option}>{option}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </>
                            )}

                        </>
                    )}
                </Row >
                {trackByValue === "Evaluate Class Admin by Module" && classModuleValue.length > 0 && technicalValue.length > 0 && (
                    <>
                        <div className="bg-white rounded-lg shadow-md">
                            <Table columns={columnsByModule} dataSource={moduleData} rowKey="trainerName" pagination={false} className="custom-header-table"
                            />
                        </div>
                    </>
                )}
                {moduleData.length > 0 && trackByValue === "Evaluate Class Admin by Module" && technicalValue.length > 0 && classModuleValue.length > 0 && selectedFeedback && (
                    <div className="bg-white rounded-lg shadow-md mt-6">
                        <Title level={4}>
                            <Button
                                style={{ float: 'right', backgroundColor: 'red', color: 'white' }}
                                onClick={() => setSelectedFeedback(null)}
                            >
                                X
                            </Button>
                        </Title>
                        <Table
                            columns={feedbackColumnsModule}
                            className="custom-header-table"
                            dataSource={selectedFeedback.feedbackData}
                            rowKey="key"
                            pagination={false}
                        />
                    </div>
                )}
                <Divider />
            </Form>
        </div>
    );
}

export default CourseOrganization;
