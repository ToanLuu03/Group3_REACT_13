import React, { useState } from 'react';
import {
    ClockCircleOutlined,
    EditOutlined,
    CheckCircleOutlined,
    EllipsisOutlined,
} from '@ant-design/icons';
import { Input, Dropdown, Menu, Select, Pagination, Modal, notification, DatePicker, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

function ClassTemplate({ setActiveKey }){
    const initialTemplates = [
        { title: 'Mẫu feedback sản phẩm 5', date: '2022/02/10', type: 'Form', id: 33, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Khảo sát ý kiến khách hàng 5', date: '2022/01/15', type: 'Form', id: 34, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        // Add other templates as needed...
    ];

    const itemsPerPage = 8;
    const [templates] = useState(initialTemplates);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUseTemplateModalVisible, setIsUseTemplateModalVisible] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();

    const sortedTemplates = [...templates].sort((a, b) => {
        if (sortOption === 'Latest') return new Date(b.date) - new Date(a.date);
        if (sortOption === 'Oldest') return new Date(a.date) - new Date(b.date);
        return 0;
    });

    const filteredTemplates = sortedTemplates.filter(template =>
        template.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const totalTemplates = filteredTemplates.length;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const handlePageChange = (page) => setCurrentPage(page);

    const handleCustomTemplate = (template) => {
        // Logic to clone template can be added here if needed
        setActiveKey('2'); // Switch to the "Custom Template" tab
    };

    const showUseTemplateModal = (template) => {
        setSelectedTemplate(template);
        setIsUseTemplateModalVisible(true);
    };

    const handleUseTemplate = () => {
        setIsUseTemplateModalVisible(false); // Close the modal

      // Logic to clone template can be added here if needed
      setActiveKey('3'); // Switch to the "Custom Template" tab

        notification.success({
            message: 'Action completed successfully',
            description: 'Your feedback has been sent!',
            placement: 'topRight',
        });
    };

    const handleOk = () => {
        setIsModalVisible(false); // Close the modal
        notification.success({
            message: 'Feedback Sent',
            description: `Feedback for "${selectedTemplate?.title}" has been sent.`,
            placement: 'topRight',
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const menu = (template) => (
        <Menu>
            <Menu.Item key="1" icon={<EditOutlined />} onClick={() => handleCustomTemplate(template)}>
                Clone Template
            </Menu.Item>
            <Menu.Item key="2" icon={<CheckCircleOutlined className="text-green-500" />} onClick={() => showUseTemplateModal(template)}>
                Use Template
            </Menu.Item>
        </Menu>
    );

    return (
        <div className="mx-auto font-sans text-gray-800">
            {/* Sort and Search */}
            <div className="flex justify-end gap-5 mb-4 flex-wrap">
                <div className="flex flex-col">
                    <label className="font-medium text-gray-800">Sort</label>
                    <Select
                        value={sortOption}
                        onChange={value => setSortOption(value)}
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

            {/* Templates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-10 gap-y-10">
                {filteredTemplates.slice(startIndex, endIndex).map((template) => (
                    <div key={template.id} className="relative bg-white border border-gray-500 rounded-lg shadow-lg p-3 transition-transform transform hover:translate-y-[-4px] hover:shadow-xl ">
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
                                <Dropdown overlay={menu(template)} trigger={['click']}>
                                    <EllipsisOutlined className="text-lg transform rotate-90 cursor-pointer" />
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-0 right-0 w-full bg-white p-4 shadow-md flex justify-end items-center gap-5">
                {/* Pagination */}
                <Pagination
                    current={currentPage}
                    total={totalTemplates}
                    pageSize={itemsPerPage}
                    onChange={handlePageChange}
                    itemRender={(page, type, originalElement) => {
                        const lastPage = Math.ceil(totalTemplates / itemsPerPage);

                        if (type === "page") {
                            // Always show the first and last page
                            if (page === 1 || page === lastPage) {
                                return originalElement;
                            }

                            // Show adjacent pages
                            if (Math.abs(page - currentPage) <= 1) {
                                return originalElement;
                            }

                            // Dots before current page when there's a gap from the first page
                            if (page === currentPage - 2 && page > 2) {
                                return <span>...</span>;
                            }

                            // Dots after current page when there's a gap from the last page
                            if (page === currentPage + 2 && page < lastPage - 1) {
                                return <span>...</span>;
                            }

                            // When close to the last page, show extra pages before it
                            if (
                                currentPage >= lastPage - 2 &&
                                Math.abs(page - lastPage) <= 3
                            ) {
                                return originalElement;
                            }

                            return null;
                        }
                        return originalElement;
                    }}
                    showSizeChanger={false}
                    className="mt-4 text-center"
                />
            </div>

            {/* Modal for Sending Feedback */}
            <Modal
                title="Send Feedback"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
                width={1200}
                bodyStyle={{ display: 'flex', gap: '2rem', padding: '1.5rem', maxHeight: '900px', overflowY: 'auto' }}
                style={{ marginLeft: 'auto', marginRight: 30, height: '700px' }}
            >
                <div style={{ display: 'flex', gap: '2rem', height: '100%' }}>
                    {/* Left Side: Image */}
                    <div className="relative bg-white border border-gray-500 rounded-lg shadow-lg p-3 transition-transform transform hover:translate-y-[-4px] hover:shadow-xl"
                        style={{ flex: 1, height: '100%' }}>
                        <img
                            src={selectedTemplate?.image}
                            alt={selectedTemplate?.title}
                            style={{ width: '100%', borderRadius: '12px', maxHeight: '500px', objectFit: 'cover' }}
                        />
                    </div>

                    {/* Right Side: Form */}
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

                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', paddingTop: '14rem' }}>
                            <Button
                                type="primary"
                                onClick={handleOk}
                                style={{ width: 200, borderRadius: '12px' }}
                            >
                                SEND
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Modal for Using Template Confirmation */}
            <Modal
                title="Use Template"
                visible={isUseTemplateModalVisible}
                onCancel={() => setIsUseTemplateModalVisible(false)}
                footer={null}
                width={1200}
                bodyStyle={{ display: 'flex', gap: '2rem', padding: '1.5rem', maxHeight: '900px', overflowY: 'auto' }}
                style={{ marginLeft: 'auto', marginRight: 30, height: '700px' }}
            >
                <div style={{ display: 'flex', gap: '2rem', height: '100%' }}>
                    {/* Left Side: Image */}
                    <div className="relative bg-white border border-gray-500 rounded-lg shadow-lg p-3 transition-transform transform hover:translate-y-[-4px] hover:shadow-xl"
                        style={{ flex: 1, height: '100%' }}>
                        <img
                            src={selectedTemplate?.image}
                            alt={selectedTemplate?.title}
                            style={{ width: '100%', borderRadius: '12px', maxHeight: '500px', objectFit: 'cover' }}
                        />
                    </div>

                    {/* Right Side: Form */}
                    <div style={{ flex: 1, height: '100%' }}>
                        <p style={{ marginBottom: '2rem', marginLeft: 350, marginRight: 'auto' }}>
                            <ClockCircleOutlined /> Last Update: {selectedTemplate?.date}
                        </p>

                        {/* Replaced Input with Select */}
                        <Select
                            placeholder="Select Class Name"
                            style={{ marginBottom: '1rem', width: '100%' }} // Full width
                        >
                            <Option value="BA_01">BA_01</Option>
                            <Option value="NET_14">NET_14</Option>
                            <Option value="REACT_13">REACT_13</Option>
                        </Select>

                        <DatePicker placeholder="Expiration Date" style={{ marginBottom: '1rem', width: '100%' }} />

                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', paddingTop: '14rem' }}>
                            <Button
                                type="primary"
                                onClick={handleUseTemplate}
                                style={{ width: 200, borderRadius: '12px' }} // Set width and rounded corners
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
