'use client'

import { useState } from 'react'
import { Button, Table, Tabs } from 'antd'
import type { TabsProps } from 'antd'

// Mock data
const MOCK_USERS = [
  { id: 1, name: 'John', age: 25, role: 'Developer' },
  { id: 2, name: 'Lisa', age: 30, role: 'Designer' },
  { id: 3, name: 'Mike', age: 28, role: 'Product Manager' },
]

const MOCK_PRODUCTS = [
  { id: 1, name: 'Laptop', price: 6999, stock: 100 },
  { id: 2, name: 'Phone', price: 3999, stock: 200 },
  { id: 3, name: 'Tablet', price: 2999, stock: 150 },
]

export default function TestPage() {
  const [selectedTab, setSelectedTab] = useState<string>('users')

  const userColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
  ]

  const productColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (price: number) => `$${price}` },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
  ]

  const items: TabsProps['items'] = [
    {
      key: 'users',
      label: 'User List',
      children: <Table columns={userColumns} dataSource={MOCK_USERS} pagination={false} />,
    },
    {
      key: 'products',
      label: 'Product List',
      children: <Table columns={productColumns} dataSource={MOCK_PRODUCTS} pagination={false} />,
    },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Data Display</h1>

      <div className="space-y-4">
        <Tabs
          activeKey={selectedTab}
          items={items}
          onChange={(key) => setSelectedTab(key)}
        />
      </div>
    </div>
  )
}
