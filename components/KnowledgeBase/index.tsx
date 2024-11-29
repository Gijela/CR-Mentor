import React, { useEffect, useState } from "react";
import {
  Input,
  Card,
  Dropdown,
  Row,
  Col,
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
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

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

// 添加文档区块的接口定义
interface DocumentChunk {
  id: number;
  title: string;
  content: string;
  source: string;
  updated_at: string;
  char_count: number;
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

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditingKB, setCurrentEditingKB] =
    useState<KnowledgeBase | null>(null);

  const [documentChunks, setDocumentChunks] = useState<DocumentChunk[]>([]);

  // 添加新的 state 来控制文档内容弹窗
  const [isChunkModalOpen, setIsChunkModalOpen] = useState(false);
  const [selectedChunk, setSelectedChunk] = useState<DocumentChunk | null>(
    null
  );
  const [editingContent, setEditingContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 添加上传状态
  const [isUploading, setIsUploading] = useState(false);

  // 示例数据，实际应该通过 API 获取
  useEffect(() => {
    if (isEditMode && currentEditingKB) {
      // TODO: 替换为实际的 API 调用
      const mockChunks = [
        {
          id: 1,
          title: "介绍部分",
          content: "这是文档的介绍部分...",
          source: "intro.md",
          updated_at: "2024-01-15T10:30:00Z",
          char_count: 1250,
        },
        {
          id: 2,
          title: "产品功能",
          content: "详细介绍产品的主要功能特性...",
          source: "features.md",
          updated_at: "2024-01-14T15:20:00Z",
          char_count: 2300,
        },
        {
          id: 3,
          title: "技术架构",
          content: "系统的技术架构设计说明...",
          source: "architecture.md",
          updated_at: "2024-01-13T09:45:00Z",
          char_count: 3100,
        },
        {
          id: 4,
          title: "使用教程",
          content: "详细的产品使用说明和教程...",
          source: "tutorial.md",
          updated_at: "2024-01-12T16:30:00Z",
          char_count: 4200,
        },
        {
          id: 5,
          title: "常见问题",
          content: "用户常见问题解答和故障排除指南...",
          source: "faq.md",
          updated_at: "2024-01-11T11:15:00Z",
          char_count: 1800,
        },
      ];
      setDocumentChunks(mockChunks);
    }
  }, [isEditMode, currentEditingKB]);

  // 添加处理编辑模式的函数
  const handleEditKB = (kb: KnowledgeBase) => {
    setCurrentEditingKB(kb);
    setIsEditMode(true);
  };

  // 添加返回知识库列表的函数
  const handleBackToList = () => {
    setIsEditMode(false);
    setCurrentEditingKB(null);
  };

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

  // 添加处理文档区块点击的函数
  const handleChunkClick = (chunk: DocumentChunk) => {
    setSelectedChunk(chunk);
    setEditingContent(chunk.content);
    setIsChunkModalOpen(true);
  };

  const handleSaveContent = async () => {
    if (!selectedChunk) return;

    setIsSaving(true);
    try {
      // TODO: 替换为实际的 API 调用
      // const result = await fetch('/api/updateChunk', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     id: selectedChunk.id,
      //     content: editingContent
      //   })
      // });

      // if (result.ok) {
      //   message.success('内容已更新');
      //   // 更新本地数据
      //   setDocumentChunks(prevChunks =>
      //     prevChunks.map(chunk =>
      //       chunk.id === selectedChunk.id
      //         ? { ...chunk, content: editingContent }
      //         : chunk
      //     )
      //   );
      // }

      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 500));
      message.success("内容已更新");
      setDocumentChunks((prevChunks) =>
        prevChunks.map((chunk) =>
          chunk.id === selectedChunk.id
            ? { ...chunk, content: editingContent }
            : chunk
        )
      );
      setIsChunkModalOpen(false);
    } catch (error) {
      message.error("更新失败");
    } finally {
      setIsSaving(false);
    }
  };

  // 添加处理删除区块的函数
  const handleDeleteChunk = async (e: React.MouseEvent, chunkId: number) => {
    e.stopPropagation(); // 阻止事件冒泡到卡片点击事件

    try {
      // TODO: 替换为实际的 API 调用
      // const result = await fetch('/api/deleteChunk', {
      //   method: 'POST',
      //   body: JSON.stringify({ id: chunkId })
      // });

      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 更新本地状态
      setDocumentChunks((prevChunks) =>
        prevChunks.filter((chunk) => chunk.id !== chunkId)
      );
      message.success("区块已删除");
    } catch (error) {
      message.error("删除失败");
    }
  };

  // 修改文件上传处理函数
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.name.toLowerCase().endsWith(".md")) {
      message.error("只支持上传 Markdown (.md) 格式的文件");
      return;
    }

    setIsUploading(true);
    try {
      // 读取文件内容
      const content = await file.text();

      // TODO: 替换为实际的 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 添加新的文档区块到列表最前面
      const newChunk: DocumentChunk = {
        id: Date.now(),
        title: file.name.replace(".md", ""),
        content: content,
        source: file.name,
        updated_at: new Date().toISOString(),
        char_count: content.length,
      };

      setDocumentChunks((prev) => [newChunk, ...prev]);
      message.success("文件上传成功");

      // 清空 input 的值，允许重复上传相同文件
      e.target.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      message.error("文件上传失败");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto p-5">
          {isEditMode ? (
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleBackToList}
                      className="flex items-center text-gray-600 hover:text-[rgba(99,0,255,0.87)]"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      <span className="ml-2">返回</span>
                    </button>
                    <h1 className="text-2xl font-bold m-0">
                      编辑: {currentEditingKB?.title}
                    </h1>
                  </div>
                </div>

                <label
                  className={`w-full h-12 flex items-center justify-center gap-2 border border-dashed rounded-lg
                    border-[rgba(99,0,255,0.87)] text-[rgba(99,0,255,0.87)]
                    hover:border-[rgba(99,0,255,0.87)] hover:text-[rgba(99,0,255,0.87)]
                    transition-colors duration-200 cursor-pointer
                    ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="file"
                    accept=".md"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>正在上传...</span>
                    </div>
                  ) : (
                    <>
                      <svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="plus"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                      >
                        <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"></path>
                        <path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z"></path>
                      </svg>
                      <span>上传文件（仅支持 Markdown）</span>
                    </>
                  )}
                </label>
              </div>

              <div className="overflow-y-auto pr-2">
                <div className="grid grid-cols-1 gap-4">
                  {documentChunks.map((chunk) => (
                    <Card
                      key={chunk.id}
                      className="shadow-sm transition-all duration-200 hover:shadow-md hover:border-[rgba(99,0,255,0.87)] cursor-pointer"
                      onClick={() => handleChunkClick(chunk)}
                    >
                      <div className="flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-medium">{chunk.title}</h3>
                          <div className="flex gap-2">
                            <Button
                              type="text"
                              icon={<EditOutlined />}
                              className="text-gray-500 hover:text-[rgba(99,0,255,0.87)]"
                            />
                            <Button
                              type="text"
                              icon={<DeleteOutlined />}
                              className="text-gray-500 hover:text-red-500"
                              onClick={(e) => handleDeleteChunk(e, chunk.id)}
                            />
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {chunk.content}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              <span className="truncate">{chunk.source}</span>
                            </div>
                            <div className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                                />
                              </svg>
                              <span>{chunk.char_count} 字符</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>
                              {new Date(chunk.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold m-0">Knowledge Base</h1>
                <div className="flex gap-3">
                  <Input
                    placeholder="search KB..."
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
                    <span>New KB</span>
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
                          <button
                            onClick={() => handleEditKB(kb)}
                            className="text-[#4B5563] hover:text-[#8470FF] py-3 transition-colors duration-200 flex items-center justify-center font-medium"
                          >
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
            </>
          )}
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

      <Modal
        title="编辑内容"
        open={isChunkModalOpen}
        onCancel={() => setIsChunkModalOpen(false)}
        footer={[
          <div className="flex items-center justify-end gap-4">
            <div className="text-gray-500">字符数: {editingContent.length}</div>
            <button
              key="save"
              onClick={handleSaveContent}
              disabled={isSaving}
              className="bg-[rgba(99,0,255,0.87)] hover:bg-[rgba(99,0,255,0.7)] text-white px-8 py-1.5 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "更新中..." : "更新"}
            </button>
          </div>,
        ]}
        width={800}
      >
        <div>
          <Input.TextArea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            autoSize={{ minRows: 10, maxRows: 20 }}
            className="mt-4 focus:border-[rgba(99,0,255,0.87)] hover:border-[rgba(99,0,255,0.87)]"
          />
        </div>
      </Modal>
    </>
  );
}

export default KnowledgeBase;
