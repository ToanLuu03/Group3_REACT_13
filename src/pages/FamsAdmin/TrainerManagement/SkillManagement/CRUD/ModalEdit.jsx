import React, { useState, useEffect } from 'react';
import { Modal, Input, message, notification } from 'antd';
import { fetchSkillById, fetchSkillUpdateById } from '../../../../../api/FamsAdmin/Skill';
import { useNavigate } from 'react-router-dom';

const ModalEdit = ({ open, onCancel, skillId, onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [note, setNote] = useState('');
  const [initialValues, setInitialValues] = useState({ skillName: '', note: '' });

  useEffect(() => {
    const fetchSkillData = async () => {
      if (!skillId || !open) return;

      try {
        setLoading(true);
        const response = await fetchSkillById(skillId);
        console.log('Fetched skill data:', response);

        if (response.data) {
          const formData = {
            skillName: response.data.skillName,
            note: response.data.note || ''
          };
          setInitialValues(formData);
          setSkillName(formData.skillName);
          setNote(formData.note);
        }
      } catch (error) {
        console.error('Error fetching skill:', error);
        message.error('Unable to fetch skill information');
      } finally {
        setLoading(false);
      }
    };

    fetchSkillData();
  }, [skillId, open]);

  const handleSubmit = async () => {
    try {
      const trimmedSkillName = skillName.trim();
      const trimmedNote = note.trim();

      if (!trimmedSkillName) {
        message.error('Skill name cannot be empty');
        return;
      }

      const currentFormData = {
        skillName: trimmedSkillName,
        note: trimmedNote
      };

      setLoading(true);
      const updateData = {
        ...currentFormData,
        levels: [1]
      };

      const response = await fetchSkillUpdateById(skillId, updateData);

      if (response.success) {
        // message.success('Skill updated successfully');
        notification.success({
          message: 'Skill updated successfully',
          placement: 'topRight',
          duration: 3,
        });
        onSuccess?.();
      }

      onCancel();
    } catch (error) {
      // console.error('Error updating skill:', error);
      notification.error({
        message: 'Failed to updated skill',
        description: error.response.data.message,
        placement: 'topRight',
        duration: 3,
      });
      // console.log(error.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={<div>Edit Skill</div>}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      destroyOnClose
    >
      <div className="p-4">
        <div>
          <label>Skill Name</label>
          <Input
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            placeholder="Enter skill name"
          />
        </div>
        <div>
          <label>Note</label>
          <Input.TextArea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter note"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalEdit;