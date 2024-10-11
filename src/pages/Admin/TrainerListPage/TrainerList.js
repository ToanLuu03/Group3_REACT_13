import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
    Table, Input, Button, Select, Checkbox, Form, Tag
} from 'antd';
import './TrainerList.css';

const { Option } = Select;
const { Search } = Input;

const trainersData = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        account: 'ANV200',
        type: 'External',
        site: 'HN',
        jobRank: 'Developer 3',
        trainCert: 'Basic',
        professionalLevel: 'Standard',
        trainingCompetencyIndex: 1.2,
        professionalIndex: 1.5,
        status: 'Available',
        registeredSkills: 'JavaScript, React',
        taughtSkills: 'Java',
    },
    {
        id: 2,
        name: 'Nguyễn Thị B',
        account: 'NTB200',
        type: 'Internal',
        site: 'HN',
        jobRank: 'Software Development Head',
        trainCert: 'None',
        professionalLevel: 'Expert',
        trainingCompetencyIndex: 1.8,
        professionalIndex: 2.0,
        status: 'Busy',
        registeredSkills: 'Management, Agile',
        taughtSkills: 'Scrum',
    },
    {
        id: 3,
        name: 'Lê Văn Luyện',
        account: 'LVL300',
        type: 'Staff',
        site: 'HCM',
        jobRank: 'Bridge Software Engineer 1',
        trainCert: 'Basic',
        professionalLevel: 'Standard',
        trainingCompetencyIndex: 1.1,
        professionalIndex: 1.4,
        status: 'Out',
        registeredSkills: 'PHP, MySQL',
        taughtSkills: 'None',
    },
    {
        id: 4,
        name: 'Trần Văn C',
        account: 'TVC100',
        type: 'External',
        site: 'DN',
        jobRank: 'Developer 2',
        trainCert: 'Intermediate',
        professionalLevel: 'Advanced',
        trainingCompetencyIndex: 1.5,
        professionalIndex: 1.7,
        status: 'Available',
        registeredSkills: 'C#, .NET',
        taughtSkills: 'ASP.NET',
    },
    {
        id: 5,
        name: 'Lưu Toán',
        account: 'TVC120',
        type: 'External',
        site: 'DN',
        jobRank: 'Developer 2',
        trainCert: 'Intermediate',
        professionalLevel: 'Advanced',
        trainingCompetencyIndex: 2.5,
        professionalIndex: 1.7,
        status: 'Available',
        registeredSkills: 'C#, .NET',
        taughtSkills: 'ASP.NET',
    },
    {
        id: 6,
        name: 'Phạm Minh D',
        account: 'PMD100',
        type: 'Internal',
        site: 'HCM',
        jobRank: 'Developer 1',
        trainCert: 'Advanced',
        professionalLevel: 'Expert',
        trainingCompetencyIndex: 2.0,
        professionalIndex: 2.1,
        status: 'Busy',
        registeredSkills: 'Python, Django',
        taughtSkills: 'Machine Learning',
    },
];

const statusOptions = ["Available", "Busy", "Out"];
const siteOptions = ["HN", "HCM", "DN"];

function TrainerList() {
    const { selectMenuItem } = useOutletContext();
    const [filteredData, setFilteredData] = useState(trainersData);
    const [filters, setFilters] = useState({
        search: '',
        status: [],
        site: [],
    });
    const [expandedRowKeys, setExpandedRowKeys] = useState([]); // State to track expanded rows

    const navigate = useNavigate();

    useEffect(() => {
        selectMenuItem('3');
    }, [selectMenuItem]);

    const handleSearchChange = (value) => {
        setFilters({ ...filters, search: value.toLowerCase() });
    };

    const handleStatusChange = (checkedValues) => {
        setFilters({ ...filters, status: checkedValues });
    };

    const handleSiteChange = (checkedValues) => {
        setFilters({ ...filters, site: checkedValues });
    };

    const handleAddTrainer = () => {
        navigate('/admin/add');
    };

    const getStatusTagColor = (status) => {
        switch (status) {
            case 'Available':
                return 'green';
            case 'Busy':
                return 'orange';
            case 'Out':
                return 'red';
            default:
                return 'default';
        }
    };

    useEffect(() => {
        const updatedData = trainersData.filter((trainer) => {
            const matchesStatus = filters.status.length === 0 || filters.status.includes(trainer.status);
            const matchesSite = filters.site.length === 0 || filters.site.includes(trainer.site);
            const matchesSearch = filters.search === '' || trainer.name.toLowerCase().includes(filters.search);

            return matchesStatus && matchesSite && matchesSearch;
        });

        setFilteredData(updatedData);
    }, [filters]);

    const columns = [
        {
            title: 'No.',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Trainer Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <a href='/admin/trainer_management' onClick={() => handleRowExpand(record.id)}>
                    {text}
                </a>
            ),
        },
        {
            title: 'FPT Account',
            dataIndex: 'account',
            key: 'account',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Site',
            dataIndex: 'site',
            key: 'site',
        },
        {
            title: 'Job Rank',
            dataIndex: 'jobRank',
            key: 'jobRank',
        },
        {
            title: 'Train The Trainer Cert',
            dataIndex: 'trainCert',
            key: 'trainCert',
        },
        {
            title: 'Professional Level',
            dataIndex: 'professionalLevel',
            key: 'professionalLevel',
        },
        {
            title: 'Training Competency Index',
            dataIndex: 'trainingCompetencyIndex',
            key: 'trainingCompetencyIndex',
        },
        {
            title: 'Professional Index',
            dataIndex: 'professionalIndex',
            key: 'professionalIndex',
            className: 'responsive-hide',
        },
        {
            title: 'Registered Skills',
            dataIndex: 'registeredSkills',
            key: 'registeredSkills',
            className: 'responsive-hide',
        },
        {
            title: 'Taught Skills',
            dataIndex: 'taughtSkills',
            key: 'taughtSkills',
            className: 'responsive-hide',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag color={getStatusTagColor(status)}>{status}</Tag>,
        },
    ];

    // Handle row expand/collapse
    const handleRowExpand = (id) => {
        setExpandedRowKeys((prevKeys) =>
            prevKeys.includes(id)
                ? prevKeys.filter((key) => key !== id)
                : [...prevKeys, id]
        );
    };

    // Expanded row render
    const expandedRowRender = (record) => {
        return (
            <div>
                <p><strong>Registered Skills:</strong> {record.registeredSkills}</p>
                <p><strong>Taught Skills:</strong> {record.taughtSkills}</p>
                <p><strong>Professional Index:</strong> {record.professionalIndex}</p>
                <p><strong>Training Competency Index:</strong> {record.trainingCompetencyIndex}</p>
            </div>
        );
    };

    return (
        <div className="trainer-management-container">
            <div className='Header-list'>
                <h2>Trainers List ({filteredData.length})</h2>
                <Button type="primary" onClick={handleAddTrainer}>
                    Add Trainer
                </Button>
            </div>

            <hr />

            {/* Filters */}
            <div className="filters-container">
                <Form layout="inline">
                    <Form.Item label="Status">
                        <Select
                            mode="multiple"
                            placeholder="Select status"
                            value={filters.status}
                            style={{ width: 200 }}
                            dropdownRender={menu => (
                                <div style={{ padding: '10px' }}>
                                    <Checkbox.Group
                                        options={statusOptions.map(status => ({
                                            label: status,
                                            value: status
                                        }))}
                                        value={filters.status}
                                        onChange={handleStatusChange}
                                        style={{ display: 'flex', flexDirection: 'column' }}
                                    />
                                </div>
                            )}
                        >
                            {statusOptions.map(status => (
                                <Option key={status} value={status}>{status}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Site">
                        <Select
                            mode="multiple"
                            placeholder="Select site"
                            value={filters.site}
                            style={{ width: 200 }}
                            dropdownRender={menu => (
                                <div style={{ padding: '10px' }}>
                                    <Checkbox.Group
                                        options={siteOptions.map(site => ({
                                            label: site,
                                            value: site
                                        }))}
                                        value={filters.site}
                                        onChange={handleSiteChange}
                                        style={{ display: 'flex', flexDirection: 'column' }}
                                    />
                                </div>
                            )}
                        >
                            {siteOptions.map(site => (
                                <Option key={site} value={site}>{site}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Search">
                        <Search
                            placeholder="Search by name"
                            onChange={(e) => handleSearchChange(e.target.value)}
                            style={{ width: 200 }}
                        />
                    </Form.Item>
                </Form>
            </div>

            {/* Table */}
            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                pagination={{
                    pageSize: 5,  // Hiển thị 5 người trên mỗi trang
                    showSizeChanger: false,  // Ẩn tùy chọn thay đổi số hàng trên mỗi trang
                    showQuickJumper: true,  // Cho phép nhảy đến trang cụ thể
                }}
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
}

export default TrainerList;
