import React, { useState } from 'react'; // Import useState
import { Modal, Button, DatePicker, Input, Table } from 'antd';
import { Row, Col } from 'antd'; // Import Row and Col

const ReportModal = ({ visible, onOk, onCancel, showReason, onModalDateChange, selectedContentNames, onRemoveContent }) => {
    const [duration, setDuration] = useState(1.0); // State for duration
    const [note, setNote] = useState(''); // State for note
    const [reason, setReason] = useState(''); // State for reason
    const [selectedDate, setSelectedDate] = useState(null);
    // Add validation states
    const [dateError, setDateError] = useState('');
    const [reasonError, setReasonError] = useState('');

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setDateError(''); // Clear error when date is selected
        onModalDateChange(date);
    };

    const handleReasonChange = (e) => {
        setReason(e.target.value);
        setReasonError(''); // Clear error when reason is entered
    };

    const handleSubmit = () => {
        let isValid = true;

        if (!selectedDate) {
            setDateError('Please select a date');
            isValid = false;
        }

        if (showReason && !reason.trim()) {
            setReasonError('Please enter a reason');
            isValid = false;
        }

        if (isValid) {
            onOk(duration, note, reason);
        }
    };

    // Modified formatTableData function
    const formatTableData = () => {
        const data = [];
        let currentTopic = null;
        let topicSpanCount = 0;
        
        selectedContentNames.forEach((content, index) => {
            const item = {
                key: index,
                topic: content.topic,
                content: content.contentName,
                id: content.contentId,
                isLastRow: index === selectedContentNames.length - 1
            };
    
            if (currentTopic !== content.topic) {
                // Set the rowspan for the previous topic group
                if (topicSpanCount > 0) {
                    data[data.length - topicSpanCount].topicRowSpan = topicSpanCount;
                }
                currentTopic = content.topic;
                topicSpanCount = 1;
            } else {
                item.topicRowSpan = 0;
                topicSpanCount++;
            }
    
            data.push(item);
        });
    
        // Handle the last topic group
        if (topicSpanCount > 0) {
            data[data.length - topicSpanCount].topicRowSpan = topicSpanCount;
        }
    
        return data;
    };

    const handleRemoveRow = (contentId) => {
        onRemoveContent(contentId);
    };

    const columns = [
        {
            title: 'Topic',
            dataIndex: 'topic',
            key: 'topic',
            align: 'center',
            render: (text, record) => ({
                children: text,
                props: {
                    rowSpan: record.topicRowSpan === 0 ? 0 : record.topicRowSpan || 1,
                },
            }),
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            align: 'center',
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',  // Centers the column header
            render: (_, record) => (
                <div className="flex justify-center">
                    <button
                        onClick={() => record.isLastRow && handleRemoveRow(record.id)}
                        className={`${record.isLastRow 
                            ? "text-[#FF0000] hover:text-red-700" 
                            : "text-[#808080]"}`}
                        disabled={!record.isLastRow}
                    >
                        X
                    </button>
                </div>
            ),
        }
    ];

    return (
        <Modal
            width={673}
            title="Schedule Report"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    Submit
                </Button>,
            ]}
        >
            <Row gutter={16}> 
                <Col span={12}> 
                    <p>Date:</p>
                    <DatePicker 
                        onChange={handleDateChange}
                        style={{width:"309px"}}
                        value={selectedDate}
                    />
                    {dateError && <p style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>{dateError}</p>}
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
                <Table dataSource={formatTableData()} columns={columns} pagination={false} rowKey="key" />
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
                        onChange={handleReasonChange}
                        status={reasonError ? 'error' : ''}
                    />
                    {reasonError && <p style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '2px' }}>{reasonError}</p>}
                </div>
            )}
        </Modal>
    );
};

export default ReportModal;