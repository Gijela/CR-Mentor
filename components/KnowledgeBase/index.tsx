import React, { FC, useEffect, useState } from "react";
import { Row, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import KbCard from "./KbCard";
import EmptyKb from "./EmptyKb";
import EditChunks from "./EditChunks";
import NewKBModal from "./NewKBModal";

// const githubName = "Gijela"; // 当前登录用户
export const clientUserId = "Gijela-123456";

export interface KnowledgeBase {
  id: number;
  user_id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// 获取知识库列表
export const getKnowledgeBases = async (user_id: string) => {
  const result = await fetch("/api/supabase/rag/knowledge_bases/getTotalKB", {
    method: "POST",
    body: JSON.stringify({ user_id }),
  });
  if (!result.ok) {
    message.error("Failed to fetch knowledge bases");
    return;
  }

  const { success, data } = await result.json();
  if (success) {
    return data;
  } else {
    message.error("Failed to fetch knowledge bases");
    return [];
  }
};

const KnowledgeBase: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [searchText, setSearchText] = useState(""); // 模糊搜索文本
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditingKB, setCurrentEditingKB] =
    useState<KnowledgeBase | null>(null);

  // 过滤知识库列表
  const filteredKnowledgeBases = knowledgeBases.filter((kb) =>
    kb.title.toLowerCase().includes(searchText.toLowerCase())
  );

  // 编辑知识库
  const handleEditKB = (kb: KnowledgeBase) => {
    setCurrentEditingKB(kb);
    setIsEditMode(true);
  };

  // 返回知识库列表
  const handleBackToList = () => {
    setIsEditMode(false);
    setCurrentEditingKB(null);
  };

  // 获取知识库列表
  const fetchKnowledgeBases = async () => {
    const data = await getKnowledgeBases(clientUserId);
    setKnowledgeBases(data);
  };

  useEffect(() => {
    fetchKnowledgeBases();
  }, []);

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto p-5">
          {isEditMode ? (
            <EditChunks
              currentEditingKB={currentEditingKB}
              handleBackToList={handleBackToList}
            />
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold m-0">Knowledge Base</h1>
                <div className="flex gap-3">
                  <div className="relative w-[300px]">
                    <input
                      type="text"
                      placeholder="search KB..."
                      className="w-full h-10 pl-9 px-3 border border-gray-300 rounded-lg outline-none transition-colors duration-200 hover:border-[rgba(99,0,255,0.87)] focus:border-[rgba(99,0,255,0.87)]"
                      onChange={(e) => setSearchText(e.target.value)}
                      value={searchText}
                    />
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="h-10 px-4 flex items-center gap-2 bg-[rgba(99,0,255,0.87)] hover:bg-[rgba(99,0,255,1)] text-white rounded-lg transition-colors duration-200"
                  >
                    <PlusOutlined />
                    <span>New KB</span>
                  </button>
                </div>
              </div>

              {filteredKnowledgeBases.length > 0 ? (
                <Row gutter={[24, 24]}>
                  {filteredKnowledgeBases.map((kb) => (
                    <KbCard
                      key={kb.id}
                      kb={kb}
                      handleEditKB={handleEditKB}
                      fetchKnowledgeBases={fetchKnowledgeBases}
                      clientUserId={clientUserId}
                    />
                  ))}
                </Row>
              ) : (
                <EmptyKb setIsModalOpen={setIsModalOpen} />
              )}
            </>
          )}
        </div>
      </div>

      <NewKBModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        fetchKnowledgeBases={fetchKnowledgeBases}
        clientUserId={clientUserId}
      />
    </>
  );
};

export default KnowledgeBase;
