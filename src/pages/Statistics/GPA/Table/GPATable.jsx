

import React from 'react';
import { Table } from 'antd';

const columns = [
  { title: 'Class', dataIndex: 'class', key: 'class' },
  { title: 'Module', dataIndex: 'module', key: 'module' },
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'GPA', dataIndex: 'gpa', key: 'gpa' },
];

const data = [
  { key: '1', class: 'Java01', module: 'HTML CSS', date: '2022', gpa: 8.7 },
  { key: '2', class: 'Java02', module: 'JS', date: '2023', gpa: 6.7 },
  { key: '3', class: 'Java02', module: 'ReactJS', date: '2024', gpa: 9.8 },
  { key: '4', class: 'Java03', module: 'ReactJS', date: '2024', gpa: 4.4 },
];

const GPATable = () => {
  return (
    <div className="p-4">
      <h2 className="text-center text-lg font-semibold">GPA Table</h2>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 4 }} />
    </div>
  );
};

export default GPATable;
