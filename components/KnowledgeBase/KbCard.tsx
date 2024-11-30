import { MoreOutlined } from "@ant-design/icons";
import { Button, Card, Col, Dropdown, message } from "antd";
import { FC } from "react";
import { KnowledgeBase } from "./index";

const KbCard: FC<{
  kb: KnowledgeBase;
  handleEditKB: (kb: KnowledgeBase) => void;
  fetchKnowledgeBases: () => void;
  clientUserId: string;
}> = ({ kb, handleEditKB, fetchKnowledgeBases, clientUserId }) => {
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
  return (
    <>
      <Col xs={24} md={12} lg={8} key={kb.id} onClick={() => handleEditKB(kb)}>
        <Card
          className="cursor-pointer shadow-sm rounded-2xl hover:shadow-xl transition-shadow duration-300"
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
                  <h3 className="text-xl font-semibold m-0">{kb.title}</h3>
                </div>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "1",
                        label: "Delete KB",
                        onClick: () => handleDeleteKB(kb.id),
                      },
                    ],
                  }}
                  placement="bottomRight"
                >
                  <Button
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
              <button
                onClick={(e) => {
                  alert("chat kb");
                  e.stopPropagation();
                }}
                className="text-[rgb(132,112,255)] hover:text-[#8470FF] py-3 transition-colors duration-200 flex items-center justify-center font-medium"
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
    </>
  );
};

export default KbCard;
