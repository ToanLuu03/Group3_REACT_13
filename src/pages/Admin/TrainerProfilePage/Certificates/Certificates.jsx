import React from "react";
import { Button, Input, DatePicker, notification } from "antd";
import {
    DeleteOutlined,
    LinkOutlined,
    DownloadOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import moment from "moment";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
};

const Certificates = ({ certificates, isEditing, setCertificates }) => {
    const handleRemoveCertificate = (index) => {
        const updatedCertificates = [...certificates];
        updatedCertificates.splice(index, 1);
        setCertificates(updatedCertificates);
    };

    const handleAddNewCertificate = () => {
        setCertificates([...certificates, { name: "", url: "", date: "" }]);
    };

    const handleEditCertificate = (index, field, value) => {
        const updatedCertificates = [...certificates];
        updatedCertificates[index][field] = value;
        setCertificates(updatedCertificates);
    };

    const handleDownload = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const urlBlob = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = urlBlob;
            a.download = "certificate";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(urlBlob);
        } catch (error) {
            notification.error({
                message: "Error Download Failed",
                description: "Could not download the certificate. Please try again.",
                duration: 3,
            });
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
                                <div className="w-4 h-4 bg-black rounded-full"></div>
                                {isEditing ? (
                                    <Input
                                        placeholder="Certification Name"
                                        value={cert.name}
                                        onChange={(e) =>
                                            handleEditCertificate(index, "name", e.target.value)
                                        }
                                        className="w-full max-md:w-40"
                                    />
                                ) : (
                                    <div className="text-black font-semibold">{cert.name}</div>
                                )}
                            </div>
                            {isEditing ? (
                                <DatePicker
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
                            <LinkOutlined className="w-5 h-5" />
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
                                <p
                                    onClick={() => handleDownload(cert.url)}
                                    className="text-gray-500 hover:text-black cursor-pointer"
                                >
                                    <DownloadOutlined className="w-5 h-5" />
                                </p>
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
                                <DeleteOutlined />
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
        </div>
    );
};

export default Certificates;
