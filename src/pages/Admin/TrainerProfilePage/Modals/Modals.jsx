import React from "react";
import { Modal, Button } from "antd";

export const SaveModal = ({ showSaveModal, handleConfirmSave, setShowSaveModal }) => (
    <Modal
        title="Save changes"
        open={showSaveModal}
        onOk={handleConfirmSave}
        onCancel={() => setShowSaveModal(false)}
        centered
        footer={[
            <Button key="back" onClick={() => setShowSaveModal(false)} className="rounded-full px-8">
                No
            </Button>,
            <Button key="submit" type="primary" onClick={handleConfirmSave} className="rounded-full px-8">
                Yes
            </Button>,
        ]}
    >
        <p>Are you sure you want to save changes?</p>
    </Modal>
);

export const CancelModal = ({ showCancelModal, handleConfirmCancel, setShowCancelModal }) => (
    <Modal
        title="Cancel changes"
        open={showCancelModal}
        onOk={handleConfirmCancel}
        onCancel={() => setShowCancelModal(false)}
        centered
        footer={[
            <Button key="back" onClick={() => setShowCancelModal(false)} className="rounded-full px-8">
                No
            </Button>,
            <Button key="submit" type="primary" onClick={handleConfirmCancel} className="rounded-full px-8">
                Yes
            </Button>,
        ]}
    >
        <p>Are you sure you want to cancel changes?</p>
    </Modal>
);
