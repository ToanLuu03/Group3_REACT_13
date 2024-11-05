import React, { useState } from 'react';
import { Form, DatePicker, Row, Col, Divider, InputNumber, Collapse, Select } from 'antd';

const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { Option } = Select;

const Feedback = () => {
  const [trackByValue, setTrackByValue] = useState([]);
  const [moduleValue, setModuleValue] = useState([]);
  const [trainerValue, setTrainerValue] = useState([]);
  const [technicalGroupValue, setTechnicalGroupValue] = useState([]);
  const [classValue, setClassValue] = useState([]);

  // Options for Select components
  const trackByOptions = ["Evaluate Trainer by Module", "Evaluate Trainer by Class"];
  const moduleOptions = ["Module 1", "Module 2", "Module 3"];
  const trainerOptions = ["Diệu Lâm", "Thu Diễm", "Hieu Lam"];
  const technicalGroupOptions = ["Group 1", "Group 2", "Group 3"];
  const classOptions = ["Class A", "Class B", "Class C"];

  // Handler for Select All functionality
  const handleSelectAll = (options, setValue, selectedValues) => {
    if (selectedValues.includes("all")) {
      setValue(options);
    } else {
      setValue(selectedValues);
    }
  };

  // Custom render for tag to display only "Select All" when all options are selected
  const tagRender = (props) => {
    const { values, allOptions } = props;
    if (values.length === allOptions.length) {
      return <span>Select All</span>;
    }
    return values.map(value => <span key={value}>{value}</span>);
  };


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Collapse defaultActiveKey={['1', '2', '3']} expandIconPosition="right">

        {/* Trainer Section */}
        <Panel header="Trainer" key="1">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <Form layout="vertical">
              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item label="Track By" required tooltip="This field is required">
                    <Select
                      mode="multiple"
                      placeholder="Select Tracking Method"
                      value={trackByValue}
                      onChange={selectedValues => handleSelectAll(trackByOptions, setTrackByValue, selectedValues)}
                      maxTagCount={0}
                      tagRender={() => tagRender({ values: trackByValue, allOptions: trackByOptions })}
                    >
                      <Option value="all">Select All</Option>
                      {trackByOptions.map(option => (
                        <Option key={option} value={option}>{option}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label="Time" required tooltip="This field is required">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label="Module" required tooltip="This field is required">
                    <Select
                      mode="multiple"
                      placeholder="Select Module"
                      value={moduleValue}
                      onChange={selectedValues => handleSelectAll(moduleOptions, setModuleValue, selectedValues)}
                      maxTagCount={0}
                      tagRender={() => tagRender({ values: moduleValue, allOptions: moduleOptions })}
                    >
                      <Option value="all">Select All</Option>
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
                      tagRender={() => tagRender({ values: trainerValue, allOptions: trainerOptions })}
                    >
                      <Option value="all">Select All</Option>
                      {trainerOptions.map(option => (
                        <Option key={option} value={option}>{option}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Divider />
            </Form>
          </div>
        </Panel>

        {/* Training Program & Content Section */}
        <Panel header="Training Program & Content" key="2">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <Form layout="vertical">
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item label="Time" required tooltip="This field is required">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Module" required tooltip="This field is required">
                    <Select
                      mode="multiple"
                      placeholder="Select Module"
                      value={moduleValue}
                      onChange={selectedValues => handleSelectAll(moduleOptions, setModuleValue, selectedValues)}
                      maxTagCount={0}
                      tagRender={() => tagRender({ values: moduleValue, allOptions: moduleOptions })}
                    >
                      <Option value="all">Select All</Option>
                      {moduleOptions.map(option => (
                        <Option key={option} value={option}>{option}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Average Score Range" required tooltip="This field is required">
                    <Row gutter={8} align="middle">
                      <Col>
                        <InputNumber placeholder="4.0" min={0} max={5} step={0.1} style={{ width: '80px' }} />
                      </Col>
                      <Col>
                        <span>-</span>
                      </Col>
                      <Col>
                        <InputNumber placeholder="5.0" min={0} max={5} step={0.1} style={{ width: '80px' }} />
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </Panel>

        {/* Course organization*/}
        <Panel header="Course organization" key="3">
          <Form layout="vertical">
            <Row gutter={16} className="mb-4">
              <Col xs={24} md={6}>
                <Form.Item label="Track By" required tooltip="This field is required">
                  <Select
                    mode="multiple"
                    placeholder="Select Tracking Method"
                    value={trackByValue}
                    onChange={selectedValues => handleSelectAll(trackByOptions, setTrackByValue, selectedValues)}
                    maxTagCount={0}
                    tagRender={() => tagRender({ values: trackByValue, allOptions: trackByOptions })}
                  >
                    <Option value="all">Select All</Option>
                    {trackByOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item label="Time" required tooltip="This field is required">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item label="Technical Group" required tooltip="This field is required">
                  <Select
                    mode="multiple"
                    placeholder="Select Technical Group"
                    value={technicalGroupValue}
                    onChange={selectedValues => handleSelectAll(technicalGroupOptions, setTechnicalGroupValue, selectedValues)}
                    maxTagCount={0}
                    tagRender={() => tagRender({ values: technicalGroupValue, allOptions: technicalGroupOptions })}
                  >
                    <Option value="all">Select All</Option>
                    {technicalGroupOptions.map(option => (
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
                    value={classValue}
                    onChange={selectedValues => handleSelectAll(classOptions, setClassValue, selectedValues)}
                    maxTagCount={0}
                    tagRender={() => tagRender({ values: classValue, allOptions: classOptions })}
                  >
                    <Option value="all">Select All</Option>
                    {classOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Panel>
      </Collapse>
    </div>
  );
};

export default Feedback;
