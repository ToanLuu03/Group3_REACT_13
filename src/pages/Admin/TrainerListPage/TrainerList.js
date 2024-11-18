import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Input, Dropdown, Menu, Button, Checkbox, Tag } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { fetchClasses } from "../../../api/AdminAPI/Trainer_list_api";

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
  const [statusSearchValue, setStatusSearchValue] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [siteDropdownVisible, setSiteDropdownVisible] = useState(false);
  const [roleAdmin, setRoleAdmin] = useState("");
  const [loading, setLoading] = useState(true); // State để hiển thị loading
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setRoleAdmin(role);
    const getTrainers = async () => {
      setLoading(true); // Bắt đầu hiển thị loading
      try {
        const data = await fetchClasses(token);
        setTrainers(data);
        setFilteredTrainers(data);
        const statuses = [
          ...new Set(data.map((trainer) => trainer.status).filter(Boolean)),
        ];
        const sites = [
          ...new Set(data.map((trainer) => trainer.site).filter(Boolean)),
        ];
        setStatusOptions(statuses);
        setSiteOptions(sites);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    getTrainers();
  }, []);

  const handleAddTrainer = () => {
    navigate(`/${roleAdmin}/add-trainer`);
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
      filtered = filtered.filter((trainer) =>
        statuses.includes(trainer.status)
      );
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
    localStorage.setItem("trainerAccount", account);
    navigate(`/${roleAdmin}/trainer-management`);
  };
  const handleDelete = (trainerId) => {
    const updatedTrainers = trainers.filter((trainer) => trainer.id !== trainerId);
    setTrainers(updatedTrainers);
    setFilteredTrainers(updatedTrainers);
  };
  const handleDeleteSelected = () => {
    const updatedTrainers = trainers.filter(
      (trainer) => !selectedRowKeys.includes(trainer.id)
    );
    setTrainers(updatedTrainers);
    setFilteredTrainers(updatedTrainers);
    setSelectedRowKeys([]); // Reset danh sách được chọn
  };



  const columns = [
    {
      title: "No.",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => index + 1,
      align: "center",
      width: 80,
    },
    {
      title: "Trainer Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span
          className="trainerList text-blue-600 cursor-pointer"
          onClick={() => handleTrainerClick(record.id, record.account)}
        >
          {text}
        </span>
      ),
      align: "center",
    },
    {
      title: "FPT Account",
      dataIndex: "account",
      key: "account",
      align: "center",
    },
    { title: "Type", dataIndex: "type", key: "type", align: "center" },
    { title: "Site", dataIndex: "site", key: "site", align: "center" },
    {
      title: "Job Rank",
      dataIndex: "jobRank",
      key: "jobRank",
      align: "center",
    },
    {
      title: "The Trainer Cert",
      dataIndex: "trainTheTrainerCert",
      key: "trainTheTrainerCert",
      align: "center",
    },
    {
      title: "Professional Level",
      dataIndex: "professionalLevel",
      key: "professionalLevel",
      align: "center",
    },
    {
      title: "Professional Index",
      dataIndex: "professionalIndex",
      key: "professionalIndex",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      fixed: "right",

      render: (status) => {
        let color = "green";
        if (status === "BUSY") color = "blue";
        if (status === "OUT") color = "red";
        if (status === "ONSITE") color = "green";
        return <Tag color={color}>{status || "N/A"}</Tag>;
      },
      align: "center",
    },
    {
      title: "Competence Index",
      dataIndex: "trainingCompetenceIndex",
      key: "trainingCompetenceIndex",
      align: "center",
    },
    {
      title: "Taught Skills",
      dataIndex: "taughtSkills",
      key: "taughtSkills",
      align: "center",
    },
    { title: "Email ", dataIndex: "email", key: "email", align: "center" },
    { title: "Type", dataIndex: "type", key: "type", align: "center" },
    {
      title: "Action",
      key: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Checkbox
            checked={selectedRowKeys.includes(record.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedRowKeys([...selectedRowKeys, record.id]);
              } else {
                setSelectedRowKeys(selectedRowKeys.filter((id) => id !== record.id));
              }
            }}
          />
          <span
            className="text-red-600 cursor-pointer ml-2"
            onClick={() => handleDelete(record.id)}
            style={{ fontSize: "26px", fontWeight: "bold", padding:"10px" }}
          >
            ×
          </span>
        </div>
      ),
    },

  ];
  const statusMenu = (
    <Menu>
      <Menu.Item>
        <Input placeholder="Search" onChange={handleStatusSearchChange} />
      </Menu.Item>
      <Menu.Item>
        <Checkbox onChange={handleStatusSelectAll} checked={statusSelectAll}>
          Select All
        </Checkbox>
      </Menu.Item>
      <Checkbox.Group
        value={selectedStatuses}
        onChange={handleStatusChange}
        style={{ display: "block", width: "75%" }}
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
        <Input placeholder="Search" onChange={handleStatusSearchChange} />
      </Menu.Item>
      <Menu.Item>
        <Checkbox onChange={handleSiteSelectAll} checked={siteSelectAll}>
          Select All
        </Checkbox>
      </Menu.Item>
      <Checkbox.Group
        value={selectedSites}
        onChange={handleSiteChange}
        style={{ display: "block" }}
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
      <div className="mt-16 flex w-full justify-between">
        <h2 className=" font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 sm:mb-0">
          Trainers List ({filteredTrainers.length}){" "}
        </h2>
        <Button
          type="primary"
          onClick={handleAddTrainer}
          className="bg-[#5750DF] rounded-full p-6 font-medium text-base"
        >
          Add Trainer
        </Button>
      </div>

      <div className="flex flex-wrap mb-4 gap-4">
        {/* Status Filter */}
        <div className="flex flex-col sm:flex-col sm:w-auto w-full">
          <h4 className="text mb-2 sm:mb-0">Status</h4>
          <Dropdown
            style={{ width: "100%" }}
            overlay={statusMenu}
            trigger={["click"]}
            visible={dropdownVisible}
            onVisibleChange={(flag) => setDropdownVisible(flag)}
          >
            <Button className="button w-full sm:w-[200px] justify-end">
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>

        <div className="flex flex-col sm:flex-col sm:w-auto w-full">
          <h4 className="text mb-2 sm:mb-0">Site</h4>
          <Dropdown
            overlay={siteMenu}
            trigger={["click"]}
            visible={siteDropdownVisible}
            onVisibleChange={(flag) => setSiteDropdownVisible(flag)}
          >
            <Button className="button w-full sm:w-[200px] justify-end">
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>

        <div className="flex flex-col sm:flex-col sm:w-auto w-full">
          <h4 className="text mb-2 sm:mb-0">Search</h4>
          <Search
            placeholder="Search by name"
            onSearch={handleSearch}
            className="custom-search w-full sm:w-[300px]"
          />
        </div>
      </div>

      {/* Trainers Table */}
      <Table
        className="custom-table"
        columns={columns}
        dataSource={filteredTrainers}
        rowKey="id"
        loading={loading}
        bordered
        scroll={{
          x: "calc(700px + 100%)",
        }}
      />

    </div>
  );
}
export default TrainerList;
