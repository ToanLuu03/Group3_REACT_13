import React, { useState } from 'react';
import {
    ClockCircleOutlined,
    EditOutlined,
    CheckCircleOutlined,
    CloseOutlined,
    EllipsisOutlined,
} from '@ant-design/icons';
import { Modal, Input, Dropdown, Menu, Select, Pagination, Radio, Button, DatePicker, notification } from 'antd';
import { useNavigate } from 'react-router-dom';


const { Option } = Select;

function CustomTemplate({ setActiveKey }) {
    const initialTemplates = [
        { title: 'Mẫu feedback sản phẩm 1', date: '2024/10/01', type: 'Form', id: 1, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Khảo sát ý kiến khách hàng 1', date: '2024/09/15', type: 'Form', id: 2, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu đánh giá dịch vụ 1', date: '2024/08/10', type: 'Form', id: 3, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu khảo sát thị trường 1', date: '2024/07/20', type: 'Form', id: 4, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu phỏng vấn khách hàng 1', date: '2024/06/25', type: 'Form', id: 5, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu nhận xét sản phẩm 1', date: '2024/05/30', type: 'Form', id: 6, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu ghi nhận phản hồi 1', date: '2024/04/15', type: 'Form', id: 7, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu yêu cầu dịch vụ 1', date: '2024/03/10', type: 'Form', id: 8, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu feedback sản phẩm 2', date: '2024/02/05', type: 'Form', id: 9, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Khảo sát ý kiến khách hàng 2', date: '2024/01/01', type: 'Form', id: 10, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu đánh giá dịch vụ 2', date: '2023/12/25', type: 'Form', id: 11, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu khảo sát thị trường 2', date: '2023/11/30', type: 'Form', id: 12, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu phỏng vấn khách hàng 2', date: '2023/10/15', type: 'Form', id: 13, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu nhận xét sản phẩm 2', date: '2023/09/10', type: 'Form', id: 14, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu ghi nhận phản hồi 2', date: '2023/08/05', type: 'Form', id: 15, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu yêu cầu dịch vụ 2', date: '2023/07/01', type: 'Form', id: 16, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu feedback sản phẩm 3', date: '2023/06/01', type: 'Form', id: 17, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Khảo sát ý kiến khách hàng 3', date: '2023/05/01', type: 'Form', id: 18, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu đánh giá dịch vụ 3', date: '2023/04/01', type: 'Form', id: 19, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu khảo sát thị trường 3', date: '2023/03/01', type: 'Form', id: 20, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu phỏng vấn khách hàng 3', date: '2023/02/01', type: 'Form', id: 21, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu nhận xét sản phẩm 3', date: '2023/01/15', type: 'Form', id: 22, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu ghi nhận phản hồi 3', date: '2022/12/20', type: 'Form', id: 23, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu yêu cầu dịch vụ 3', date: '2022/11/25', type: 'Form', id: 24, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu feedback sản phẩm 4', date: '2022/10/30', type: 'Form', id: 25, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Khảo sát ý kiến khách hàng 4', date: '2022/09/05', type: 'Form', id: 26, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu đánh giá dịch vụ 4', date: '2022/08/10', type: 'Form', id: 27, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu khảo sát thị trường 4', date: '2022/07/15', type: 'Form', id: 28, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu phỏng vấn khách hàng 4', date: '2022/06/20', type: 'Form', id: 29, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu nhận xét sản phẩm 4', date: '2022/05/25', type: 'Form', id: 30, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu ghi nhận phản hồi 4', date: '2022/04/30', type: 'Form', id: 31, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu yêu cầu dịch vụ 4', date: '2022/03/05', type: 'Form', id: 32, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu feedback sản phẩm 5', date: '2022/02/10', type: 'Form', id: 33, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Khảo sát ý kiến khách hàng 5', date: '2022/01/15', type: 'Form', id: 34, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu đánh giá dịch vụ 5', date: '2021/12/20', type: 'Form', id: 35, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu khảo sát thị trường 5', date: '2021/11/25', type: 'Form', id: 36, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu phỏng vấn khách hàng 5', date: '2021/10/30', type: 'Form', id: 37, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu nhận xét sản phẩm 5', date: '2021/09/05', type: 'Form', id: 38, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu ghi nhận phản hồi 5', date: '2021/08/10', type: 'Form', id: 39, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu yêu cầu dịch vụ 5', date: '2021/07/15', type: 'Form', id: 40, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu feedback sản phẩm 6', date: '2021/06/20', type: 'Form', id: 41, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Khảo sát ý kiến khách hàng 6', date: '2021/05/25', type: 'Form', id: 42, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu đánh giá dịch vụ 6', date: '2021/04/30', type: 'Form', id: 43, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu khảo sát thị trường 6', date: '2021/03/05', type: 'Form', id: 44, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu phỏng vấn khách hàng 6', date: '2021/02/10', type: 'Form', id: 45, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu nhận xét sản phẩm 6', date: '2021/01/15', type: 'Form', id: 46, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu ghi nhận phản hồi 6', date: '2020/12/20', type: 'Form', id: 47, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
        { title: 'Mẫu yêu cầu dịch vụ 6', date: '2020/11/25', type: 'Form', id: 48, image: 'https://formuiz.com/images/templates/presentation-feedback-form.jpg' },
    ];

    const itemsPerPage = 8;
    const [templates, setTemplates] = useState(initialTemplates);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const navigate = useNavigate();


    const sortedTemplates = [...templates].sort((a, b) => {
        if (sortOption === 'Latest') {
            return new Date(b.date) - new Date(a.date);
        } else if (sortOption === 'Oldest') {
            return new Date(a.date) - new Date(b.date);
        }
        return 0;
    });

    const filteredTemplates = sortedTemplates.filter(template =>
        template.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const showUseTemplateModal = (template) => {
        setSelectedTemplate(template);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    // Logic to clone template can be added here if needed
    setActiveKey('3'); // Switch to the "Custom Template" tab   
        // Display notification when the SEND button is clicked
        notification.success({
            message: 'Action completed successfully',
            description: 'Your feedback has been sent!',
            placement: 'topRight', // Position the notification at the top right
        });
    };

    const handleCancel = () => setIsModalVisible(false);

    const totalTemplates = filteredTemplates.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const confirmDelete = (id) => {
        setTemplateToDelete(id);
        setIsDeleteModalVisible(true);
    };

    const deleteTemplate = () => {
        setTemplates(templates.filter(template => template.id !== templateToDelete));
        setIsDeleteModalVisible(false);
        setTemplateToDelete(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handleCustomTemplate = () => {
        navigate("/CLASS_ADMIN/trainee-management/trainee-feedback/edit-template");
    };


    const handleSortChange = (option) => {
        if (sortOption === option) {
            setSortOption(null); // Unselect if the same option is clicked
        } else {
            setSortOption(option);
        }
    };

    const menu = (template) => (
        <Menu>
            <Menu.Item key="1" icon={<EditOutlined />} onClick={handleCustomTemplate}>
                Custom Template
            </Menu.Item>            <Menu.Item key="2" icon={<CheckCircleOutlined className="text-green-500" />} onClick={() => showUseTemplateModal(template)}>
                Use Template
            </Menu.Item>
            <Menu.Item key="3" icon={<CloseOutlined className="text-red-500" />} onClick={() => confirmDelete(template.id)}>Delete Template</Menu.Item>
        </Menu>
    );

    return (
        <div className="mx-auto font-sans text-gray-800">
            <div className="flex justify-end gap-5 mb-4 flex-wrap">
                <div className="flex flex-col">
                    <label className="font-medium text-gray-800">Sort</label>
                    <Select
                        value={sortOption}
                        onChange={handleSortChange} // Use handleSortChange here
                        style={{ width: 160 }}
                        allowClear
                        dropdownRender={() => (
                            <Radio.Group
                                value={sortOption}
                                onChange={(e) => handleSortChange(e.target.value)} // Use handleSortChange for radio change
                                style={{ display: 'flex', flexDirection: 'column', padding: 20, gap: 15 }}
                            >
                                <Radio value="Latest">Latest</Radio>
                                <Radio value="Oldest">Oldest</Radio>
                            </Radio.Group>
                        )}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                {filteredTemplates.slice(startIndex, endIndex).map((template) => (
                    <div key={template.id} className="relative bg-white border border-gray-400 rounded-lg shadow-lg p-4 transition-transform transform hover:translate-y-[-4px] hover:shadow-xl">
                        <div className="mb-5">
                            <img src={template.image} alt={template.title} className="rounded-md w-full" />
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

            <div className="fixed bottom-0 right-0 w-full bg-white p-2 shadow-md flex justify-end items-center gap-5">
                {/* Pagination */}
                <Pagination
                    current={currentPage}
                    total={totalTemplates}
                    pageSize={itemsPerPage}
                    onChange={handlePageChange}
                    itemRender={(page, type, originalElement) => {
                        const lastPage = Math.ceil(totalTemplates / itemsPerPage);

                        if (type === "page") {
                            // Luôn hiển thị trang đầu và trang cuối
                            if (page === 1 || page === lastPage) {
                                return originalElement;
                            }

                            // Hiển thị các trang liền kề trang hiện tại
                            if (Math.abs(page - currentPage) <= 1) {
                                return originalElement;
                            }

                            // Dấu ba chấm trước trang hiện tại khi có khoảng cách với trang đầu
                            if (page === currentPage - 2 && page > 2) {
                                return <span>...</span>;
                            }

                            // Dấu ba chấm sau trang hiện tại khi có khoảng cách với trang cuối
                            if (page === currentPage + 2 && page < lastPage - 1) {
                                return <span>...</span>;
                            }

                            // Khi đang ở trang gần cuối, hiển thị thêm các trang phía trước
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

            <Modal
                title={
                    <div className="w-full bg-red-600 text-white font-bold" style={{ padding: 20, borderRadius: 6 }}>
                        DELETE TEMPLATE
                    </div>
                }
                visible={isDeleteModalVisible}
                onOk={deleteTemplate}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{
                    style: {
                        backgroundColor: 'red',
                        color: 'white',
                        border: 'none', // Remove border if needed
                    },
                }}
            >
                <p className='text-black font-bold'>Are you sure you want to delete this template?</p>
            </Modal>

            <Modal
                title="Send Feedback"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
                width={1200} // Increased modal width to make it larger
                bodyStyle={{ display: 'flex', gap: '2rem', padding: '1.5rem', maxHeight: '900px', overflowY: 'auto' }} // Set maxHeight and overflow
                style={{ marginLeft: 'auto', marginRight: 30, height: '700px' }} // Set height for the entire modal
            >
                <div style={{ display: 'flex', gap: '2rem', height: '100%' }}> {/* Set height to 100% for inner div */}
                    {/* Left Side: Image */}
                    <div className="relative bg-white border border-gray-500 rounded-lg shadow-lg p-3 transition-transform transform hover:translate-y-[-4px] hover:shadow-xl"
                        style={{ flex: 1, height: '100%' }}>
                        <img
                            src={selectedTemplate?.image}
                            alt={selectedTemplate?.title}
                            style={{ width: '100%', borderRadius: '12px', maxHeight: '500px', objectFit: 'cover' }} // Larger image area
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
                                onClick={handleOk}
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

export default CustomTemplate;
