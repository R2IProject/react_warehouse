import { Button, message, Form, Input, Select, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getToken } from "../../utils/auth";
import LayoutComponent from "../../utils/layout";

export default function UsersEdit() {
  const [locationData, setLocationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api-warehouse/locations",
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
        setLocationData(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchLocationData();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api-warehouse/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          locationId: values.locationId,
          product_name: values.product_name,
          quantity_good: values.quantity_good,
          description: values.description,
          expired_date: values.expired_date
            ? values.expired_date.format("YYYY-MM-DD")
            : null,
          status: values.status,
          unit: values.unit,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
      messageApi.success("Inventory added successfuly");
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
      <Form layout="vertical" onFinish={onFinish} autoComplete="off">
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
            options={locationData.map((location) => ({
              value: location._id,
              label: location.name,
            }))}
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
          <Input type="number" placeholder="Good Quantity" />
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
          <Input placeholder="Please input the unit" />
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
