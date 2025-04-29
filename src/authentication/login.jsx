import { Button, message, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api-warehouse/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
      messageApi.success("Login Success");
      setLoading(false);
      navigate("/users");
    } catch (err) {
      messageApi.error(`Something went wrong: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex justify-center items-center bg-gray-100">
      {contextHolder}
      <div className="w-[500px] p-8 rounded-lg border bg-white shadow-lg">
        <p className="text-center text-2xl font-semibold mb-6">
          Welcome backk!! 😊
        </p>
        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <p>
            Dont have an account ?{" "}
            <a
              href="/register"
              className="text-blue-600 underline italic hover:cursor-pointer"
            >
              Create Now !
            </a>
          </p>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </main>
  );
}
