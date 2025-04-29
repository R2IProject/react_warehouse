import React, { useState } from "react";
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
export default function LayoutComponent({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["2"]}
          className="space-y-7"
          items={[
            {
              key: "1",
              label: "Warehouse",
            },
            {
              key: "2",
              icon: <UserOutlined />,
              label: <a href="/users">Users</a>,
            },
            {
              key: "3",
              icon: <DatabaseOutlined />,
              label: <a href="/locations">Locations</a>,
            },
            {
              key: "4",
              icon: <HomeOutlined />,
              label: <a href="/inventory">Inventory</a>,
            },
            {
              key: "5",
              icon: <InboxOutlined />,
              label: <a href="/transactions">Transactions</a>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
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
