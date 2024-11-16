import React, { useState, useEffect } from "react";
import { Table, Button, Input, InputNumber, Popconfirm, Spin, notification } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import {
  fetchTrainerUnitPrices,
  updateTrainerUnitPrices,
  addTrainerUnitPrice,
  deleteTrainerUnitPrices,
} from "../../../api/AdminAPI/Unit_Prices_API";
import { Link, useOutletContext } from "react-router-dom";

function TrainerUnitPricePage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState([]);
  const [newRowData, setNewRowData] = useState(null);
  const [name, setName] = useState("");
  const [trainerId, setTrainerId] = useState("");
  const { collapsed } = useOutletContext();
  const [role, setRole] = useState(''); // Default role can be 'admin', 'user', etc.

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const account = localStorage.getItem("trainerAccount");
    const role = localStorage.getItem("role");
    setRole(role)
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
      // Cập nhật dữ liệu
      await updateTrainerUnitPrices(dataToSave, token);

      // Nếu có dữ liệu mới, thêm nó
      if (newRowData) {
        const newUnitData = {
          unitCode: newRowData.unitCode,
          lastModifiedBy: "Default User",
          lastModifiedDate: new Date().toISOString(),
          trainerId: trainerId,
          price: newRowData.price,
          note: newRowData.note,
        };
        await addTrainerUnitPrice([newUnitData], token);
      }

      // Làm mới dữ liệu
      fetchData();
      setNewRowData(null);

      // Thông báo thành công
      notification.success({
        message: "Save Successful",
        description: "The data has been successfully saved.",
      });
    } catch (error) {
      console.error("Error while updating:", error);

      // Thông báo lỗi
      notification.error({
        message: "Save Failed",
        description: "An error occurred while saving the data. Please try again.",
      });
    } finally {
      setIsEditing(false); // Đảm bảo chế độ chỉnh sửa được tắt
    }
  };

  const handleCancelClick = () => {
    setEditedData([...trainers]);
    setIsEditing(false);
    setNewRowData(null);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await deleteTrainerUnitPrices([id], token);
      fetchData();
      // Thông báo thành công
      notification.success({
        message: "Delete Successful",
        description: "The trainer unit price has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error while deleting:", error);
      // Thông báo lỗi
      notification.error({
        message: "Delete Failed",
        description: "An error occurred while deleting. Please try again.",
      });
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
      title: 'No.',
      key: 'index',
      render: (_, __, index) => index + 1,
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
        <div>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Table
            dataSource={newRowData ? [...editedData, newRowData] : editedData}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 5,
            }}
            className="text-sm"
          />
          <div className="flex justify-end mt-2 space-x-2">
            {isEditing ? (
              <>
                <Button className="text-gray-500" onClick={handleCancelClick}>
                  Cancel
                </Button>
                <Button type="primary" onClick={handleSaveClick}>
                  Save
                </Button>
              </>
            ) : (
              <Button type="primary" onClick={handleEditClick}>
                Edit Trainer Unit Price
              </Button>
            )}
            {isEditing && (
              <Button className="ml-2" onClick={handleAddNewUnitClick}>
                + Add New Unit Price
              </Button>
            )}
          </div>
          <div
            className={`fixed bottom-0 left-0 ${collapsed ? "md:left-0" : "md:left-64"
              } right-0 bg-white p-4 flex flex-col md:flex-row justify-between border-t shadow-lg gap-2`}
          >
            <Button
              type="default"
              className="w-full md:w-auto text-sm md:text-base order-last md:order-first"
            >
              <Link to={`/${role}/trainer-list`}>Back to Trainers List</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default TrainerUnitPricePage;
