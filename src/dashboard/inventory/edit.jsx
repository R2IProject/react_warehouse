import { Button, message, Form, Input, Select, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken } from "../../utils/auth";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import LayoutComponent from "../../utils/layout";

export default function UsersEdit() {
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api-warehouse/inventory/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        const data = await res.json();
        setInventory(data);
        form.setFieldsValue({
          locationId: data.inventory?.location[0]._id,
          product_name: data.inventory?.product_name,
          quantity_good: data.inventory?.quantity_good,
          description: data.inventory?.description,
          expired_date: dayjs(data.inventory?.expired_date, "YYYY-MM-DD"),
          status: data.inventory?.status,
          unit: data.inventory?.unit,
        });
        if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
      } catch (err) {
        console.log(err);
      }
    };
    fetchInventoryData();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api-warehouse/inventory/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            locationId: values.locationId || inventory.location[0]._id,
            product_name: values.product_name,
            quantity_good: values.quantity_good,
            description: values.description,
            expired_date: dayjs(values.expired_date, "YYYY-MM-DD"),
            status: values.status,
            unit: values.unit,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
      messageApi.success("Edit Success");
      setLoading(false);
      navigate("/inventory");
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
          label="Location"
          name="locationId"
          rules={[{ required: true, message: "Please input the location!" }]}
        >
          <Select
            showSearch
            placeholder="Select a location"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={
              Array.isArray(inventory?.locations)
                ? inventory.locations.map((location) => ({
                    value: location._id,
                    label: location.name,
                  }))
                : []
            }
          />
        </Form.Item>

        <Form.Item
          label="Product Name"
          name="product_name"
          rules={[{ required: true, message: "Please input the product!" }]}
        >
          <Input placeholder="Please input the product" />
        </Form.Item>

        <Form.Item
          label="Good Quantity"
          name="quantity_good"
          rules={[{ required: true, message: "Please input the quantity!" }]}
        >
          <Input placeholder="Good Quantity" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input placeholder="Description ( optional )" />
        </Form.Item>

        <Form.Item label="Expired Date" name="expired_date">
          <DatePicker />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please input the location!" }]}
        >
          <Select
            showSearch
            placeholder="Select a status"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={[
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Unit"
          name="unit"
          rules={[{ required: true, message: "Please input the unit!" }]}
        >
          <Input type="number" placeholder="Please input the unit" />
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
