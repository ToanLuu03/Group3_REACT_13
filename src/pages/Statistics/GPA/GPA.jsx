import React, { useEffect, useState } from "react";
import FilterSection from "./Filter/FilterSection";
import GPATable from "./Table/GPATable";
import { fetchDataGPA } from "../../../services/gpa";
import { Spin } from "antd";
import GPAChart from "./Chart/GPAChart";

const GPA = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    trainers: [],
    classes: [],
    modules: [],
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const PortalData = async () => {
        try {
          const response = await fetchDataGPA(token);
          setData(response.data);
        } catch (error) {
          console.error("Error fetching GPA data:", error.message);
        } finally {
          setLoading(false);
        }
      };
      PortalData();
    } else {
      console.warn("Token is missing.");
      setLoading(false);
    }
  }, []);

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
  };

  const filteredData = data.filter((item) => {
    const trainerMatch =
      !selectedFilters.trainers.length ||
      selectedFilters.trainers.includes(item.trainerAccount);
    const classMatch =
      !selectedFilters.classes.length ||
      selectedFilters.classes.includes(item.className);
    const moduleMatch =
      !selectedFilters.modules.length ||
      selectedFilters.modules.includes(item.moduleName);
    return trainerMatch && classMatch && moduleMatch;
  });

  if (loading)
    return (
      <div className="flex justify-start items-center">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="min-h-screen p-6">
      <div className="bg-white rounded p-4">
        <FilterSection data={data} onFilterChange={handleFilterChange} />
      </div>
      <div className="flex justify-center flex-col lg:flex-row lg:justify-center">
        <div className="bg-white rounded p-4 mt-6 w-[1280px]">
          <GPAChart data={filteredData} />
        </div>
      </div>
      <div className="bg-white rounded p-4 mt-6">
        <GPATable data={filteredData} />
      </div>
    </div>
  );
};

export default GPA;
