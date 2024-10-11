import React, { useState } from 'react'; // Import useState
import { Modal, Button, DatePicker, Input, Table } from 'antd';
import { Row, Col } from 'antd'; // Import Row and Col

const ReportModal = ({ visible, onOk, onCancel, selectedTopics, showReason, onModalDateChange, selectedContentNames }) => {
    const [duration, setDuration] = useState(1.0); // State for duration
    const [note, setNote] = useState(''); // State for note
    const [reason, setReason] = useState(''); // State for reason

    // Prepare data for the table
    const tableData = [];
    
    selectedTopics.forEach(topic => {
        const contentItems = selectedContentNames.filter(content => content.topic === topic);
        const rowSpan = contentItems.length; // Number of content items for this topic

        contentItems.forEach((content, index) => {
            tableData.push({
                key: content.contentName, // Unique key for each row
                topic: index === 0 ? topic : '', // Only show topic name on the first row
                content: content.contentName,
                rowSpan: index === 0 ? rowSpan : 0, // Set rowSpan for the first row
            });
        });
    });

    const columns = [
        {
            title: 'Topic',
            dataIndex: 'topic',
            key: 'topic',
            render: (text, record) => ({
                children: text,
                props: {
                    rowSpan: record.rowSpan,
                },
            }),
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
        },
    ];

    return (
        <Modal
            width={673}
            title="Schedule Report"
            open={visible}
            onOk={() => onOk(duration, note, reason)} // Pass duration, note, and reason to onOk
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={() => onOk(duration, note, reason)}>
                    Submit
                </Button>,
            ]}
        >
            <Row gutter={16}> 
                <Col span={12}> 
                    <p>Date:</p>
                    <DatePicker onChange={onModalDateChange} style={{width:"309px"}}/>
                </Col>
                <Col span={12}> 
                    <p>Duration:</p>
                    <Input 
                        placeholder='Enter Duration' 
                        type='number' 
                        value={duration} 
                        onChange={(e) => setDuration(e.target.value)} // Update duration state
                    />
                </Col>
            </Row>
            <div className='table-container' style={{marginBottom:"16px", marginTop:"16px"}}>
                <Table dataSource={tableData} columns={columns} pagination={false} rowKey="key" />
            </div>
            <div>
                <p>Note</p>
                <Input.TextArea 
                    placeholder="Enter note" 
                    value={note} 
                    onChange={(e) => setNote(e.target.value)} // Update note state
                />
            </div>
            {showReason && (
                <div>
                    <p>Reason</p>
                    <Input.TextArea 
                        placeholder="Enter reason" 
                        value={reason} 
                        onChange={(e) => setReason(e.target.value)} // Update reason state
                    />
                </div>
            )}
        </Modal>
    );
};

export default ReportModal;