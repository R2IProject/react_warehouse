import { Button, message, Form, Input, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken } from "../../utils/auth";
import { useParams } from "react-router-dom";
import LayoutComponent from "../../utils/layout";

export default function UsersEdit() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [inventories, setInventories] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [invRes, txRes] = await Promise.all([
          fetch("http://localhost:5000/api-warehouse/inventory", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          }),
          fetch(`http://localhost:5000/api-warehouse/transaction/${id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          }),
        ]);

        const [invData, txData] = await Promise.all([
          invRes.json(),
          txRes.json(),
        ]);

        if (!invRes.ok) throw new Error(invData.message || "Inventory error");
        if (!txRes.ok) throw new Error(txData.message || "Transaction error");

        setInventories(invData);

        const matchedInventory = invData.find(
          (inv) => inv.product_name === txData.product_name
        );

        form.setFieldsValue({
          type: txData.type,
          approvedId: txData.approval_name,
          description: txData.description,
          inventoryId: matchedInventory?._id || null,
          good_stock: txData.good_stock,
        });
      } catch (err) {
        console.log(err);
      }
    };

    loadData();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("type", values.type);
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
        `http://localhost:5000/api-warehouse/transaction/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
      messageApi.success("Edit Success");
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
        <Form.Item
          label="Approved By"
          name="approvedId"
          rules={[{ required: true, message: "Please input the approval!" }]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Product Name"
          name="inventoryId"
          rules={[{ required: true, message: "Please select the product!" }]}
        >
          <Select
            showSearch
            placeholder="Select a product"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={inventories.map((location) => ({
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
            placeholder="Please select the transaction type"
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
