import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  InboxOutlined,
  UserOutlined,
  HomeOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
const { Header, Sider, Content } = Layout;
import { useNavigate, useLocation } from "react-router-dom";

export default function LayoutComponent({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("2");

  useEffect(() => {
    const savedKey = localStorage.getItem("selectedKey");
    if (savedKey) {
      setSelectedKey(savedKey);
    } else {
      setSelectedKey("2");
      localStorage.setItem("selectedKey", "2");
    }
  }, []);

  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith("/users")) {
      setSelectedKey("2");
      localStorage.setItem("selectedKey", "2");
    } else if (path.startsWith("/locations")) {
      setSelectedKey("3");
      localStorage.setItem("selectedKey", "3");
    } else if (path.startsWith("/inventory")) {
      setSelectedKey("4");
      localStorage.setItem("selectedKey", "4");
    } else if (path.startsWith("/transactions")) {
      setSelectedKey("5");
      localStorage.setItem("selectedKey", "5");
    }
  }, [location.pathname]);

  const handleClick = (e) => {
    const key = e.key;
    setSelectedKey(key);
    localStorage.setItem("selectedKey", key);

    const keyToPath = {
      2: "/users",
      3: "/locations",
      4: "/inventory",
      5: "/transactions",
    };

    if (keyToPath[key]) {
      navigate(keyToPath[key]);
    }
  };

  const logoutHandler = async () => {
    try {
      const res = await fetch("http://localhost:5000/api-warehouse/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
      navigate("/");
      setSelectedKey("2");
      localStorage.setItem("selectedKey", "2");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleClick}
          className="space-y-7"
          items={[
            {
              key: "1",
              label: "Warehouse",
            },
            {
              key: "2",
              icon: <UserOutlined />,
              label: "Users",
            },
            {
              key: "3",
              icon: <DatabaseOutlined />,
              label: "Locations",
            },
            {
              key: "4",
              icon: <HomeOutlined />,
              label: "Inventory",
            },
            {
              key: "5",
              icon: <InboxOutlined />,
              label: "Transactions",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className="flex justify-between">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <Button
              className="bg-red-500 text-white my-5 mr-5"
              onClick={logoutHandler}
            >
              Logout
            </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            overflowY: "auto",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
