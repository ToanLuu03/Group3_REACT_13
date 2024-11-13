import React, { useState, useEffect, useRef } from 'react';
import { ClockCircleOutlined, EllipsisOutlined, EditOutlined, CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { Modal, Input, Dropdown, Menu, Select, Pagination, Button, DatePicker, notification, Radio } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const CustomTemplate = ({ clonedTemplate, setActiveKey }) => {
    const [savedTemplates, setSavedTemplates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState(null);
    const prevClonedTemplate = useRef(null); // Track the previous cloned template
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isUseTemplateModalVisible, setIsUseTemplateModalVisible] = useState(false);
    const [showSendDateOption, setShowSendDateOption] = useState(false); 


    const navigate = useNavigate();

    const itemsPerPage = 8;

    // Load saved templates from localStorage on component mount
    useEffect(() => {
        const storedTemplates = JSON.parse(localStorage.getItem('savedTemplates'));
        if (storedTemplates) {
            setSavedTemplates(storedTemplates);
        }
    }, []); // Dữ liệu sẽ được tải lại mỗi lần component mount


    // Add clonedTemplate only if it's different from the previous one
    useEffect(() => {
        if (clonedTemplate && clonedTemplate !== prevClonedTemplate.current) {
            // Prevent duplicate templates and add the new one
            setSavedTemplates((prevTemplates) => {
                const updatedTemplates = [...prevTemplates, clonedTemplate];
                localStorage.setItem('savedTemplates', JSON.stringify(updatedTemplates));
                prevClonedTemplate.current = clonedTemplate;
                return updatedTemplates;
            });
        }
    }, [clonedTemplate]);

    // Sorting function based on 'Latest' or 'Oldest'
    const sortedTemplates = [...savedTemplates].sort((a, b) => {
        if (sortOption === 'Latest') {
            return new Date(b.date) - new Date(a.date);
        } else if (sortOption === 'Oldest') {
            return new Date(a.date) - new Date(b.date);
        }
        return 0;
    });

    // Filter templates based on search query
    const filteredTemplates = sortedTemplates.filter(template =>
        template.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const showUseTemplateModal = (template) => {
        setSelectedTemplate(template);
        setIsUseTemplateModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        setActiveKey('3'); // Switch to the "Custom Template" tab   
        notification.success({
            message: 'Action completed successfully',
            description: 'Your feedback has been sent!',
            placement: 'topRight',
        });
    };


    const handleDeleteTemplate = () => {
        // Remove the template with the selected ID from the array
        const updatedTemplates = savedTemplates.filter(template => template.id !== templateToDelete);

        // Update the state and localStorage with the filtered templates
        setSavedTemplates(updatedTemplates);
        localStorage.setItem('savedTemplates', JSON.stringify(updatedTemplates));

        // Close the modal and reset templateToDelete
        setIsDeleteModalVisible(false);
        setTemplateToDelete(null);
    };

    const confirmDelete = (id) => {
        // Set the template id to be deleted
        setTemplateToDelete(id);
        setIsDeleteModalVisible(true); // Show the delete confirmation modal
    };

    const handleCustomTemplate = () => {
        navigate("/CLASS_ADMIN/trainee-management/trainee-feedback/edit-template");
    };

    const handleSortChange = (option) => {
        setSortOption(option);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalTemplates = filteredTemplates.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const menu = (template) => (
        <Menu>
            <Menu.Item key="1" icon={<EditOutlined />} onClick={handleCustomTemplate}>
                Custom Template
            </Menu.Item>
            <Menu.Item key="2" icon={<CheckCircleOutlined className="text-green-500" />} onClick={() => showUseTemplateModal(template)}>
                Use Template
            </Menu.Item>
            <Menu.Item key="3" icon={<CloseOutlined className="text-red-500" />} onClick={() => confirmDelete(template.id)}>
                Delete Template
            </Menu.Item>
        </Menu>
    );

    // Handle use template (close the modal after action)
    const handleUseTemplate = () => {
        setIsModalVisible(false); // Close the modal if open
        setIsUseTemplateModalVisible(false); // Specifically close the "Use Template" modal

        // Switch tab or perform actions related to the template
        setActiveKey('3');

        notification.success({
            message: 'Action completed successfully',
            description: 'Your feedback has been sent!',
            placement: 'topRight',
        });
    };

    // Handle modal cancel action (close the modal)
    const handleCancel = () => {
        setIsUseTemplateModalVisible(false); // Close the modal
    };


    return (
        <div className="mx-auto font-sans text-gray-800">
            {/* Sorting and Search Controls */}
            <div className="flex justify-end gap-5 mb-4 flex-wrap">
                <div className="flex flex-col">
                    <label className="font-medium text-gray-800">Sort</label>
                    <Select
                        value={sortOption}
                        onChange={handleSortChange}
                        style={{ width: 160 }}
                        allowClear
                    >
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

            {/* Template Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-10">
                {filteredTemplates.slice(startIndex, endIndex).map((template) => (
                    <div key={template.id} className="relative bg-white border border-gray-500 rounded-lg shadow-lg p-3">
                        <div className="mb-5">
                            <img src={template.image} alt={template.title} className="rounded-md w-full" />
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-800 truncate">
                                {template.title}
                            </h3>
                            <Dropdown overlay={menu(template)} trigger={['click']}>
                                <EllipsisOutlined className="text-lg cursor-pointer rotate-90" />
                            </Dropdown>
                        </div>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                            <ClockCircleOutlined />
                            Last Update: {template.date}
                        </p>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="fixed bottom-0 right-0 w-full bg-white p-4 shadow-md flex justify-end items-center gap-5">
                <Pagination
                    current={currentPage}
                    total={totalTemplates}
                    pageSize={itemsPerPage}
                    onChange={handlePageChange}
                />
            </div>

            {/* Use Template Modal */}
            <Modal
                title="Send Feedback"
                visible={isUseTemplateModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={1200}
                style={{ marginLeft: 'auto', marginRight: 30, height: '700px', display: 'flex', gap: '2rem', padding: '1.5rem', maxHeight: '900px', overflowY: 'auto' }}
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

            <Modal
                title="Delete Template"
                visible={isDeleteModalVisible}
                onCancel={() => setIsDeleteModalVisible(false)}
                onOk={handleDeleteTemplate}
                okText="Yes, Delete"
                cancelText="Cancel"
                okButtonProps={{
                    danger: true, // This will make the 'Yes, Delete' button red
                }}
                style={{ padding: '1.5rem' }} // Add padding as needed
            >
                <p>Are you sure you want to delete this template?</p>
            </Modal>


        </div>
    );
};

export default CustomTemplate;
