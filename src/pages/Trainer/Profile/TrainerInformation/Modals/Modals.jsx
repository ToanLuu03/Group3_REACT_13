import React from "react";
import { Button } from "antd";

export const SaveModal = ({ showSaveModal, handleConfirmSave, setShowSaveModal }) => {
    return (
        <>
            {showSaveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white py-5 px-6 rounded-lg w-96 shadow-lg flex flex-col items-start">
                        <h2 className="text-xl font-semibold justify-self-start">Save changes</h2>
                        <p className="text-gray-700">Are you sure you want to save changes?</p>
                        <div className="flex justify-end gap-5 w-full mt-5">
                            <Button
                                key="back"
                                onClick={() => setShowSaveModal(false)}
                                className="rounded-full px-8 py-0"
                            >
                                No
                            </Button>
                            <Button
                                key="submit"
                                type="primary"
                                onClick={handleConfirmSave}
                                className="rounded-full px-8 py-0"
                            >
                                Yes
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export const CancelModal = ({ showCancelModal, handleConfirmCancel, setShowCancelModal }) => {
    return (
        <>
            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white py-5 px-6 rounded-lg w-96 shadow-lg flex flex-col items-start">
                        <h2 className="text-xl font-semibold">Cancel changes</h2>
                        <p className="text-gray-700">Are you sure you want to cancel changes?</p>
                        <div className="flex justify-end w-full mt-5 gap-5">
                            <Button
                                key="back"
                                onClick={() => setShowCancelModal(false)}
                                className="rounded-full px-8 py-0"
                            >
                                No
                            </Button>
                            <Button
                                key="submit"
                                type="primary"
                                onClick={handleConfirmCancel}
                                className="rounded-full px-8 py-0"
                            >
                                Yes
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export const DeleteModal = ({ showDeleteModal, handleConfirmDelete, setShowDeleteModal }) => {
    return (
        <>
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white py-5 px-6 rounded-lg w-96 shadow-lg flex flex-col items-start">
                        <h2 className="text-xl font-semibold">Delete Item</h2>
                        <p className="text-gray-700">Are you sure you want to delete this item?</p>
                        <div className="flex justify-end gap-5 w-full mt-5">
                            <Button
                                key="back"
                                onClick={() => setShowDeleteModal(false)}
                                className="rounded-full px-8 py-0"
                            >
                                No
                            </Button>
                            <Button
                                key="submit"
                                type="primary"
                                onClick={handleConfirmDelete}
                                className="rounded-full px-8 py-0 bg-red-500"
                            >
                                Yes, Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
