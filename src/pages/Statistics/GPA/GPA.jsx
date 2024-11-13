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

  // Check if all filters are selected
  const areAllFiltersSelected =
    selectedFilters.trainers.length &&
    selectedFilters.classes.length &&
    selectedFilters.modules.length &&
    selectedFilters.years.length;

  return (
    <div className="p-4 relative">
      {loading && (
        <div className="fixed inset-0 z-50 bg-gray-200 bg-opacity-75 flex justify-center items-center">
          <Spin size="large" tip="Loading..." />
        </div>
      )}
      <div className="justify-items-center mr-5">
        <FilterSection data={data} onFilterChange={handleFilterChange} />
        <br />
         {areAllFiltersSelected ? (
          <>
            <div className="justify-items-center w-[85vw] md:w-[60vw] lg:w-[70vw]">
              <GPAChart data={filteredData} />
            </div>
            <div className="bg-white p-4 mt-6 w-[85vw] md:w-[60vw] lg:w-[60vw]">
              <GPATable data={filteredData} />
            </div>
          </>
        ) : ""}
        
      </div>
    </div>
  );
};

export default GPA;
