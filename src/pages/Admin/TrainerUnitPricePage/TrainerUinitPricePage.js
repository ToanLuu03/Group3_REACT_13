import React, { useState, useEffect } from "react";
import { Table, Button, Input, InputNumber, Popconfirm, Spin } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import {
  fetchTrainerUnitPrices,
  updateTrainerUnitPrices,
  addTrainerUnitPrice,
  deleteTrainerUnitPrices, // Import the delete function
} from "../../../api/AdminAPI/Unit_Prices_API";

function TrainerUnitPricePage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState([]);
  const [newRowData, setNewRowData] = useState(null); // State to manage new row data
  const [name, setName] = useState("");
  const [trainerId, setTrainerId] = useState("");

  const fetchData = async () => {
    const token = localStorage.getItem('token');

    const account = localStorage.getItem("trainerAccount");
    fetchTrainerUnitPrices(account, token)
      .then((data) => {
        if (data && data.data && Array.isArray(data.data.trainerUnitPrice)) {
          const trainerUnitPrices = data.data.trainerUnitPrice.map((item) => ({
            ...item,
            trainerId: data.data.trainerInfo.generalInfo.id,
          }));
          setTrainers(trainerUnitPrices);
          setEditedData(trainerUnitPrices);
          setName(data.data.trainerInfo.generalInfo.name);
          setTrainerId(data.data.trainerInfo.generalInfo.id);
        } else {
          console.error("Data format is incorrect:", data);
          setTrainers([]);
          setEditedData([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setTrainers([]);
        setEditedData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
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

  const handleNewRowChange = (value, field) => {
    setNewRowData({ ...newRowData, [field]: value });
  };

  const handleSaveClick = async () => {
    const dataToSave = editedData.map((item) => ({
      id: item.id,
      lastModifiedBy: item.lastModifiedBy || "Default User",
      lastModifiedDate: new Date().toISOString(),
      note: item.note || "",
      price: item.price,
      trainerId: item.trainerId,
      unitCode: item.unitCode,
    }));

    try {
      const token = localStorage.getItem("token");
      await updateTrainerUnitPrices(dataToSave, token);

      // Nếu có dữ liệu dòng mới, lưu vào cơ sở dữ liệu
      if (newRowData) {
        const newUnitData = {
          unitCode: newRowData.unitCode,
          lastModifiedBy: "Default User", // Để trống cho dòng mới
          lastModifiedDate: new Date().toISOString(), // Để trống cho dòng mới
          trainerId: trainerId,
          price: newRowData.price,
          note: newRowData.note,
        };
        await addTrainerUnitPrice([newUnitData], token); // Thêm dòng mới
      }

      fetchData();
      setNewRowData(null); // Xóa dòng mới sau khi lưu
    } catch (error) {
      console.error("Error while updating:", error);
    }
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditedData([...trainers]);
    setIsEditing(false);
    setNewRowData(null); // Xóa dòng mới nếu hủy
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await deleteTrainerUnitPrices([id], token);
      fetchData();
    } catch (error) {
      console.error("Error while deleting:", error);
    }
  };

  const handleAddNewUnitClick = () => {
    if (!newRowData) {
      setNewRowData({
        id: -1,
        unitCode: "",
        price: 0,
        note: "",
        lastModifiedBy: "",
        lastModifiedDate: "",
        trainerId: trainerId,
      });
    }
  };

  const columns = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Unit Code",
      dataIndex: "unitCode",
      key: "unitCode",
      width: "160px",
      render: (text, record) =>
        isEditing || record.id === -1 ? (
          <Input
            value={record.id === -1 ? newRowData?.unitCode : text}
            onChange={(e) =>
              record.id === -1
                ? handleNewRowChange(e.target.value, "unitCode")
                : handleInputChange(e.target.value, record.id, "unitCode")
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "Last Modified Date",
      dataIndex: "lastModifiedDate",
      key: "lastModifiedDate",
      render: (text, record) => (record.id === -1 ? "" : text),
    },
    {
      title: "Last Modified By",
      dataIndex: "lastModifiedBy",
      key: "lastModifiedBy",
      render: (text, record) => (record.id === -1 ? "" : text),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text, record) =>
        isEditing || record.id === -1 ? (
          <InputNumber
            value={record.id === -1 ? newRowData?.price : text}
            onChange={(value) =>
              record.id === -1
                ? handleNewRowChange(value, "price")
                : handleInputChange(value, record.id, "price")
            }
          />
        ) : (
          text.toLocaleString() + " VND"
        ),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (text, record) =>
        isEditing || record.id === -1 ? (
          <Input
            value={record.id === -1 ? newRowData?.note : text}
            onChange={(e) =>
              record.id === -1
                ? handleNewRowChange(e.target.value, "note")
                : handleInputChange(e.target.value, record.id, "note")
            }
          />
        ) : (
          text
        ),
    },

    ...(isEditing
      ? [
        {
          title: "Action",
          key: "action",
          render: (text, record) =>
            record.id !== -1 && (
              <Popconfirm
                title="Are you sure to delete?"
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button icon={<DeleteOutlined />} type="link" danger />
              </Popconfirm>
            ),
        },
      ]
      : []),
  ];

  return (
    <div className="px-2">
      {loading ? (
        <Spin size="large"></Spin>
      ) : (
        <>
          <h3 className="mb-4">Trainer Profile - {name}</h3>
          <div>
            <Table
              dataSource={newRowData ? [...editedData, newRowData] : editedData}
              columns={columns}
              rowKey="id"
              pagination={{
                pageSize: 5,
              }}
            />

            <div className="button-right flex justify-end mt-2">
              {isEditing ? (
                <>
                  <Button className="mr-2" onClick={handleCancelClick}>
                    Cancel
                  </Button>
                  <Button type="primary" onClick={handleSaveClick}>
                    Save
                  </Button>
                </>
              ) : (
                <Button type="primary" onClick={handleEditClick}>
                  Edit trainer Unit Price
                </Button>
              )}
              {isEditing && (
                <Button className="ml-2" onClick={handleAddNewUnitClick}>
                  + Add New Unit Price
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TrainerUnitPricePage;
