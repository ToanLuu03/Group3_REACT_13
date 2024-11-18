import React, { useState, useEffect } from "react";
import { Table, Pagination, Row, Col } from "antd";
import SelectOptions from "../../../../../components/portal/SelectOptions";
import SelectDateRange from "../../../../../components/portal/SelectDateRange";
import BarChart from "../../../../../components/portal/BarChart";
import { fetchDataGPA } from "../../../../../services/gpa";

const TrainerGPA = () => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pageSize, setPageSize] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [topicOptions, setTopicOptions] = useState([]);
  const [classesOptions, setClassesOptions] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchDataGPA(token);
        if (response && response.data) {
          const fetchedData = response.data;
          console.log(fetchedData);
          setData(fetchedData);

          const uniqueTopics = [
            ...new Set(fetchedData.map((item) => item.moduleName)),
          ].map((topic) => ({ value: topic, label: topic }));
          setTopicOptions(uniqueTopics);

          const uniqueClasses = [
            ...new Set(fetchedData.map((item) => item.className)),
          ].map((cls) => ({ value: cls, label: cls }));
          setClassesOptions(uniqueClasses);
        } else {
          throw new Error("Failed to fetch data.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [chartData, setChartData] = useState({
    labels: [],
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
        labels: selectedTopics.map((topic) => topic.label),
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
      HL24_FR_FJB_03: "rgba(102, 102, 255, 0.6)",
    };

    const labels = selectedTopics.map((topic) => topic.label || topic);
    const datasets = selectedClasses.map((cls) => {
      const classData = selectedClassData.filter(
        (item) => item.className === cls
      );
      return {
        label: cls,
        data: labels.map((topic) => {
          const topicData = classData.find((item) => item.moduleName === topic);
          return topicData ? topicData.gpa : 0; // Return 0 if GPA data is missing
        }),
        backgroundColor: colors[cls] || "rgba(108, 119, 147, 0.6)",
      };
    });

    setChartData({
      labels: labels,
      datasets: datasets,
    });
  };

  const handleTopicChange = (value) => setSelectedTopics(value);
  const handleClassChange = (value) => {
    if (value.includes("select-all")) {
      if (selectedClasses.length === classesOptions.length) {
        setSelectedClasses([]);
      } else {
        setSelectedClasses(classesOptions.map((opt) => opt.value));
      }
    } else {
      setSelectedClasses(value);
    }
  };

  const handleDateRangeChange = (value) => setSelectedDateRange(value);

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
        return new Date(date).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
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
            options={topicOptions}
            onChange={handleTopicChange}
          />
        </Col>

        <Col xs={24} md={8}>
          <h2 className="text-lg font-semibold mb-2">Select class</h2>
          <SelectOptions
            mode={"multiple"}
            options={[
              { value: "select-all", label: "Select All" },
              ...classesOptions,
            ]}
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
        {selectedTopics.length === 0 ||
        selectedClasses.length === 0 ||
        !selectedDateRange ? (
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
