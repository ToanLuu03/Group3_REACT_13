import { Col, DatePicker, Divider, Form, Row, Select, Table, Typography, Button, notification } from 'antd';
import React, { useState, useEffect } from 'react';
import { Get_Course_by_Module, get_Technical_data, get_ClassAdmin_by_Trainer, Get_Admin_by_ClassName } from '../../../../api/AdminAPI/StatisticsFeedback';
import './CourseOrganization.css'
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

function CourseOrganization() {
    const [trackByValue, setTrackByValue] = useState("");
    const [moduleData, setModuleData] = useState([]);
    const [adminData, setAdminData] = useState([]);

    const [selectedFeedback, setSelectedFeedback] = useState(null);

    //Evaluate Class Admin by Module
    const [technicalOption, setTechnicalOption] = useState([]);
    const [classOptionModule, setClassOptionModule] = useState([]);
    const [technicalValue, setTechnicalValue] = useState([]);
    const [classModuleValue, setClassModuleValue] = useState([]);

    //Module Statistics by Trainer
    const [classAdminOption, setClassAdminOption] = useState([]);
    const [classOption, setClassOption] = useState([]);
    const [classAdminValue, setClassAdminValue] = useState([]);
    const [classValue, setClassValue] = useState([]);
    const trackByOptions = ["Evaluate Class Admin by Module", "Module Statistics by Class Admin"];

    // Calculate min and max for Average Rating
    const averageRatings = moduleData.map(item => item.averageRating).filter(rating => rating != null);
    const minRating = averageRatings.length > 0 ? Math.min(...averageRatings) : null;
    const maxRating = averageRatings.length > 0 ? Math.max(...averageRatings) : null;
    const averageRatingAdmin = adminData.map(item => item.averageRating).filter(rating => rating != null);
    const minRatingAdmin = averageRatingAdmin.length > 0 ? Math.min(...averageRatingAdmin) : null;
    const maxRatingAdmin = averageRatingAdmin.length > 0 ? Math.max(...averageRatingAdmin) : null;
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
                    setClassAdminValue([])
                    setClassValue([])
                    const response = await get_Technical_data();
                    if (response.success) {
                        const technical = response.data.map(item => item.technicalGroupName);
                        const classes = [...new Set(response.data.flatMap(item => item.classCode))];

                        setTechnicalOption(technical);
                        setClassOptionModule(classes);
                    }
                } catch (error) {
                    console.error(error);
                }
            } else if (trackByValue === "Module Statistics by Class Admin") {
                try {
                    setClassModuleValue([])
                    setTechnicalValue([])
                    const response = await get_ClassAdmin_by_Trainer();
                    if (response.success) {
                        const classAdmin = response.data.map(item => item.classAdmin);
                        // const classes = response.data.flatMap(item => item.classNames);
                        const classes = [...new Set(response.data.flatMap(item => item.classNames))];

                        setClassAdminOption(classAdmin);
                        setClassOption(classes);
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
            if (
                trackByValue === "Evaluate Class Admin by Module" &&
                technicalValue.length > 0 &&
                classModuleValue.length > 0
            ) {
                try {
                    const response = await Get_Course_by_Module({
                        classCode: classModuleValue,
                    });
                    if (response.success) {
                        setModuleData(response.data);
                    }
                } catch (error) {
                    notification.error({
                        message: error.response.data.message,
                        // description: error.message || 'An error occurred',
                        placement: 'topRight',
                        duration: 3,
                    });
                }

            } else if (
                trackByValue === "Module Statistics by Class Admin" &&
                classValue.length > 0 &&
                classAdminValue.length > 0
            ) {
                try {
                    const response = await Get_Admin_by_ClassName({
                        classNames: classValue,
                        classAdmin: classAdminValue,
                    });
                    if (response.success) {
                        setAdminData(response.data);
                    }
                } catch (error) {
                    setAdminData([])
                    notification.error({
                        message: error.response.data.message,
                        // description: error.message || 'An error occurred',
                        placement: 'topRight',
                        duration: 3,
                    });
                }

            }
        }


        fetchTable();
    }, [trackByValue, classModuleValue, technicalValue, classValue, classAdminValue]);

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
                classAdmin: record.classAdmin,
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
    const openFeedbackDetailsAdmin = (record, type) => {
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
                classAdmin: record.classAdmin,
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
        {
            title: 'Class Admin',
            dataIndex: 'classAdmin',
            key: 'classAdmin',
        }, { title: 'Class Code', dataIndex: 'classCode', key: 'classCode', width: '15%' },
        { title: 'Module', dataIndex: 'moduleName', key: 'moduleName', width: '30%' },
        { title: `Reason for ${selectedFeedback?.feedbackType || ''} Feedbacks`, dataIndex: 'reason', key: 'reason', width: '50%', align: 'center' },
    ];
    const columnsByModule = [
        {
            title: 'No.',
            key: 'index',
            render: (_, __, index) => index + 1, // Display the index (serial number), starting from 1
            width: '5%',
            className: 'text-center font-semibold bg-gray-100 border border-gray-300',
        },
        {
            title: 'Class Admin',
            dataIndex: 'classAdmin',
            key: 'classAdmin',
            className: 'text-center font-semibold bg-gray-100 border border-gray-300',
        },
        {
            title: 'Class Code',
            dataIndex: 'classCode',
            key: 'classCode',
            className: 'text-center font-semibold bg-gray-100 border border-gray-300',
        },
        {
            title: 'Module',
            dataIndex: 'moduleName',
            key: 'moduleName',
            className: 'text-center font-semibold bg-gray-100 border border-gray-300',
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
            title: 'Average Rating',
            dataIndex: 'averageRating',
            key: 'averageRating',
            className: 'text-center font-semibold bg-gray-100 border border-gray-300',
        },
        {
            title: 'Feedback Count', // New Column
            dataIndex: 'feedbackCount',  // The key that you want to display in this column
            key: 'feedbackCount',
            render: (_, record) => (
                <span>{record.goodFeedbacks + record.badFeedbacks}</span>  // Assuming the feedback count is the sum of good and bad feedbacks
            ),
            className: 'text-center font-semibold bg-gray-100 border border-gray-300',
        },
    ];
    const columnsByAdmin = [
        {
            title: 'No.',
            key: 'index',
            render: (_, __, index) => index + 1, // Display the index (serial number), starting from 1
            width: '5%',
            className: 'text-center font-semibold bg-gray-100 border border-gray-300',
        },
        {
            title: 'Class Admin',
            dataIndex: 'classAdmin',
            key: 'classAdmin',
            className: 'text-center font-semibold bg-gray-100 border border-gray-300',
        },
        {
            title: 'Class Code',
            dataIndex: 'classCode',
            key: 'classCode',
            className: 'text-center font-semibold bg-gray-100 border border-gray-300',
        },
        {
            title: 'Module',
            dataIndex: 'moduleName',
            key: 'moduleName',
            className: 'text-center font-semibold bg-gray-100 border border-gray-300',
        },
        {
            title: 'Good Feedbacks',
            dataIndex: 'goodFeedbacks',
            key: 'goodFeedbacks',
            render: (text, record) => (
                <span style={{ cursor: 'pointer', color: 'green' }} onClick={() => openFeedbackDetailsAdmin(record, "good")}>
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
                <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => openFeedbackDetailsAdmin(record, "bad")}>
                    {text}
                </span>
            ),
            className: 'text-center font-semibold bg-gray-100 border border-gray-300',
        },
        {
            title: 'Average Rating',
            dataIndex: 'averageRating',
            key: 'averageRating',
            className: 'text-center font-semibold bg-gray-100 border border-gray-300',
        },
        {
            title: 'Feedback Count', // New Column
            dataIndex: 'feedbackCount',  // The key that you want to display in this column
            key: 'feedbackCount',
            render: (_, record) => (
                <span>{record.goodFeedbacks + record.badFeedbacks}</span>  // Assuming the feedback count is the sum of good and bad feedbacks
            ),
            className: 'text-center font-semibold bg-gray-100 border border-gray-300',
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
                            {trackByValue === "Module Statistics by Class Admin" && (
                                <>
                                    <Col xs={24} md={6}>
                                        <Form.Item label="Time">
                                            <RangePicker style={{ width: '100%', height: '40%' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={6}>
                                        <Form.Item label="Class Admin" required tooltip="This field is required">
                                            <Select
                                                placeholder="Select Class Admin"
                                                value={classAdminValue}
                                                onChange={selectedValues => handleSelectAll(classAdminOption, setClassAdminValue, selectedValues)}
                                                maxTagCount={0}
                                            >
                                                {classAdminOption.map(option => (
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
                                                value={classValue}
                                                onChange={selectedValues => handleSelectAll(classOption, setClassValue, selectedValues)}
                                                maxTagCount={0}
                                                className="w-14 h-[32px]"
                                                tagRender={() => tagRender({ values: classValue, allOptions: classOption })}
                                            // tagRender={() => tagRender({ value: classModuleValue, allOption: classOptionModule })}
                                            >
                                                <Option value="all">Select All</Option>
                                                {classOption.map(option => (
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
                            <div className="bg-white rounded-lg shadow-md">
                                <div className="p-4 mb-4">
                                    <Text className="text-md font-semibold">
                                        Average Score Range:
                                        {minRating !== null && maxRating !== null ? (
                                            <span>
                                                {" "}
                                                <span className="mx-1"></span>
                                                <span className="bg-gray-200 px-2 py-1 rounded-md">{minRating}</span>
                                                <span className="mx-1">-</span>
                                                <span className="bg-gray-200 px-2 py-1 rounded-md">{maxRating}</span>
                                            </span>
                                        ) : (
                                            " No ratings available"
                                        )}
                                    </Text>
                                </div>
                            </div>
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
                {trackByValue === "Module Statistics by Class Admin" && classValue.length > 0 && classAdminValue.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md mt-6">
                        <div className="bg-white rounded-lg shadow-md">
                            <div className="p-4 mb-4">
                                <Text className="text-md font-semibold">
                                    Average Score Range:
                                    {minRatingAdmin !== null && maxRatingAdmin !== null ? (
                                        <span>
                                            {" "}
                                            <span className="mx-1"></span>
                                            <span className="bg-gray-200 px-2 py-1 rounded-md">{minRatingAdmin}</span>
                                            <span className="mx-1">-</span>
                                            <span className="bg-gray-200 px-2 py-1 rounded-md">{maxRatingAdmin}</span>
                                        </span>
                                    ) : (
                                        " No ratings available"
                                    )}
                                </Text>
                            </div>
                        </div>
                        <Table
                            columns={columnsByAdmin}
                            dataSource={adminData}
                            rowKey="classCode" // Adjusted rowKey for unique identification
                            pagination={false}
                            className="custom-header-table"
                        />
                    </div>
                )}
                {adminData.length > 0 && trackByValue === "Module Statistics by Class Admin" && classValue.length > 0 && classAdminValue.length > 0 && selectedFeedback && (
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
