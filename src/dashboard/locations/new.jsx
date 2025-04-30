import { Button, message, Form, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getToken } from "../../utils/auth";
import LayoutComponent from "../../utils/layout";

export default function UsersNew() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api-warehouse/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: values.name,
          description: values.description,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
      messageApi.success("New User Success");
      setLoading(false);
      navigate("/locations");
    } catch (err) {
      messageApi.error(`Something went wrong: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <LayoutComponent>
      {contextHolder}
      <Form layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item
          label="Location"
          name="name"
          rules={[{ required: true, message: "Please input the Location!" }]}
        >
          <Input placeholder="Please input your Location" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input placeholder="Description ( optional )" />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </LayoutComponent>
  );
}
