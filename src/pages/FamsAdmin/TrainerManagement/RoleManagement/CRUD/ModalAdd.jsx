import React from 'react';
import { Modal, Form, Input, Button, notification } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { addRole } from '../../../../../api/FamsAdmin/Job';

function ModalAdd({ visible, onClose, onAddSuccess }) {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const levels = values.levels.map((level) => ({ name: level }));

        addRole(values.role, values.note, levels, false)
          .then((response) => {
            // console.log('Role added successfully:', response);
            form.resetFields();
            onClose();
            onAddSuccess();  // Trigger the refresh in the RoleManagement component
          })
          .catch((error) => {
            notification.error({
              message: error.response.data.message,
              // description: error.message || 'An error occurred',
              placement: 'topRight',
              duration: 3,
            });
          });
      })
      .catch((info) => {
        console.log('Validation Failed:', info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Add Role"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please enter the role' }]}
        >
          <Input placeholder="Enter role" />
        </Form.Item>

        <Form.List name="levels">
          {(fields, { add, remove }) => (
            <div className="flex flex-col space-y-4">
              {fields.map((field, index) => (
                <div key={field.key} className="flex items-center space-x-2">
                  <span className="w-6 text-center">{index + 1}.</span>
                  <Form.Item
                    {...field}
                    name={[field.name]}
                    rules={[{ required: true, message: 'Please enter the level name' }]}
                    className="flex-grow mb-0"
                  >
                    <Input placeholder="Enter level name" className="w-full py-1" />
                  </Form.Item>
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={() => remove(field.name)}
                    className="text-red-500 ml-2"
                  />
                </div>
              ))}
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
                className="flex items-center justify-center text-blue-500 border-blue-500"
              >
                Add Level
              </Button>
            </div>
          )}
        </Form.List>

        <Form.Item
          name="note"
          label="Note"
          rules={[{ required: true, message: 'Please enter a note' }]}
        >
          <Input.TextArea placeholder="Enter note" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ModalAdd;

