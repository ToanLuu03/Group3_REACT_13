import React, { useState, useEffect } from "react";
import { Table, Pagination, Row, Col } from "antd";
import axios from "axios";
import SelectOptions from "../../../../../components/portal/SelectOptions";
import SelectDateRange from "../../../../../components/portal/SelectDateRange";
import BarChart from "../../../../../components/portal/BarChart";


const TrainerGPA = () => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageSize, setPageSize] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  const TopicOptions = [
    { value: "Opening Ceremony", label: "Opening Ceremony" },
    { value: "IT Basic", label: "IT Basic" },
    { value: "First website application", label: "First website application" },
  ];

  const ClassesOptions = [
    { value: "HL24_FR_FJB_03", label: "HL24_FR_FJB_03" },
  ];

  useEffect(() => {
    axios
      .get(
        "https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainer-management/portal/PhuongDP_test"
      )
      .then((response) => {
        setData(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const [chartData, setChartData] = useState({
    labels: ["Opening Ceremony", "IT Basic", "First website application"],
    datasets: [],
  });

  useEffect(() => {
    updateChartData();
  }, [selectedTopics, selectedClasses, selectedDateRange, data]);

  const updateChartData = () => {
    if (
      selectedClasses.length === 0 ||
      selectedTopics.length === 0 ||
      !selectedDateRange ||
      !data
    ) {
      setChartData({
        labels: ["Opening Ceremony", "IT Basic", "First website application"],
        datasets: [],
      });
      return;
    }

    const selectedClassData = data.filter(
      (item) =>
        selectedClasses.includes(item.className) &&
        new Date(item.endDate) >= new Date(selectedDateRange[0]) &&
        new Date(item.endDate) <= new Date(selectedDateRange[1])
    );

    const colors = {
      "HL24_FR_FJB_03": "rgba(102, 102, 255, 0.6)",
    };

    const datasets = selectedClasses.map((cls) => ({
      label: cls,
      data: selectedTopics.map(
        (topic) =>
          selectedClassData.find(
            (item) =>
              item.moduleName.includes(topic) && item.className === cls
          )?.gpa || 0
      ),
      backgroundColor: colors[cls] || "rgba(108, 119, 147, 0.6)",
    }));

    setChartData({
      labels: selectedTopics.map(
        (topic) => topic.charAt(0).toUpperCase() + topic.slice(1).replace("-", " ")
      ),
      datasets: datasets,
    });
  };

  const handleTopicChange = (value) => {
    setSelectedTopics(value);
  };

  const handleClassChange = (value) => {
    if (value.includes("select-all")) {
      if (selectedClasses.length === ClassesOptions.length) {
        setSelectedClasses([]);
      } else {
        setSelectedClasses(ClassesOptions.map((opt) => opt.value));
      }
    } else {
      setSelectedClasses(value);
    }
  };

  const handleDateRangeChange = (value) => {
    setSelectedDateRange(value);
  };

  // Ant Design Table columns
  const columns = [
    {
      title: "Class",
      dataIndex: "className",
      key: "className",
      align: "center",
    },
    {
      title: "Module",
      dataIndex: "moduleName",
      key: "moduleName",
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "endDate",
      key: "endDate",
      align: "center",
      render: (date) => {
        return new Date(date).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
      },
    },
    {
      title: "GPA",
      dataIndex: "gpa",
      key: "gpa",
      align: "center",
    },
  ];

  // Pagination handler
  const onChangePage = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const renderGPATable = () => {
    if (
      !selectedClasses.length ||
      !selectedTopics.length ||
      !selectedDateRange ||
      !data
    ) {
      return null;
    }

    const selectedClassData = data.filter(
      (item) =>
        selectedClasses.includes(item.className) &&
        new Date(item.endDate) >= new Date(selectedDateRange[0]) &&
        new Date(item.endDate) <= new Date(selectedDateRange[1])
    );

    return (
      <div className="mt-6">
        <h2 className="text-3xl font-semibold text-gray-400 text-center mb-4">
          GPA Table
        </h2>
        <Table
          dataSource={selectedClassData}
          columns={columns}
          pagination={false}
          rowKey="className"
          bordered
        />
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={selectedClassData.length}
          onChange={onChangePage}
          showSizeChanger
          pageSizeOptions={["4", "6", "8"]}
          style={{ textAlign: "center", marginTop: "16px" }}
        />
      </div>
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col items-center m-8">
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} md={8}>
          <h2 className="text-lg font-semibold mb-2">Select topics</h2>
          <SelectOptions
            mode={"multiple"}
            options={TopicOptions}
            onChange={handleTopicChange}
          />
        </Col>

        <Col xs={24} md={8}>
          <h2 className="text-lg font-semibold mb-2">Select class</h2>
          <SelectOptions
            mode={"multiple"}
            options={[{ value: "select-all", label: "Select All" }, ...ClassesOptions]}
            onChange={handleClassChange}
            value={selectedClasses}
          />
        </Col>

        <Col xs={24} md={8}>
          <h2 className="text-lg font-semibold mb-2">Select Date Range</h2>
          <SelectDateRange onChange={handleDateRangeChange} />
        </Col>
      </Row>

      <div className="w-full md:w-[800px] h-auto">
        <h2 className="text-3xl font-semibold text-gray-400 text-center mt-6 mb-4">
          GPA Bar Chart
        </h2>
        {selectedTopics.length === 0 || selectedClasses.length === 0 || !selectedDateRange ? (
          <p className="text-center text-gray-500 text-2xl">
            Please choose Topics and Classes
          </p>
        ) : (
          <BarChart data={chartData} max={10} />
        )}
      </div>

      {renderGPATable()}
    </div>
  );
};

export default TrainerGPA;
