import { Button, message, Form, Input, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getToken } from "../../utils/auth";
import LayoutComponent from "../../utils/layout";
import { jwtDecode as jwt_decode } from "jwt-decode";

export default function UsersNew() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [inventoryData, setInventoryData] = useState([]);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decodedToken = jwt_decode(token);
      setUserData(decodedToken);
      form.setFieldsValue({
        approvedId: decodedToken.username,
      });
    }
  }, []);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api-warehouse/inventory",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
        setInventoryData(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchLocationData();
  }, []);

  const onFinish = async (values) => {
    console.log("🚀 ~ onFinish ~ values:", values);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("type", values.type);
      formData.append(
        "approvedId",
        userData.role === "Manager" ? userData.userId : null
      );
      formData.append("inventoryId", values.inventoryId);
      formData.append("description", values.description ?? "");
      formData.append("good_stock", values.good_stock);
      if (values.documentation) {
        formData.append(
          "documentation",
          values.documentation.fileList[0]?.originFileObj
        );
      }
      const res = await fetch(
        "http://localhost:5000/api-warehouse/transaction",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
      messageApi.success("Transaction added successfuly");
      setLoading(false);
      navigate("/transactions");
    } catch (err) {
      messageApi.error(`Something went wrong: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <LayoutComponent>
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        {userData.role !== "Staff" && (
          <Form.Item label="Approved By" name="approvedId">
            <Input disabled />
          </Form.Item>
        )}

        <Form.Item
          label="Product Name"
          name="inventoryId"
          rules={[{ required: true, message: "Please select the product!" }]}
        >
          <Select
            showSearch
            placeholder="Select a location"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={inventoryData.map((location) => ({
              value: location._id,
              label: location.product_name,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[
            { required: true, message: "Please select the transaction type!" },
          ]}
        >
          <Select
            showSearch
            placeholder="Select the transactions type"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={[
              { value: "Inbound", label: "Inbound" },
              { value: "Outbound", label: "Outbound" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Documentation" name="documentation">
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Good Stock"
          name="good_stock"
          rules={[{ required: true, message: "Please input the good stock!" }]}
        >
          <Input type="number" placeholder="Please input the good stock" />
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
