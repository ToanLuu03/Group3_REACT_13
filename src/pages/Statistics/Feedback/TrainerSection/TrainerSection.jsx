import { Col, DatePicker, Divider, Form, Row, Select, Table, Typography, Button, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { get_Module_data, get_Trainer_data, Get_Evaluate_by_Module, Get_Evaluate_by_Trainer } from '../../../../api/AdminAPI/StatisticsFeedback';
import './TrainerSection.css'
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

function TrainerSection() {
    const [trackByValue, setTrackByValue] = useState(null);

    const [moduleOptions, setModuleOptions] = useState([]);
    const [trainerOptions, setTrainerOptions] = useState([]);
    const [moduleValue, setModuleValue] = useState([]);
    const [trainerValue, setTrainerValue] = useState([]);
    const [evaluationData, setEvaluationData] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    const [trainerOptionsModule, setTrainerOptionsModule] = useState([]);
    const [classOptions, setclassOptions] = useState([]);
    const [ClassValue, setClassValue] = useState([]);
    const [trainerModuleValue, settrainerModuleValue] = useState([]);
    const [trainerData, settrainerData] = useState([]);

    const trackByOptions = ["Evaluate Trainer by Module", "Module Statistics by Trainer"];
    // Calculate min and max for Average Rating
    const averageRatings = evaluationData.map(item => item.averageRating).filter(rating => rating != null);
    const minRating = averageRatings.length > 0 ? Math.min(...averageRatings) : null;
    const maxRating = averageRatings.length > 0 ? Math.max(...averageRatings) : null;
    const averageRatingsTrainer = trainerData.map(item => item.averageRating).filter(rating => rating != null);
    const minRatingTrainer = averageRatingsTrainer.length > 0 ? Math.min(...averageRatingsTrainer) : null;
    const maxRatingTrainer = averageRatingsTrainer.length > 0 ? Math.max(...averageRatingsTrainer) : null;
    const avgRating = ((minRatingTrainer + maxRatingTrainer) / 2).toFixed(1);
    useEffect(() => {
        const fetchData = async () => {
            if (trackByValue === "Evaluate Trainer by Module") {
                try {
                    const response = await get_Module_data();
                    settrainerModuleValue([])
                    setClassValue([])
                    if (response.success) {
                        const modules = response.data.map(item => item.module);
                        const trainers = Array.from(
                            new Set(response.data.flatMap(item => item.trainer.map(tr => tr.name)))
                        );
                        // console.log(trackByValue)
                        setModuleOptions(modules);
                        setTrainerOptions(trainers);
                    }
                } catch (error) {
                    console.error("Error fetching module data:", error);
                }
            } else if (trackByValue === "Module Statistics by Trainer") {
                try {
                    const response = await get_Trainer_data();
                    setModuleValue([])
                    setTrainerValue([])
                    if (response.success) {
                        const trainers = response.data.map(item => item.trainerName);
                        const classes = Array.from(
                            new Set(response.data.flatMap(item => item.classCode))
                        );
                        // console.log(trackByValue)
                        setTrainerOptionsModule(trainers)
                        setclassOptions(classes)
                        // console.log("trainers", trainers)
                        // console.log("classes", classes)

                    }
                } catch (error) {
                    console.error("Error fetching trainer data:", error);
                }
            }
        };

        fetchData();
    }, [trackByValue]);

    useEffect(() => {
        const fetchEvaluationData = async () => {
            if (trackByValue === "Evaluate Trainer by Module" && moduleValue.length > 0 && trainerValue.length > 0) {
                try {
                    const response = await Get_Evaluate_by_Module({
                        module: moduleValue,
                        trainerAccount: trainerValue,
                    });
                    if (response.success) {
                        setEvaluationData(response.data);
                    }
                } catch (error) {
                    // console.error("Error fetching evaluation data:", error);
                    notification.error({
                        message: error.response.data.message,
                        // description: error.message || 'An error occurred',
                        placement: 'topRight',
                        duration: 3,
                    });
                }
            } else if (trackByValue === "Module Statistics by Trainer" && trainerModuleValue.length > 0 && ClassValue.length > 0) {
                try {
                    const response = await Get_Evaluate_by_Trainer({
                        trainerAccount: trainerModuleValue,
                        classCode: ClassValue,
                    });
                    if (response.success) {
                        settrainerData(response.data);
                    }

                } catch (error) {
                    console.error("Error fetching trainer data:", error);
                }
            }
        };

        fetchEvaluationData();
    }, [moduleValue, trainerValue, trainerModuleValue, ClassValue]);

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
                trainerName: record.trainerName || trainerModuleValue,
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
    const columnsModule = [
        {
            title: 'No.',
            key: 'index',
            render: (_, __, index) => index + 1,
            width: '5%',
            className: 'text-center font-semibold bg-gray-100 border border-gray-300',
        },
        {
            title: 'Trainer Name', dataIndex: 'trainerName', key: 'trainerName',
            className: 'text-center font-semibold bg-gray-100 border border-gray-300',
        },
        {
            title: 'Class Code', dataIndex: 'classCode', key: 'classCode',
            className: 'text-center font-semibold bg-gray-100 border border-gray-300',
        },
        {
            title: 'Module', dataIndex: 'moduleName', key: 'moduleName',
            className: 'font-semibold bg-orange-200 border',
        },
        {
            title: 'Good Feedbacks', dataIndex: 'goodFeedbacks', key: 'goodFeedbacks',
            render: (text, record) => (
                <span style={{ cursor: 'pointer', color: 'green' }} onClick={() => openFeedbackDetailsModule(record, "good")}>
                    {text}
                </span>
            ),
            className: 'text-center font-semibold bg-gray-100 border border-gray-300',
        },
        {
            title: 'Bad Feedbacks', dataIndex: 'badFeedbacks', key: 'badFeedbacks',
            render: (text, record) => (
                <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => openFeedbackDetailsModule(record, "bad")}>
                    {text}
                </span>
            ),
            className: 'text-center font-semibold bg-gray-100 border border-gray-300',
        },
        {
            title: 'Average Rating', dataIndex: 'averageRating', key: 'averageRating',
            className: 'text-center font-semibold bg-gray-100 border border-gray-300',
        },
    ];
    const columnsTrainer = [
        {
            title: 'No.',
            key: 'index',
            render: (_, __, index) => index + 1,
            width: '5%',
            className: 'text-center font-semibold bg-gray-100 border border-gray-300', // Center align and bold for header

        },
        {
            title: 'Class Code', dataIndex: 'classCode', key: 'classCode',
            className: 'text-center font-semibold bg-gray-100 border border-gray-300', // Center align and bold for header

        },
        {
            title: 'Module', dataIndex: 'moduleName', key: 'moduleName',
            className: 'font-semibold bg-orange-200 border'

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
            className: 'text-center font-semibold bg-gray-100 border border-gray-300', // Center align and bold for header

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
            className: 'text-center font-semibold bg-gray-100 border border-gray-300', // Center align and bold for header

        },
        {
            title: 'Average Rating', dataIndex: 'averageRating', key: 'averageRating',
            className: 'text-center font-semibold bg-gray-100 border border-gray-300', // Center align and bold for header
        },
    ];

    const feedbackColumns = [
        {
            title: 'Trainer Name',
            dataIndex: 'trainerName',
            key: 'trainerName',
            render: (_, record) => ({
                children: record.trainerName,
                props: { rowSpan: record.rowSpan }
            }),
            width: '20%',
            className: 'text-center font-semibold bg-gray-100 border border-gray-300', // Center align and bold for header

        },
        {
            title: 'Class Code',
            dataIndex: 'classCode',
            key: 'classCode',
            render: (_, record) => ({
                children: record.classCode,
                props: { rowSpan: record.rowSpan }
            }),
            width: '15%',
            className: 'text-center font-semibold bg-gray-100 border border-gray-300', // Center align and bold for header
        },
        {
            title: 'Module',
            dataIndex: 'moduleName',
            key: 'moduleName',
            render: (_, record) => ({
                children: record.moduleName,
                props: { rowSpan: record.rowSpan }
            }),
            width: '30%',
            className: 'font-semibold bg-orange-200 border'
        },
        {
            title: `Reason for ${selectedFeedback?.feedbackType || ''} Feedbacks`, // Use optional chaining here
            dataIndex: 'reason',
            key: 'reason',
            width: '50%',
            render: (text) => <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{text}</div>,
            className: 'text-center font-semibold bg-gray-100 border border-gray-300', // Center align and bold for header

        },
    ];

    return (
        <div>
            <Form layout="vertical">
                <Row gutter={[16, 16]}>
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
                            {trackByValue === "Evaluate Trainer by Module" && (
                                <>
                                    <Col xs={24} md={6}>
                                        <Form.Item label="Time">
                                            <RangePicker style={{ width: '100%', height: '40%' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={6}>
                                        <Form.Item label="Module" required tooltip="This field is required">
                                            <Select
                                                placeholder="Select Module"
                                                value={moduleValue}
                                                onChange={selectedValues => handleSelectAll(moduleOptions, setModuleValue, selectedValues)}
                                                maxTagCount={0}
                                            >
                                                {moduleOptions.map(option => (
                                                    <Option key={option} value={option}>{option}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={6}>
                                        <Form.Item label="Trainer" required tooltip="This field is required">
                                            <Select
                                                mode="multiple"
                                                placeholder="Select Trainer"
                                                value={trainerValue}
                                                onChange={selectedValues => handleSelectAll(trainerOptions, setTrainerValue, selectedValues)}
                                                maxTagCount={0}
                                                className="w-14 h-[32px]"
                                                tagRender={() => tagRender({ values: trainerValue, allOptions: trainerOptions })}
                                            >
                                                <Option value="all">Select All</Option>
                                                {trainerOptions.map(option => (
                                                    <Option key={option} value={option}>{option}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </>
                            )}
                            {trackByValue === "Module Statistics by Trainer" && (
                                <>
                                    {/* Add your components and layout for Module Statistics by Trainer here */}
                                    <Col xs={24} md={6}>
                                        <Form.Item label="Time">
                                            <RangePicker style={{ width: '100%', height: '40%' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={6}>
                                        <Form.Item label="Trainer" required tooltip="This field is required">
                                            <Select
                                                placeholder="Select Trainer"
                                                value={trainerModuleValue}
                                                onChange={settrainerModuleValue}
                                                maxTagCount={0}
                                            >
                                                {trainerOptionsModule.map(option => (
                                                    <Option key={option} value={option}>{option}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={6}>
                                        <Form.Item label="Class" required tooltip="This field is required">
                                            <Select
                                                mode="multiple"
                                                placeholder="Select Class"
                                                value={ClassValue}
                                                onChange={(selectedValues) => handleSelectAll(classOptions, setClassValue, selectedValues)}
                                                maxTagCount={0}
                                                className="w-14 h-[32px]"
                                                tagRender={() => tagRender({ values: ClassValue, allOptions: classOptions })}
                                            >
                                                <Option value="all">Select All</Option>
                                                {classOptions.map(option => (
                                                    <Option key={option} value={option}>{option}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                    </Col>
                                </>
                            )}
                        </>
                    )}

                </Row>
                {trackByValue === "Evaluate Trainer by Module" && moduleValue.length > 0 && trainerValue.length > 0 && (
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
                        <Table className="custom-header-table" // Apply custom styles only to this table
                            columns={columnsModule} dataSource={evaluationData} rowKey="trainerName"
                        />
                    </div>
                )}

                {evaluationData.length > 0 && trackByValue === "Evaluate Trainer by Module" && moduleValue.length > 0 && trainerValue.length > 0 && selectedFeedback && (
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
                            columns={feedbackColumns}
                            className="custom-header-table"
                            dataSource={selectedFeedback.feedbackData}
                            rowKey="key"
                            pagination={false}
                        />
                    </div>
                )}
                {trackByValue === "Module Statistics by Trainer" && trainerModuleValue.length > 0 && ClassValue.length > 0 && (
                    <>
                        <div className="bg-white rounded-lg shadow-md">
                            <div className="bg-white rounded-lg shadow-md">
                                <div className="p-4 mb-4">
                                    <Text className="text-md font-semibold">
                                        Average Score Range:
                                        {(minRatingTrainer !== null && maxRatingTrainer !== null) ? (
                                            <span>
                                                {" "}
                                                <span className="mx-1"></span>
                                                <span className="bg-gray-200 px-2 py-1 rounded-md">{minRatingTrainer}</span>
                                                <span className="mx-1">-</span>
                                                <span className="bg-gray-200 px-2 py-1 rounded-md">{maxRatingTrainer}</span>
                                            </span>
                                        ) : (
                                            " No ratings available"
                                        )}

                                        {(avgRating != null) ?
                                            (<div className='block px-4 pt-4'> Average Module Score: <span className="bg-gray-200 px-2 py-1 rounded-md">{avgRating}</span></div>)

                                            : (
                                                " No ratings available"
                                            )}

                                    </Text>
                                </div>
                            </div>
                            <Table className="custom-header-table" columns={columnsTrainer} dataSource={trainerData} rowKey="trainerName" />
                        </div>
                    </>
                )}
                {trainerData.length > 0 && trackByValue === "Module Statistics by Trainer" && trainerModuleValue.length > 0 && ClassValue.length > 0 && selectedFeedback && (
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
                            columns={feedbackColumns}
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

export default TrainerSection;