import React, { useEffect, useState } from "react";
import {
  Input,
  Card,
  Dropdown,
  Row,
  Col,
  Pagination,
  Button,
  Modal,
  Form,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  MoreOutlined,
  StarFilled,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

// const githubName = "Gijela"; // 当前登录用户
const clientUserId = "Gijela-123456";

interface KnowledgeBase {
  id: number;
  user_id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

function KnowledgeBase() {
  const [form] = Form.useForm(); // 声明form变量保存表单值
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(false);

  // 添加搜索状态
  const [searchText, setSearchText] = React.useState("");

  // 过滤会员列表
  const filteredKnowledgeBases = knowledgeBases.filter((kb) =>
    kb.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddKB = async () => {
    setLoading(true);
    const { title, description } = await form.validateFields();

    const result = await fetch("/api/supabase/rag/knowledge_bases/insertKB", {
      method: "POST",
      body: JSON.stringify({
        user_id: clientUserId,
        title,
        description,
      }),
    });

    if (result.ok) {
      message.success("Knowledge base created successfully");
      setIsModalOpen(false);
      message.loading("Fetching knowledge bases...");
      fetchKnowledgeBases();
    } else {
      message.error("Failed to create knowledge base");
    }
    setLoading(false);
  };

  const fetchKnowledgeBases = async () => {
    const result = await fetch("/api/supabase/rag/knowledge_bases/getTotalKB", {
      method: "POST",
      body: JSON.stringify({ user_id: clientUserId }),
    });
    if (!result.ok) {
      message.error("Failed to fetch knowledge bases");
      return;
    }

    const { data } = await result.json();
    setKnowledgeBases(data);
  };

  const handleDeleteKB = async (kb_id: number) => {
    console.log("🚀 ~ handleDeleteKB ~ kb_id:", kb_id);

    const result = await fetch("/api/supabase/rag/knowledge_bases/deleteKB", {
      method: "POST",
      body: JSON.stringify({ id: kb_id, user_id: clientUserId }),
    });
    if (result.ok) {
      message.success("deleted successfully");
      fetchKnowledgeBases();
    } else {
      console.error("Failed to delete", result.statusText);
      message.error("Failed to delete");
    }
  };

  useEffect(() => {
    fetchKnowledgeBases();
  }, []);

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto p-5">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold m-0">Acme Inc.</h1>
            <div className="flex gap-3">
              <Input
                placeholder="搜索成员..."
                prefix={<SearchOutlined />}
                className="w-[300px] h-10"
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
              />
              <button
                onClick={() => setIsModalOpen(true)}
                className="h-10 px-4 flex items-center gap-2 bg-[rgba(99,0,255,0.87)] hover:bg-[rgba(99,0,255,1)] text-white rounded-lg transition-colors duration-200"
              >
                <PlusOutlined />
                <span>添加成员</span>
              </button>
            </div>
          </div>

          <Row gutter={[24, 24]}>
            {filteredKnowledgeBases.map((kb) => (
              <Col xs={24} md={12} lg={8} key={kb.id}>
                <Card
                  className="shadow-sm rounded-2xl hover:shadow-xl transition-shadow duration-300"
                  bodyStyle={{ padding: 0 }}
                >
                  <div>
                    <div className="h-[164px] p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-[52px] h-[52px] bg-[rgb(245,248,255)] rounded-full flex items-center justify-center">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3 5C3 3.89543 3.89543 3 5 3H9.58579C9.851 3 10.1054 3.10536 10.2929 3.29289L12 5H19C20.1046 5 21 5.89543 21 7V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z"
                                stroke="rgba(99, 0, 255, 0.87)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M8 12H16M8 16H13"
                                stroke="rgba(99, 0, 255, 0.87)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold m-0">
                            {kb.title}
                          </h3>
                        </div>
                        <Dropdown
                          menu={{
                            items: [
                              {
                                key: "1",
                                label: "Delete KB",
                              },
                            ],
                          }}
                          placement="bottomRight"
                        >
                          <Button
                            onClick={() => handleDeleteKB(kb.id)}
                            type="text"
                            icon={
                              <MoreOutlined
                                style={{
                                  fontSize: 24,
                                  transform: "rotate(90deg)",
                                }}
                              />
                            }
                          />
                        </Dropdown>
                      </div>

                      <p className="text-gray-600 text-sm line-clamp-2 mt-5">
                        {kb.description}
                      </p>
                    </div>

                    <div className="h-[55px] grid grid-cols-2 divide-x divide-gray-200 border-t border-gray-200">
                      <button className="text-[rgb(132,112,255)] hover:text-[#8470FF] py-3 transition-colors duration-200 flex items-center justify-center font-medium">
                        <svg
                          className="w-4 h-4 mr-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Chat KB
                      </button>
                      <button className="text-[#4B5563] hover:text-[#8470FF] py-3 transition-colors duration-200 flex items-center justify-center font-medium">
                        <svg
                          className="w-4 h-4 mr-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                        </svg>
                        Edit KB
                      </button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
      <Modal
        title="New A Knowledge Base"
        open={isModalOpen}
        onOk={handleAddKB}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <button
            key="submit"
            onClick={handleAddKB}
            className="bg-[rgba(99,0,255,0.87)] hover:bg-[rgba(99,0,255,0.7)] text-white px-8 py-1.5 rounded-lg transition-colors duration-200"
            disabled={loading}
          >
            {loading ? "Loading..." : "New"}
          </button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter the title" }]}
          >
            <Input
              placeholder="Please enter the title"
              className="focus:border-[rgba(99,0,255,0.87)] hover:border-[rgba(99,0,255,0.87)]"
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter the description" },
            ]}
          >
            <Input.TextArea
              placeholder="Please enter the description"
              rows={4}
              className="focus:border-[rgba(99,0,255,0.87)] hover:border-[rgba(99,0,255,0.87)]"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default KnowledgeBase;
