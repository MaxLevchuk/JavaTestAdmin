import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { Link } from 'react-router-dom';

const RegistrationPage = () => {
    const [loading, setLoading] = useState(false); 

    const onFinish = async (values) => {
        setLoading(true); 
        try {
        
            const response = await http_common.post('/api/account/register', values);
            console.log('Registration successful', response.data);
           
        } catch (error) {
            console.error('Registration failed', error);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div>
            <h1>Registration</h1>
            <Form
                name="registration_form"
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please enter your email!' },
                        { type: 'email', message: 'Please enter a valid email address!' },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[{ required: true, message: 'Please enter your first name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[{ required: true, message: 'Please enter your last name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: 'Please enter your phone number!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Register
                    </Button>
                    Or <Link to="/login">login now!</Link>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RegistrationPage;
