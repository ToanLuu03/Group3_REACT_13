import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Table, Input, Dropdown, Menu, Button, Checkbox, Tag } from 'antd';
import { DownOutlined } from '@ant-design/icons';
// import './TrainerList.css';
import { fetchClasses } from '../../../api/AdminAPI/Trainer_list_api';
import { PATH_NAME } from '../../../constants/pathName';
import { useSelector } from 'react-redux';

const { Search } = Input;

function TrainerList() {
  const [trainers, setTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [siteOptions, setSiteOptions] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);
  const [statusSelectAll, setStatusSelectAll] = useState(false);
  const [siteSelectAll, setSiteSelectAll] = useState(false);
  const [statusSearchValue, setStatusSearchValue] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [siteDropdownVisible, setSiteDropdownVisible] = useState(false);
  const role = useSelector((state) => state.role.selectedRole.role);
  const token = useSelector((state) => state.users.users.userName.token)

  const navigate = useNavigate();

  useEffect(() => {

    const getTrainers = async () => {
      try {
        const data = await fetchClasses(token);
        setTrainers(data);
        setFilteredTrainers(data);
        const statuses = [...new Set(data.map(trainer => trainer.status).filter(Boolean))];
        const sites = [...new Set(data.map(trainer => trainer.site).filter(Boolean))];
        setStatusOptions(statuses);
        setSiteOptions(sites);
      } catch (error) {
        console.error(error)
      }
    };

    getTrainers();
  }, []);

  const handleAddTrainer = () => {
    navigate(`/${role}/add-trainer`);
  };

  const handleStatusChange = (checkedValues) => {
    setSelectedStatuses(checkedValues);
    setStatusSelectAll(checkedValues.length === statusOptions.length);
    filterTrainers(checkedValues, selectedSites);
  };

  const handleSiteChange = (checkedValues) => {
    setSelectedSites(checkedValues);
    setSiteSelectAll(checkedValues.length === siteOptions.length);
    filterTrainers(selectedStatuses, checkedValues);
    setSiteDropdownVisible(true);
  };
  const filterTrainers = (statuses, sites) => {
    let filtered = trainers;
    if (statuses.length) {
      filtered = filtered.filter((trainer) => statuses.includes(trainer.status));
    }
    if (sites.length) {
      filtered = filtered.filter((trainer) => sites.includes(trainer.site));
    }
    setFilteredTrainers(filtered);
  };

  const handleStatusSelectAll = (e) => {
    const allStatus = e.target.checked ? statusOptions : [];
    setSelectedStatuses(allStatus);
    setStatusSelectAll(e.target.checked);
    filterTrainers(allStatus, selectedSites);
    setDropdownVisible(true);
  };

  const handleStatusSearchChange = (e) => {
    setStatusSearchValue(e.target.value);
  };

  const filteredStatusOptions = statusOptions.filter((status) =>
    status.toLowerCase().includes(statusSearchValue.toLowerCase())
  );
  const handleSiteSelectAll = (e) => {
    const allSites = e.target.checked ? siteOptions : [];
    setSelectedSites(allSites);
    setSiteSelectAll(e.target.checked);
    filterTrainers(selectedStatuses, allSites);
    setSiteDropdownVisible(true);
  };

  const handleSearch = (value) => {
    const filtered = trainers.filter((trainer) =>
      trainer.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTrainers(filtered);
  };

  const handleTrainerClick = (trainerId, account) => {
    localStorage.setItem('trainerAccount', account);
    navigate(`/${role}/trainer-management`);
  };

  const columns = [
    {
      title: 'No.',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      align: 'center',
    },
    {
      title: 'Trainer Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <span className='trainerList text-blue-600 cursor-pointer' onClick={() => handleTrainerClick(record.id, record.account)}>{text}</span>
      ),
      align: 'center',
    },
    { title: 'FPT Account', dataIndex: 'account', key: 'account', align: 'center' },
    { title: 'Type', dataIndex: 'type', key: 'type', align: 'center' },
    { title: 'Site', dataIndex: 'site', key: 'site', align: 'center', },
    { title: 'Job Rank', dataIndex: 'jobRank', key: 'jobRank', align: 'center' },
    { title: 'The Trainer Cert', dataIndex: 'trainTheTrainerCert', key: 'trainTheTrainerCert', align: 'center', },
    { title: 'Professional Level', dataIndex: 'professionalLevel', key: 'professionalLevel', align: 'center', },
    { title: 'Professional Index', dataIndex: 'professionalIndex', key: 'professionalIndex', align: 'center', },
    { title: 'Competence Index', dataIndex: 'trainingCompetenceIndex', key: 'trainingCompetenceIndex', align: 'center', },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (status) => {
        let color = 'green';
        if (status === 'Busy') color = 'volcano';
        if (status === 'Out') color = 'red';
        if (status === 'Onsite') color = 'geekblue';
        return <Tag color={color}>{status || 'N/A'}</Tag>;
      },
      align: 'center',
    },
    { title: 'Taught Skills', dataIndex: 'taughtSkills', key: 'taughtSkills', align: 'center', },
    { title: 'Email ', dataIndex: 'email', key: 'email', align: 'center', },
    { title: 'Type', dataIndex: 'type', key: 'type', align: 'center', },
  ];
  const statusMenu = (
    <Menu>
      <Menu.Item>
        <Input
          placeholder="Search"
          onChange={handleStatusSearchChange}
        />
      </Menu.Item>
      <Menu.Item>
        <Checkbox onChange={handleStatusSelectAll} checked={statusSelectAll}>
          Select All
        </Checkbox>
      </Menu.Item>
      <Checkbox.Group
        value={selectedStatuses}
        onChange={handleStatusChange}
        style={{ display: 'block', width: '75%', }}

      >
        {filteredStatusOptions.map((status) => (
          <Menu.Item key={status}>
            <Checkbox value={status}>{status}</Checkbox>
          </Menu.Item>
        ))}
      </Checkbox.Group>
    </Menu>
  );

  const siteMenu = (
    <Menu>
      <Menu.Item>
        <Input
          placeholder="Search"
          onChange={handleStatusSearchChange}
        />
      </Menu.Item>
      <Menu.Item>
        <Checkbox onChange={handleSiteSelectAll} checked={siteSelectAll}>
          Select All
        </Checkbox>
      </Menu.Item>
      <Checkbox.Group
        value={selectedSites}
        onChange={handleSiteChange}
        style={{ display: 'block' }}
      >
        {siteOptions.map((site) => (
          <Menu.Item key={site}>
            <Checkbox value={site}>{site}</Checkbox>
          </Menu.Item>
        ))}
      </Checkbox.Group>
    </Menu>
  );



  return (
    <div>
      <div className='mt-16 flex w-full justify-between'>
        <h2 className=" font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 sm:mb-0">Trainers List ({filteredTrainers.length}) </h2>
        <Button type="primary" onClick={handleAddTrainer} className='bg-[#5750DF] rounded-full p-6 font-medium text-base'>
          Add Trainer
        </Button>
      </div>

      <div className='flex  ' style={{ marginBottom: 16 }}>
        {/* Status Filter */}
        <div className='col-2'>
          <h4 className='text'>Status</h4>
          <Dropdown
            overlay={statusMenu}
            trigger={['click']}
            visible={dropdownVisible}
            onVisibleChange={(flag) => setDropdownVisible(flag)}
          >
            <Button className='button'>
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>

        {/* Site Filter */}
        <div className='col-2'>
          <h4 className='text'>Site</h4>
          <Dropdown
            overlay={siteMenu}
            trigger={['click']}
            visible={siteDropdownVisible}
            onVisibleChange={(flag) => setSiteDropdownVisible(flag)}
          >
            <Button className='button'>
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>

        {/* Search */}
        <div className='col-3'>
          <h4 className='text '> Search</h4>
          <Search
            placeholder="Search by name"
            onSearch={handleSearch}
            className="custom-search"
          />
        </div>
      </div>

      {/* Trainers Table */}
      <Table
        className='custom-table'
        columns={columns}
        dataSource={filteredTrainers}
        rowKey="id"
        pagination={{ pageSize: 6 }}
        bordered
        scroll={{
          x: 'calc(700px + 100%)',

        }}
      />
    </div>
  );
}
export default TrainerList;