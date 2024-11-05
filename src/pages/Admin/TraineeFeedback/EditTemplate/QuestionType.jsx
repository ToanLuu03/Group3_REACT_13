import React, { useState } from 'react';
import { Form, Input, Radio, Select, Checkbox, Upload, Rate, DatePicker, Button } from 'antd';
import { CloseCircleOutlined, UploadOutlined, PlusCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

// Component for Section 1: Trainee Information
export const TraineeInformation = () => (
    <Form layout="vertical">
        <Form.Item label="1. Your Name" name="name">
            <Input placeholder="Enter your answer" className="border-gray-300" />
        </Form.Item>
        <Form.Item label="2. Class Code for Internship" name="classCode">
            <Radio.Group>
                <Radio value="BA_01">BA_01</Radio>
                <Radio value="NET_14">NET_14</Radio>
            </Radio.Group>
        </Form.Item>
        <Form.Item label="3. Mentors of your class" name="mentor">
            <Select placeholder="Select your answer" className="border-gray-300">
                <Option value="mentor1">Mentor 1</Option>
                <Option value="mentor2">Mentor 2</Option>
                <Option value="mentor3">Mentor 3</Option>
            </Select>
        </Form.Item>
    </Form>
);

// Component for Section 3: Mutiple Choice
export const TextQuestion = () => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([{ id: Date.now(), value: '' }]);
    const [isRequired, setIsRequired] = useState(false);

    const handleQuestionChange = (e) => setQuestion(e.target.value);

    const handleOptionChange = (index, e) => {
        const newOptions = [...options];
        newOptions[index].value = e.target.value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, { id: Date.now(), value: '' }]);
    };

    const removeOption = (index) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const toggleRequired = () => setIsRequired(!isRequired);

    return (
        <>
            <div className="flex justify-between items-center">
                <Form.Item className="w-full mb-0">
                    <Input
                        placeholder="Enter your question here"
                        value={question}
                        onChange={handleQuestionChange}
                        className="border-gray-300"
                    />
                </Form.Item>
                <Checkbox checked={isRequired} onChange={toggleRequired} className="ml-2">
                    Required
                </Checkbox>
            </div>
            <br />
            {options.map((option, index) => (
                <div key={option.id} className="flex items-center space-x-2 mb-2">
                    <Checkbox disabled />
                    <Input
                        placeholder={`Option ${index + 1}`}
                        value={option.value}
                        onChange={(e) => handleOptionChange(index, e)}
                        className="border-gray-300 w-40"
                    />
                    {options.length > 1 && (
                        <Button
                            type="text"
                            icon={<CloseCircleOutlined className="text-red-600" />}
                            onClick={() => removeOption(index)}
                        />
                    )}
                </div>
            ))}
            <Button
                type="text"
                className="flex items-center text-blue-600 border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:bg-gray-200"
                icon={<PlusCircleOutlined className="mr-2 text-blue-600" />}
                onClick={addOption}
            >
                Add option
            </Button>
        </>
    );
};

// Component for Section 4: File Upload Question
export const FileUploadQuestion = ({ question, handleQuestionChange, toggleRequired, isRequired }) => (
    <>
        <div className="flex justify-between items-center">
            <Form.Item className="w-full mb-0">
                <Input placeholder="Question" value={question} onChange={handleQuestionChange} className="border-gray-300" />
            </Form.Item>
            <Checkbox checked={isRequired} onChange={toggleRequired} className="ml-2">
                Required
            </Checkbox>
        </div>
        <br />
        <Form.Item label="">
            <Upload.Dragger name="file" multiple={false}>
                <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                </p>
                <p className="ant-upload-text">Drop your file or click to browse files</p>
            </Upload.Dragger>
        </Form.Item>
    </>
);

// Component for Section 5: Rating Question
export const RatingQuestion = ({ question, handleQuestionChange, toggleRequired, isRequired }) => (
    <>
        <div className="flex justify-between items-center">
            <Form.Item className="w-full mb-0">
                <Input placeholder="Question" value={question} onChange={handleQuestionChange} className="border-gray-300" />
            </Form.Item>
            <Checkbox checked={isRequired} onChange={toggleRequired} className="ml-2">
                Required
            </Checkbox>
        </div>
        <br />
        <Form.Item>
            <Rate className="text-yellow-400 text-6xl" />
        </Form.Item>
    </>
);

// Component for Section 6: Date Picker Question
export const DateQuestion = ({ question, handleQuestionChange, toggleRequired, isRequired }) => (
    <>
        <div className="flex justify-between items-center">
            <Form.Item className="w-full mb-0">
                <Input placeholder="Question" value={question} onChange={handleQuestionChange} className="border-gray-300" />
            </Form.Item>
            <Checkbox checked={isRequired} onChange={toggleRequired} className="ml-2">
                Required
            </Checkbox>
        </div>
        <br />
        <Form.Item>
            <DatePicker format="DD/MM/YYYY" placeholder="dd/mm/yyyy" className="border-gray-300 w-auto" />
        </Form.Item>
    </>
);
