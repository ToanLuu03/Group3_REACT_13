import React, { useMemo } from "react";
import { Table } from "antd";

const columns = [
  { title: "Class", dataIndex: "class", key: "class" },
  { title: "Module", dataIndex: "module", key: "module" },
  { title: "Date", dataIndex: "date", key: "date" },
  { title: "GPA", dataIndex: "gpa", key: "gpa" },
];

const GPATable = ({ data }) => {
  // Transform data to extract year from endDate for the Date column
  const tableData = useMemo(
    () =>
      data.map((item, index) => ({
        key: index,
        class: item.className,
        module: item.moduleName,
        date: new Date(item.endDate).getFullYear(), // Extracts year from endDate
        gpa: item.gpa,
      })),
    [data]
  );

  return (
    <div className="p-4">
      <h2 className="text-center text-lg font-semibold">GPA Table</h2>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={{ pageSize: 4 }}
      />
    </div>
  );
};

export default GPATable;
