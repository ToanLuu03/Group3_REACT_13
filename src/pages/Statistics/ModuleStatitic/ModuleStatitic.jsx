import React, { useEffect, useState, useMemo } from "react";
import { MdHome, MdPerson, MdSettings } from "react-icons/md";
import Counter from "./Counter/Counter";
import Filter from "./Filter/Filter";
import DeliveryType from "./DeliveryType/DeliveryType";
import ReportStatus from "./ReportStatus/ReportStatus";
import statistics from "../../../services/statistics";

const COLORS = ["#087BB3", "#08384F", "#34B3F15E"];
const DOUGHNUT_COLORS = ["#000", "#E5E7EB"];

const ModuleStatistic = () => {
  const [dataTotal, setDataTotal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    trainers: [],
    classes: [],
    modules: [],
  });
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [rawData, setRawData] = useState(null);

  const token = localStorage.getItem("token");

  const fetchData = async (controller) => {
    try {
      const response = await statistics.moduleStatistics(token, {
        signal: controller.signal,
      });
      const stats = response.data.statistic;

      setDataTotal([
        { value: stats.totalModules, label: "Total Modules", icon: MdHome },
        {
          value: stats.totalContents,
          label: "Total Contents",
          icon: MdSettings,
        },
        { value: stats.totalTrainers, label: "Total Trainers", icon: MdPerson },
        {
          value: stats.totalDuration,
          label: "Total Duration",
          icon: MdSettings,
        },
      ]);

      setRawData(response.data);
      setFilterOptions({
        trainers: response.data.trainers.map((t) => t.trainerId),
        classes: [],
        modules: [],
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error(error);
      }
    } finally {
      setIsLoading(false); // Stop loading after data is fetched
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller);
    return () => controller.abort();
  }, [token]);

  const filteredData = useMemo(() => {
    if (selectedTrainer && selectedClass && selectedModule) {
      const trainer = rawData?.trainers.find(
        (t) => t.trainerId === selectedTrainer
      );
      const cls = trainer?.classes.find((c) => c.className === selectedClass);
      return cls?.modules.find((m) => m.moduleName === selectedModule) || null;
    }
    return null;
  }, [selectedTrainer, selectedClass, selectedModule, rawData]);

  const deliveryData = useMemo(() => {
    return (
      filteredData?.deliveryDistribution.reduce((acc, item) => {
        const existing = acc.find((d) => d.name === item.deliveryType);
        if (existing) {
          existing.value += item.percentage;
        } else {
          acc.push({ name: item.deliveryType, value: item.percentage });
        }
        return acc;
      }, []) || []
    );
  }, [filteredData]);

  const reportStatusData = useMemo(() => {
    return (
      filteredData?.reportStatusDistribution.reduce((acc, item) => {
        const name = item.status === "true" ? "On going" : "Remaining";
        const existing = acc.find((d) => d.name === name);
        if (existing) {
          existing.value += item.percentage;
        } else {
          acc.push({ name, value: item.percentage });
        }
        return acc;
      }, []) || []
    );
  }, [filteredData]);

  useEffect(() => {
    if (rawData) {
      if (selectedTrainer) {
        const trainer = rawData.trainers.find(
          (t) => t.trainerId === selectedTrainer
        );
        const classes = trainer ? trainer.classes.map((c) => c.className) : [];
        const modules = selectedClass
          ? trainer?.classes
              .find((c) => c.className === selectedClass)
              ?.modules.map((m) => m.moduleName) || []
          : [];

        setFilterOptions({
          trainers: filterOptions.trainers,
          classes,
          modules,
        });
      } else {
        setFilterOptions({
          trainers: filterOptions.trainers,
          classes: [],
          modules: [],
        });
      }
    }
  }, [selectedTrainer, selectedClass, rawData]);

  return (
    <div className="mb-24">
      <Counter data={dataTotal} isLoading={isLoading} />
      <Filter
        options={[
          { name: "Trainer", options: filterOptions.trainers },
          { name: "Class", options: filterOptions.classes },
          { name: "Module", options: filterOptions.modules },
        ]}
        onTrainerSelect={(value) => {
          setSelectedTrainer(value);
          setSelectedClass(null);
          setSelectedModule(null);
        }}
        onClassSelect={(value) => {
          setSelectedClass(value);
          setSelectedModule(null);
        }}
        onModuleSelect={(value) => setSelectedModule(value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {deliveryData.length > 0 && (
          <DeliveryType data={deliveryData} colors={COLORS} />
        )}
        {reportStatusData.length > 0 && (
          <ReportStatus data={reportStatusData} colors={DOUGHNUT_COLORS} />
        )}
      </div>
    </div>
  );
};

export default ModuleStatistic;
