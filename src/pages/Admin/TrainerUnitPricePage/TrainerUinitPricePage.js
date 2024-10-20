import React, { useState, useEffect } from 'react';
import { Table, Button, Input, InputNumber, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { fetchTrainerUnitPrices } from '../../../api/AdminAPI/Unit_Prices_API';
import './TrainerUinitPricesPage.css';

function TrainerUinitPricePage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState([]);
  const [name, setName] = useState([]);

  const [newUnit, setNewUnit] = useState({ // Trạng thái cho đơn vị mới

    unitCode: '',
    lastModifiedBy: '',
    price: 0,
    note: '',
  });

  useEffect(() => {
    setLoading(true);
    const account = localStorage.getItem('trainerAccount')
    fetchTrainerUnitPrices(account)
      .then((data) => {
        if (data && data.data && Array.isArray(data.data.trainerUnitPrice)) {
          setTrainers(data.data.trainerUnitPrice);
          setEditedData(data.data.trainerUnitPrice);
          setName(data.data.trainerInfo.generalInfo.name)
          console.log(data.data.trainerInfo.generalInfo.id)
        } else {
          console.error('Dữ liệu trả về không đúng định dạng:', data);
          setTrainers([]);
          setEditedData([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy dữ liệu:', error);
        setTrainers([]);
        setEditedData([]);
        setLoading(false);
      });
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const dataToSave = editedData.map(item =>
      item.id === editedData.length ? { ...item, lastModifiedBy: newUnit.lastModifiedBy } : item
    );
    console.log('Dữ liệu đã lưu:', dataToSave);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditedData([...trainers]);
    setIsEditing(false);
  };

  const handleInputChange = (value, key, field) => {
    const newData = editedData.map((item) => {
      if (item.id === key) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setEditedData(newData);
  };

  const handleAddNewUnit = () => {
    const newId = editedData.length + 1;
    const newUnitData = {
      id: newId,
      unitCode: newUnit.unitCode,
      lastModifiedDate: new Date().toLocaleDateString(),
      lastModifiedBy: newUnit.lastModifiedBy || '', // Sử dụng giá trị từ state
      price: newUnit.price,
      note: newUnit.note,
    };

    setEditedData([...editedData, newUnitData]);
    setNewUnit({ unitCode: '', lastModifiedBy: '', price: 0, note: '' }); // Reset lại trạng thái đơn vị mới
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Unit Code',
      dataIndex: 'unitCode',
      key: 'unitCode',
      render: (text, record) =>
        isEditing ? (
          <Input
            value={text}
            onChange={(e) => handleInputChange(e.target.value, record.id, 'unitCode')}
          />
        ) : (
          text
        ),
    },
    {
      title: 'Last Modified Date',
      dataIndex: 'lastModifiedDate',
      key: 'lastModifiedDate',
    },
    {
      title: 'Last Modified By',
      dataIndex: 'lastModifiedBy',
      key: 'lastModifiedBy',
      render: (text, record) =>
        isEditing ? (
          <Input
            value={text}
            onChange={(e) => handleInputChange(e.target.value, record.id, 'lastModifiedBy')}
          />
        ) : (
          text
        ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) =>
        isEditing ? (
          <InputNumber
            value={text}
            onChange={(value) => handleInputChange(value, record.id, 'price')}
          />
        ) : (
          text.toLocaleString()
        ),
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      render: (text, record) =>
        isEditing ? (
          <Input
            value={text}
            onChange={(e) => handleInputChange(e.target.value, record.id, 'note')}
          />
        ) : (
          text
        ),
    },
    ...(isEditing
      ? [
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <Popconfirm
              title="Are you sure to delete?"
              onConfirm={() => {
                const newData = editedData.filter((item) => item.id !== record.id);
                setEditedData(newData);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button
                icon={<DeleteOutlined />}
                type="link"
                danger
              />
            </Popconfirm>
          ),
        },
      ]
      : []),
  ];

  return (
    <div className="trainer-unit">
      {loading ? (
        <div className="loading-container">
          <p>Loading Data...</p>
        </div>
      ) : (
        <>
          <h1>Trainer Profile - {name}</h1>
          <Table
            dataSource={editedData}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 5,
            }}
          />
          {isEditing && (
            <>
              <Button
                style={{ marginBottom: 16 }}
                type="dashed"
                onClick={handleAddNewUnit}
              >
                + Add new unit price
              </Button>
            </>
          )}
          <div className="button-container">
            {isEditing ? (
              <>
                <Button style={{ marginRight: 8 }} onClick={handleCancelClick}>
                  Cancel
                </Button>
                <Button type="primary" onClick={handleSaveClick}>
                  Save
                </Button>
              </>
            ) : (
              <Button
                style={{ marginLeft: 920, marginBottom: 16 }}
                type="primary"
                onClick={handleEditClick}
              >
                Edit and Create
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default TrainerUinitPricePage;
