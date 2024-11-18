import React, { useEffect, useState } from 'react';
import { fetchSkillAPI, fetchSkillById, fetchSkilllAdd, fetchSkillDeleteById } from '../../../../api/FamsAdmin/Skill';
import { Table, Space, Button, Dropdown, Select, Input, notification } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import ModalAdd from './CRUD/ModalAdd';
import ModalEdit from './CRUD/ModalEdit';

function SkillManagement() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('all');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);
  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await fetchSkillAPI();
      console.log('API Response:', response);

      if (response?.data) {
        setSkills(response.data);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Current skills state:', skills);
  }, [skills]);

  const columns = [
    {
      title: 'No.',
      key: 'index',
      render: (_, __, index) => index + 1,
      width: '10%',
    },
    {
      title: 'Skill Name',
      dataIndex: 'skillName',
      key: 'skillName',
      width: '25%',
    },
    {
      title: 'Levels',
      dataIndex: 'skillType',
      key: 'levels',
      width: '35%',
      render: (skillType) => {
        if (!skillType || !Array.isArray(skillType)) return '-';

        return skillType.map((level, index) => (
          <span key={index} className="mr-2 px-2 py-1 bg-gray-100 rounded">
            {level}
          </span>
        ));
      }
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      width: '15%',
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (_, record) => {
        const items = [
          {
            key: 'Edit',
            label: 'Edit',
            icon: <EditOutlined />,
            onClick: () => handleEdit(record),
          },
          {
            key: 'Deactivate',
            label: 'Deactivate',
            icon: <DeleteOutlined />,
            onClick: () => handleDelete(record.id),
          },
        ];

        return (
          <Dropdown
            menu={{ items }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  const handleEdit = async (record) => {
    try {
      const skillId = record.id;

      setIsEditModalOpen(true);
      setSelectedSkill(skillId);
    } catch (error) {
      // console.error('Error in handleEdit:', error);
      notification.error({
        message: 'Can not edit skill',
        placement: 'topRight',
        duration: 3,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await fetchSkillDeleteById(id);
      if (result.success) {

        notification.success({
          message: 'Skill deactivated successfully',
          placement: 'topRight',
          duration: 3,
        });  // Refresh the skills list after deletion
        fetchSkills();
      } else {
        notification.error({
          message: 'Failed to deactivate skill',
          placement: 'topRight',
          duration: 3,
        });
      }
    } catch (error) {
      // console.error('Error deleting skill:', error);
      // message.error('Failed to deactivate skill: ' + (error.message || 'Unknown error'));
      notification.error({
        message: `Failed to deactivate skill: ${error.message}`,
        placement: 'topRight',
        duration: 3,
      });
    }
  };

  const handleAddSkill = async (values) => {
    try {
      const response = await fetchSkilllAdd({
        skillName: values.skill,
        note: values.note,
        levels: [1] // Thêm level mặc định
      });
      if (response.success) {
        fetchSkills();
        setIsModalOpen(false);
        notification.success({
          message: 'Skill add successfully',
          placement: 'topRight',
          duration: 3,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Failed to add skill',
        placement: 'topRight',
        duration: 3,
      });
    }
  };

  const handleEditSubmit = async (values) => {
    // Implement your update logic here
    // Example: await updateSkill(selectedSkill.id, values);
  };

  const getSkillOptions = () => {
    const uniqueSkills = [...new Set(skills.map(skill => skill.skillName))];
    return [
      { value: 'all', label: 'All Skills' },
      ...uniqueSkills.map(skill => ({ value: skill, label: skill }))
    ];
  };

  const filterSkills = (data) => {
    return data.filter(item => {
      const matchesSkill = selectedSkillFilter === 'all' || item.skillName === selectedSkillFilter;
      const matchesSearch = searchText === '' ||
        item.skillName.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.note && item.note.toLowerCase().includes(searchText.toLowerCase()));
      return matchesSkill && matchesSearch;
    });
  };

  return (
    <div className="p-5 pt-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:space-x-2 w-full sm:w-auto">
          <Select
            className="w-full sm:w-[200px]"
            placeholder="Select Skill"
            onChange={(value) => setSelectedSkillFilter(value)}
            value={selectedSkillFilter}
            options={getSkillOptions()}
          />
          <Input
            className="w-full sm:w-[300px] h-[30px]"
            placeholder="Search by skill name or note"
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            allowClear
          />
        </div>
        <Button type="primary" style={{ maxWidth: "100%", borderRadius: '40px' }} // Set fixed width for Input
          onClick={() => setIsModalOpen(true)}
        >
          Add
        </Button>
      </div>



      <div className="overflow-x-auto">
        <Table
          className="min-w-full"
          columns={columns}
          dataSource={filterSkills(skills)}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 5,
          }}
        />
      </div>
      <ModalAdd
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedSkill(null);
        }}
        onSubmit={handleAddSkill}
        initialValues={selectedSkill}
      />
      <ModalEdit
        open={isEditModalOpen}
        skillId={selectedSkill}
        onCancel={() => {
          setIsEditModalOpen(false);
          setSelectedSkill(null);
        }}
        onSuccess={() => {
          fetchSkills();
        }}
      />
    </div>
  );
}

export default SkillManagement;
