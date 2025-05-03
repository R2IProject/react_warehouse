import { Button, Select, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api-warehouse/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          role: values.role,
          password: values.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
      messageApi.success("Register Success");
      setLoading(false);
      navigate("/");
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
          Hello Please Register Your Account 😊
        </p>
        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please input your role!" }]}
          >
            <Select
              showSearch
              placeholder="Select a role"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                { value: "Manager", label: "Manager" },
                { value: "Staff", label: "Staff" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <p>
            Already have an account ?{" "}
            <a
              href="/"
              className="text-blue-600 underline italic hover:cursor-pointer"
            >
              Login Now !
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
