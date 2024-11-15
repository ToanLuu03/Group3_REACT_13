import React, { useState, useEffect } from 'react';
import {
  Table,
  Spin,
  Button,
  notification,
  Select,
  Input,
  Dropdown,
  Menu,
  Modal, // Import Modal from Ant Design
} from 'antd';
import { fetchJobs, deleteJob, fetchRoles, fetchJobById } from '../../../../api/FamsAdmin/Job';
import ModalAdd from './CRUD/ModalAdd';
import ModalEdit from './CRUD/ModalEdit'; // Import ModalEdit
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';

const { Option } = Select;

const RoleManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [rolesOption, setRolesOption] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleValue, setRoleValue] = useState([]); // Set 'all' as default value
  const [isModalAddVisible, setIsModalAddVisible] = useState(false);
  const [isModalEditVisible, setIsModalEditVisible] = useState(false); // ModalEdit visibility
  const [jobToEdit, setJobToEdit] = useState(null); // Job data for edit

  const refreshJobs = () => setRefreshFlag((prev) => !prev);

  useEffect(() => {
    const getJobs = async () => {
      setLoading(true);
      const data = await fetchJobs();
      const roleList = await fetchRoles();
      setRolesOption(roleList);
      setJobs(data);
      setLoading(false);
    };
    getJobs();
  }, [refreshFlag]);

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const data = await fetchJobById(id);
      setJobToEdit(data); // Set job data to edit
      setIsModalEditVisible(true); // Open the edit modal
    } catch (error) {
      notification.error({
        message: 'Can not get role data',
        description: error.message,
        placement: 'topRight',
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this role?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteJob(id);
          setRefreshFlag((prev) => !prev);
          notification.success({
            message: 'Deleted role successfully',
            placement: 'topRight',
            duration: 3,
          });
        } catch (error) {
          notification.error({
            message: 'Failed to delete role',
            description: error.message || 'An error occurred',
            placement: 'topRight',
            duration: 3,
          });
        }
      },
      onCancel() {
        // Do nothing on cancel
      },
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };


  const handleSelectAll = (selectedValues) => {
    if (selectedValues.includes('all')) {
      if (selectedValues.length === rolesOption.length + 1) {
        setRoleValue([]); // Deselect all
      } else {
        setRoleValue(rolesOption); // Select all options
      }
    } else {
      setRoleValue(selectedValues); // Set selected roles
    }
  };

  const handleAddSuccess = () => {
    refreshJobs();
    notification.success({
      message: 'Role added successfully',
      placement: 'topRight',
      duration: 3,
    });
  };

  const handleAddFailure = (error) => {
    notification.error({
      message: 'Failed to add role',
      description: error.message || 'An error occurred',
      placement: 'topRight',
      duration: 3,
    });
  };

  const handleEditSuccess = () => {
    refreshJobs();
  };

  const handleEditFailure = (error) => {
    notification.error({
      message: 'Failed to update role',
      description: error.message || 'An error occurred',
      placement: 'topRight',
      duration: 3,
    });
  };

  const filteredJobs = jobs.filter((job) => {
    const roleMatch = roleValue.length === 0 || roleValue.includes(job.role);
    const searchMatch =
      job.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.note.toLowerCase().includes(searchTerm.toLowerCase());

    return roleMatch && searchMatch;
  });


  const columns = [
    {
      title: 'No.',
      key: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status ? status : 'N/A'),
    },
    {
      title: 'Levels',
      dataIndex: 'levels',
      key: 'levels',
      render: (levels) => levels.map((level) => level.name).join(', '),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="edit" onClick={() => handleEdit(record.id)}>
                <EditOutlined style={{ marginRight: 8 }} /> Edit
              </Menu.Item>
              <Menu.Item key="deactivate" onClick={() => handleDeactivate(record.id)}>
                <DeleteOutlined style={{ marginRight: 8 }} /> Deactivate
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button type="link"><MoreOutlined /></Button>
        </Dropdown>

      ),
    },
  ];
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
      return textString.length > 17 ? textString.slice(0, 17) + "..." : textString;
    }
  };
  return (
    <Spin spinning={loading} size="large" tip="Loading...">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:space-x-2 w-full sm:w-auto">
          <Select
            className="w-full sm:w-[200px]"
            mode="multiple"
            placeholder="Select a role"
            onChange={handleSelectAll}
            value={roleValue}
            maxTagCount={0}
            tagRender={() => tagRender({ values: roleValue, allOptions: rolesOption })}
          >
            <Option value="all">Select All</Option>
            {rolesOption.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
          <Input
            className="w-full sm:w-[300px] h-[30px]"
            placeholder="Search by role or note"
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>
        <Button type="primary" style={{ maxWidth: "100%", borderRadius: '40px' }} // Set fixed width for Input
          onClick={() => setIsModalAddVisible(true)}>
          Add
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table
          className="min-w-full"
          columns={columns}
          dataSource={filteredJobs}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </div>
      {isModalAddVisible && (
        <ModalAdd
          visible={isModalAddVisible}
          onClose={() => setIsModalAddVisible(false)}
          onAddSuccess={handleAddSuccess}
          onAddFailure={handleAddFailure}
        />
      )}
      {isModalEditVisible && jobToEdit && (
        <ModalEdit
          visible={isModalEditVisible}
          onClose={() => setIsModalEditVisible(false)}
          jobData={jobToEdit} // Pass job data for editing
          onEditSuccess={handleEditSuccess}
          onEditFailure={handleEditFailure}
        />
      )}
    </Spin>
  );
};

export default RoleManagement;
