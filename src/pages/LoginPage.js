import React from "react";
import { Form, Input, Button, message } from "antd";
import {
    GoogleOutlined,
    FacebookOutlined,
    LockOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            // Xử lý đăng nhập bằng email/password
            // Kết nối với backend hoặc Firebase Authentication
            navigate("/dashboard");
        } catch (error) {
            message.error("Đăng nhập thất bại");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            navigate("/dashboard");
        } catch (error) {
            message.error("Đăng nhập Google thất bại");
        }
    };

    const handleFacebookLogin = async () => {
        try {
            navigate("/dashboard");
        } catch (error) {
            message.error("Đăng nhập Facebook thất bại");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center px-4">
            <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-md">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Đăng Nhập
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Chào mừng trở lại! Vui lòng đăng nhập.
                        </p>
                    </div>

                    <Form
                        name="login"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập tên đăng nhập!",
                                },
                            ]}
                        >
                            <Input
                                prefix={
                                    <UserOutlined className="text-gray-400" />
                                }
                                placeholder="Tên đăng nhập"
                                className="h-12 rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập mật khẩu!",
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={
                                    <LockOutlined className="text-gray-400" />
                                }
                                placeholder="Mật khẩu"
                                className="h-12 rounded-lg"
                            />
                        </Form.Item>

                        <div className="flex justify-between items-center mb-6">
                            <Link
                                to="/forgot-password"
                                className="text-blue-600 hover:text-blue-800 transition"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                className="h-12 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
                            >
                                Đăng Nhập
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                Hoặc tiếp tục với
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button
                            icon={<GoogleOutlined />}
                            block
                            className="h-12 rounded-lg flex items-center justify-center border border-red-500 text-red-500 hover:bg-red-50 transition"
                            onClick={handleGoogleLogin}
                        >
                            Đăng Nhập với Google
                        </Button>

                        <Button
                            icon={<FacebookOutlined />}
                            block
                            className="h-12 rounded-lg flex items-center justify-center border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
                            onClick={handleFacebookLogin}
                        >
                            Đăng Nhập với Facebook
                        </Button>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-gray-600">
                            Chưa có tài khoản?{" "}
                            <Link
                                to="/register"
                                className="text-blue-600 hover:text-blue-800 font-semibold transition"
                            >
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
