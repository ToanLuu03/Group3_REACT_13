import React, { useMemo } from "react";
import { Table } from "antd";

const columns = [
  { title: "Class", dataIndex: "class", key: "class", width: '25%' },
  { title: "Module", dataIndex: "module", key: "module", width: '55%'},
  { title: "Date", dataIndex: "date", key: "date", width: '15%' },
  { title: "GPA", dataIndex: "gpa", key: "gpa", width: '15%' },
];

const GPATable = ({ data }) => {
  const tableData = useMemo(
    () =>
      data.map((item, index) => ({
        key: index,
        class: item.className,
        module: item.moduleName,
        date: new Date(item.endDate).getFullYear(),
        gpa: item.gpa,
      })),
    [data]
  );

  return (
    <div className="mt-5">
      <h2 className="text-center mb-5 text-lg md:text-xl font-semibold">GPA Table</h2>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={{ pageSize: 4 }}
        responsive // Makes the table responsive based on Ant Design's built-in support
      />
    </div>
  );
};

export default GPATable;
