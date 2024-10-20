import React, { useState } from 'react';
import { Form, Button, Select, Input, Alert, Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { setRole } from '../../features/role/roleSlice';
import { useNavigate } from 'react-router-dom';
import './RolePage.css';
import logo from '../../assets/FSA-logo.png';
import { PATH_NAME } from '../../constants/pathName';
import { login } from '../../api/Login/Login';
const { Option } = Select;

const RolePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');

    const onFinish = async (values) => {
        setLoading(true);
        setErrorMessage('');

        try {
            const role = await login(values.username, values.password);
            console.log('Role API: ', role);

            if (role === 'CLASS_ADMIN' || role === 'TRAINER') {
                dispatch(setRole(role));
                navigate(role === 'CLASS_ADMIN' ? PATH_NAME.ADMIN : PATH_NAME.TRAINER);
            } else {
                // If the role is neither CLASS_ADMIN nor TRAINER, show the modal
                setIsModalVisible(true);
            }
        } catch (error) {
            setErrorMessage('Username or Password is wrong!');
        } finally {
            setLoading(false);
        }
    };

    const handleOk = () => {
        if (selectedRole) {
            dispatch(setRole(selectedRole));
            navigate(selectedRole === 'CLASS_ADMIN' ? PATH_NAME.ADMIN : PATH_NAME.TRAINER);
            setIsModalVisible(false);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div className="sign-in-container">
            <img src={logo} alt="FPT Software Academy" className="logo" />
            <h2 className="title">Sign in</h2>
            {errorMessage && <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: '20px' }} />}

            <Form onFinish={onFinish} className="sign-in-form">
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please enter your username!' }]}
                >
                    <Input placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password!' }]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="submit-button" loading={loading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>

            <Modal
                title="Select Role"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okButtonProps={{ disabled: !selectedRole }}
            >
                <p>Please select your role:</p>
                <Select
                    placeholder="Select a role"
                    style={{ width: '100%' }}
                    onChange={(value) => setSelectedRole(value)}
                >
                    <Option value="CLASS_ADMIN">CLASS_ADMIN</Option>
                    <Option value="TRAINER">TRAINER</Option>
                </Select>
            </Modal>
        </div>
    );
};

export default RolePage;
