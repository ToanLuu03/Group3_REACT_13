import React, { useState } from 'react';
import { ClockCircleOutlined, EditOutlined, CheckCircleOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Input, Dropdown, Menu, Select, Pagination, Modal, notification, Button, DatePicker, Radio } from 'antd';

const { Option } = Select;

function ClassTemplate({ setActiveKey, setClonedTemplate }) {
    const initialTemplates = [
        { title: 'Mẫu feedback sản phẩm 5', date: '2022/02/10', type: 'Form', id: 33, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Khảo sát ý kiến khách hàng 5', date: '2022/01/15', type: 'Form', id: 34, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        // Add other templates as needed...
    ];

    const [templates, setTemplates] = useState(initialTemplates);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false); 
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showSendDateOption, setShowSendDateOption] = useState(false); 

    const itemsPerPage = 8;

    const sortedTemplates = [...templates].sort((a, b) => {
        if (sortOption === 'Latest') return new Date(b.date) - new Date(a.date);
        if (sortOption === 'Oldest') return new Date(a.date) - new Date(b.date);
        return 0;
    });

    const filteredTemplates = sortedTemplates.filter(
        (template) =>
            template.title.toLowerCase().includes(searchQuery.toLowerCase()) && !template.cloned
    );

    const totalTemplates = filteredTemplates.length;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const handlePageChange = (page) => setCurrentPage(page);

    const handleCloneTemplate = (template) => {
        try {
            const newId = templates.length > 0 ? Math.max(...templates.map(t => t.id)) + 1 : 1;
            const clonedTemplate = { ...template, id: newId, cloned: true };

            setTemplates(prevTemplates => [...prevTemplates, clonedTemplate]);
            setClonedTemplate(clonedTemplate);

            setActiveKey('2'); 

            notification.success({
                message: 'Clone Template',
                description: 'Template cloned successfully!',
            });
        } catch (error) {
            console.error("Error cloning template:", error);
            notification.error({
                message: 'Error cloning template',
                description: error.message || 'Could not clone template.',
            });
        }
    };

    const showUseTemplateModal = (template) => {
        setSelectedTemplate(template); 
        setIsModalVisible(true); 
    };

    const handleCancel = () => {
        setIsModalVisible(false); 
    };

    const handleUseTemplate = () => {
        setIsModalVisible(false);

        setActiveKey('3'); 

        notification.success({
            message: 'Action completed successfully',
            description: 'Your feedback has been sent!',
            placement: 'topRight',
        });
    };

    return (
        <div>
            <div className="flex justify-end gap-5 mb-4 flex-wrap">
                <div className="flex flex-col">
                    <label className="font-medium text-gray-800">Sort</label>
                    <Select value={sortOption} onChange={setSortOption} style={{ width: 160 }} allowClear>
                        <Option value="Latest">Latest</Option>
                        <Option value="Oldest">Oldest</Option>
                    </Select>
                </div>
                <div className="flex flex-col">
                    <label className="font-medium text-gray-800">Search</label>
                    <Input
                        placeholder="Enter keywords"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-gray-300 rounded-md bg-gray-100 w-48"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-10 gap-y-10">
                {filteredTemplates.slice(startIndex, endIndex).map((template) => (
                    <div key={template.id} className="relative bg-white border border-gray-500 rounded-lg shadow-lg p-3">
                        <div className="mb-5">
                            <img src={template.image} alt={template.title} className="rounded-md w-full border border-gray-500" />
                        </div>
                        <div className="text">
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">{template.title}</h2>
                            <div className="flex justify-between items-center text-gray-600 text-sm">
                                <p className="flex items-center gap-1">
                                    <ClockCircleOutlined />
                                    Last Update: {template.date}
                                </p>
                                <Dropdown overlay={
                                    <Menu>
                                        <Menu.Item key="1" icon={<EditOutlined />} onClick={() => handleCloneTemplate(template)}>
                                            Clone Template
                                        </Menu.Item>
                                        <Menu.Item key="2" icon={<CheckCircleOutlined className="text-green-500" />} onClick={() => showUseTemplateModal(template)}>
                                            Use Template
                                        </Menu.Item>
                                    </Menu>
                                } trigger={['click']}>
                                    <EllipsisOutlined className="text-lg transform rotate-90 cursor-pointer" />
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-0 right-0 w-full bg-white p-4 shadow-md flex justify-end items-center gap-5">
                <Pagination
                    current={currentPage}
                    total={totalTemplates}
                    pageSize={itemsPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    className="mt-4 text-center"
                />
            </div>

            <Modal
                title="Send Feedback"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={1200}
                bodyStyle={{ display: 'flex', gap: '2rem', padding: '1.5rem', maxHeight: '900px', overflowY: 'auto' }}
                style={{ marginLeft: 'auto', marginRight: 30, height: '700px' }}
            >
                <div style={{ display: 'flex', gap: '2rem', height: '100%' }}>
                    <div className="relative bg-white border border-gray-500 rounded-lg shadow-lg p-3 transition-transform transform hover:translate-y-[-4px] hover:shadow-xl"
                        style={{ flex: 1, height: '100%' }}>
                        <img
                            src={selectedTemplate?.image}
                            alt={selectedTemplate?.title}
                            style={{ width: '100%', borderRadius: '12px', maxHeight: '500px', objectFit: 'cover' }}
                        />
                    </div>

                    <div style={{ flex: 1, height: '100%' }}>
                        <p style={{ marginBottom: '2rem', marginLeft: 350, marginRight: 'auto' }}>
                            <ClockCircleOutlined /> Last Update: {selectedTemplate?.date}
                        </p>

                        <Select
                            placeholder="Select Class Name"
                            style={{ marginBottom: '1rem', width: '100%' }}
                        >
                            <Option value="BA_01">BA_01</Option>
                            <Option value="NET_14">NET_14</Option>
                            <Option value="REACT_13">REACT_13</Option>
                        </Select>

                        <DatePicker placeholder="Expiration Date" style={{ marginBottom: '1rem', width: '100%' }} />

                        <div style={{ marginBottom: '1rem' }}>
                            <Radio
                                onClick={() => setShowSendDateOption(!showSendDateOption)} // Toggle the state on click
                                checked={showSendDateOption}
                            >
                                Set Send Date
                            </Radio>

                            {showSendDateOption && (
                                <DatePicker placeholder="Send Date" style={{ marginTop: '1rem', width: '100%' }} />
                            )}
                        </div>

                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', paddingTop: '14rem' }}>
                            <Button
                                type="primary"
                                onClick={handleUseTemplate}
                                style={{ width: 200, borderRadius: '12px' }}
                            >
                                SEND
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default ClassTemplate;
