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
    years: [],
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchGPAData = async () => {
      try {
        if (!token) {
          console.warn("Token is missing.");
          return;
        }
        const response = await fetchDataGPA(token);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching GPA data:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGPAData();
  }, [token]);

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
  };

  const filteredData = data.filter((item) => {
    const { trainers, classes, modules, years } = selectedFilters;
    const itemYear = new Date(item.endDate).getFullYear();

    return (
      (!trainers.length || trainers.includes(item.trainerAccount)) &&
      (!classes.length || classes.includes(item.className)) &&
      (!modules.length || modules.includes(item.moduleName)) &&
      (!years.length || (itemYear >= years[0] && itemYear <= years[1]))
    );
  });

  const isFiltersSelected =
    selectedFilters.trainers.length > 0 &&
    selectedFilters.classes.length > 0 &&
    selectedFilters.modules.length > 0 &&
    selectedFilters.years.length > 0;

  if (loading) {
    return (
      <div className="flex justify-start items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="bg-white rounded p-4">
        <FilterSection data={data} onFilterChange={handleFilterChange} />
      </div>
      {isFiltersSelected && (
        <div className="flex justify-center flex-col items-center">
          <div className="bg-white rounded p-4 mt-6 w-[1480px] items-center">
            <GPAChart data={filteredData} />
          </div>
          <div className="bg-white rounded p-4 mt-6 w-full">
            <GPATable data={filteredData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GPA;
