import React, { useState } from "react";
import { Button, Input, DatePicker, notification } from "antd";
import {
    DownloadOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { DeleteModal } from "../Modals/Modals";
import { FaLink, FaTrashCan } from "react-icons/fa6";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
};

const Certificates = ({ certificates, isEditing, setCertificates, onDeleteCertificates }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [certificateToDelete, setCertificateToDelete] = useState(null);

    const handleRemoveCertificate = (index) => {
        setCertificateToDelete(index);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        const updatedCertificates = [...certificates];
        const certToDelete = updatedCertificates[certificateToDelete];

        if (certToDelete.id) {
            onDeleteCertificates((prev) => [...prev, certToDelete.id]);
        }

        updatedCertificates.splice(certificateToDelete, 1);
        setCertificates(updatedCertificates);
        setShowDeleteModal(false);
    };

    const handleAddNewCertificate = () => {
        const newCertificate = { name: "", url: "", date: "" };

        const isDuplicate = certificates.some(
            (cert) =>
                cert.name.toLowerCase() === newCertificate.name.toLowerCase() &&
                cert.url === newCertificate.url
        );

        if (isDuplicate) {
            notification.error({
                message: "Duplicate Certificate",
                description: "The certificate with this name and URL already exists.",
                duration: 3,
            });
        } else {
            setCertificates([...certificates, newCertificate]);
        }
    };

    const handleEditCertificate = (index, field, value) => {
        const updatedCertificates = [...certificates];
        updatedCertificates[index][field] = value;

        const isDuplicate = updatedCertificates.some(
            (cert, idx) =>
                idx !== index &&
                cert.name.toLowerCase() === updatedCertificates[index].name.toLowerCase() &&
                cert.url === updatedCertificates[index].url
        );

        if (isDuplicate) {
            notification.error({
                message: "Duplicate Certificate",
                description: "This certificate with the same name and URL already exists.",
                duration: 3,
            });
        } else {
            setCertificates(updatedCertificates);
        }
    };

    return (
        <div className="p-4">
            <h2 className="font-medium uppercase text-lg text-center rounded-full border py-2 bg-gray-300 mb-4">
                Certificates
            </h2>
            {certificates.map((cert, index) => (
                <div key={index} className="flex items-center justify-between mb-4">
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="flex items-center">
                            <div className="flex items-center gap-5 flex-1">
                                <span className={`w-4 ${isEditing ? "w-[18px]" : ""} h-4 bg-black rounded-full`}></span>
                                {isEditing ? (
                                    <Input
                                        placeholder="Certification Name"
                                        value={cert.name}
                                        onChange={(e) =>
                                            handleEditCertificate(index, "name", e.target.value)
                                        }
                                        className="w-full max-sm:max-w-auto"
                                    />
                                ) : (
                                    <div className="text-black font-semibold">{cert.name}</div>
                                )}
                            </div>
                            {isEditing ? (
                                <DatePicker
                                    style={{ width: 120 }}
                                    placeholder="Select Date"
                                    value={cert.date ? moment(cert.date, "YYYY-MM-DD") : null}
                                    onChange={(date, dateString) =>
                                        handleEditCertificate(index, "date", dateString)
                                    }
                                    className="ml-2 mt-[10px]"
                                />
                            ) : (
                                <div className="ml-auto">{formatDate(cert.date)}</div>
                            )}
                        </div>
                        <div className="flex items-center gap-5">
                            <FaLink className="w-5 h-5" />
                            {isEditing ? (
                                <Input
                                    placeholder="Certification URL"
                                    value={cert.url}
                                    onChange={(e) =>
                                        handleEditCertificate(index, "url", e.target.value)
                                    }
                                    className="w-full"
                                />
                            ) : (
                                <a
                                    href={cert.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline flex-grow w-full overflow-hidden whitespace-normal break-words sm:w-4 max-sm:w-5"
                                >
                                    {cert.url}
                                </a>
                            )}
                            {!isEditing && (
                                <a
                                    href={cert.url}
                                    className="text-gray-500 hover:text-black cursor-pointer"
                                >
                                    <DownloadOutlined className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isEditing && (
                            <Button
                                type="danger"
                                className="text-red-500 font-medium"
                                onClick={() => handleRemoveCertificate(index)}
                            >
                                <FaTrashCan />
                            </Button>
                        )}
                    </div>
                </div>
            ))}
            {isEditing && (
                <Button
                    type="dashed"
                    onClick={handleAddNewCertificate}
                    className="w-[92%] mt-4 justify-self-center flex items-center"
                >
                    <PlusOutlined /> Add New Certification
                </Button>
            )}
            <DeleteModal
                showDeleteModal={showDeleteModal}
                handleConfirmDelete={handleConfirmDelete}
                setShowDeleteModal={setShowDeleteModal}
            />
        </div>
    );
};

export default Certificates;
