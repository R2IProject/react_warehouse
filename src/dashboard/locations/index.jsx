import React, { useEffect, useRef, useState } from "react";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import { getToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import LayoutComponent from "../../utils/layout";
import Highlighter from "react-highlight-words";

export default function Users() {
  const [userData, setUserData] = useState([]);
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const fetchUserData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api-warehouse/locations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
      setUserData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [reload]);

  const handleEdit = (record) => {
    navigate(`/locations/${record._id}`);
  };
  const handleAdd = () => {
    navigate("/locations/new");
  };
  const handleDelete = async (record) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api-warehouse/locations/${record._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete user");
      setReload((prev) => !prev);
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => {
            var _a;
            return (_a = searchInput.current) === null || _a === void 0
              ? void 0
              : _a.select();
          }, 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    Object.assign(
      { title: "Location", dataIndex: "name", key: "name", width: "30%" },
      getColumnSearchProps("name")
    ),
    Object.assign(
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: "33%",
      },
      getColumnSearchProps("description"),
      {
        sorter: (a, b) => a.email.length - b.email.length,
        sortDirections: ["descend", "ascend"],
      }
    ),
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(record)}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            <EditOutlined />
          </button>
          <button
            onClick={() => handleDelete(record)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <LayoutComponent>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Locations</h1>
        <Button onClick={handleAdd} className="bg-green-500 text-white">
          Add Location
        </Button>
      </div>
      <Table columns={columns} dataSource={userData} />
    </LayoutComponent>
  );
}
