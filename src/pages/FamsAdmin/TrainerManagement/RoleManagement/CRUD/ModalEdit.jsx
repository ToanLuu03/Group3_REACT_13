import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, notification } from 'antd';
import { updateJob } from '../../../../../api/FamsAdmin/Job'; // Import API function
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'; // Import icons

const ModalEdit = ({ visible, onClose, jobData, onEditSuccess }) => {
  const [loading, setLoading] = useState(false);

  // Handle form submit
  const handleFinish = async (values) => {
    setLoading(true);
    try {
      await updateJob(jobData.id, values); // Call API to update job
      notification.success({
        message: 'Update Successful',
        description: 'The job has been successfully updated.',
        duration: 3,
      });
      onEditSuccess(); // Trigger success callback
      onClose(); // Close the modal
    } catch (error) {
      notification.error({
        message: 'Update Failed',
        description: error.message || 'An error occurred',
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Optionally, handle any necessary setup when jobData changes
    if (jobData) {
      console.log('Job Data: ', jobData); // Debug
    }
  }, [jobData]);

  // Convert levels if they are in object format (array of objects) to array of names
  const formatLevels = jobData?.levels?.map(level => level.name) || [];

  return (
    <Modal
      visible={visible}
      title="Edit"
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form
        initialValues={{
          role: jobData?.role,
          note: jobData?.note,
          levels: formatLevels, // Set formatted levels as an array of names
        }}
        onFinish={handleFinish}
      >
        <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Please input role!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="note" label="Note">
          <Input.TextArea />
        </Form.Item>

        {/* Add levels as Form.List */}
        <Form.List
          name="levels"
          initialValue={formatLevels} // Default to empty levels if no levels provided
        >
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

        <div className="flex justify-end">
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Changes
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalEdit;
