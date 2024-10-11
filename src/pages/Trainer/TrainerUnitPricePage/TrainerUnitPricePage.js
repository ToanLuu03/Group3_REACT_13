import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { fetchTrainers } from '../../../api/Unit_Price_API';
import './TrainerUnitPricePage.css';

function TrainerUnitPrice() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái loading


  useEffect(() => {
    setLoading(true); // loading khi lấy dữ liệu
    fetchTrainers()
      .then((data) => {
        // set hàm timeout để tạo độ trễ khi load
        setTimeout(() => {
          setTrainers(data);
          setLoading(false);
        }, 300);
      })
      .catch((error) => {
        console.error('Lỗi trong useEffect:', error);
        setLoading(false);
      });

  }, []);

  const columns = [
    {
      title: 'No',
      dataIndex: 'No',
      key: 'No',
    },
    {
      title: 'Unitcode',
      dataIndex: 'Unitcode',
      key: 'Unitcode',
    },
    {
      title: 'Lastmodifieddate',
      dataIndex: 'Lastmodifieddate',
      key: 'Lastmodifieddate',
    },
    {
      title: 'Lastmodifiedby',
      dataIndex: 'Lastmodifiedby',
      key: 'Lastmodifiedby',
    },
    {
      title: 'Price',
      dataIndex: 'Price',
      key: 'Price',
    },
    {
      title: 'Note',
      dataIndex: 'Note',
      key: 'Note',
    },
  ];

  return (
    <div className="trainer-unit">
      {loading ? (
        <div className="loading-container">
          <p>Loading Data...</p>
        </div>
      ) : (
        <Table
          dataSource={trainers}
          columns={columns}
          rowKey="No" // Sử dụng trường nào để làm key cho mỗi hàng
          pagination={{
            pageSize: 7,
          }}
        />
      )}
    </div>
  );
}

export default TrainerUnitPrice;
