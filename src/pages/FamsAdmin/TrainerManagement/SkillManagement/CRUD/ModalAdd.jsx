import React from 'react';
import { Modal, Form, Input } from 'antd';

function ModalAdd({ open, onCancel, onSubmit }) {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title="Add Skill"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Save"
      cancelText="Cancel"
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="skill"
          label="Skill"
          rules={[{ required: true, message: 'Please input the skill name!' }]}
        >
          <Input placeholder="Enter skill name" />
        </Form.Item>

        <Form.Item
          name="note"
          label="Note"
        >
          <Input.TextArea 
            rows={4} 
            placeholder="Enter note"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ModalAdd;