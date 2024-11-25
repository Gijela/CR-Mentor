"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Spin,
  Upload,
  Empty,
  List,
  message,
  Card,
  Drawer,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useUser } from "@clerk/nextjs";
import { downloadFile, getFileList, uploadFile } from "../../lib/utils/supabase";

import ReactMarkdown from "react-markdown";
const { Title } = Typography;

const Knowledge: React.FC = () => {
  const [knowledgeBases, setKnowledgeBases] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [isOpenMarkdown, setIsOpenMarkdown] = useState(false);
  const [markdownContent, setMarkdownContent] = useState("");

  const handleGetFileList = async (userId: string) => {
    setLoading(true);
    const { success, data, message } = await getFileList(userId);
    if (success) {
      setKnowledgeBases(data);
    } else {
      message.error(message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.id) {
      handleGetFileList(user.id);
    }
  }, [user?.id]);

  const handleUploadFile = async (e) => {
    if (!user?.id) {
      message.error("Please login first");
      return;
    }
    if (e.file.status !== "done") return;

    if (knowledgeBases.length >= 3) {
      message.error("Each person can upload a maximum of three files");
      return;
    }

    try {
      const { success, message } = await uploadFile(e, user.id);
      if (success) {
        handleGetFileList(user.id);
      } else {
        message.error(message);
      }
    } catch (error) {
      console.error("🚀 ~ handleUploadFile ~ error:", error);
    }
  };

  const handleDownloadFile = async (fileName: string) => {
    if (!user?.id) return;
    setLoading(true);
    const { success, data } = await downloadFile(user.id, fileName);
    if (success) {
      setMarkdownContent(data.text);
      setIsOpenMarkdown(true);
    } else {
      message.error(data.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Spin spinning={loading} tip="Loading" size="large">
        <div>
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10">
            <Title level={3} className="text-gray-800 m-0">
              Code Standard Files
            </Title>

            <Upload
              showUploadList={false}
              onChange={handleUploadFile}
              accept=".md"
              beforeUpload={(file) => {
                const isValidSize = file.size < 300 * 1024; // 文件大小小于300KB
                if (!isValidSize) {
                  message.error("File size cannot exceed 300KB");
                }
                return isValidSize;
              }}
            >
              <Button
                icon={<UploadOutlined />}
                className="bg-black text-white h-10 text-base"
              >
                Upload
              </Button>
            </Upload>
          </div>

          <Card>
            {knowledgeBases.length === 0 ? (
              <Empty description="No code standards files available"></Empty>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={knowledgeBases}
                renderItem={(item) => (
                  <List.Item
                    key={item.name}
                    className="cursor-pointer"
                    onClick={() => handleDownloadFile(item.name)}
                  >
                    <List.Item.Meta
                      title={<span className="text-gray-800">{item.name}</span>}
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </div>

        <Drawer
          open={isOpenMarkdown}
          onClose={() => setIsOpenMarkdown(false)}
          footer={null}
          width={"80%"}
        >
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </Drawer>
      </Spin>
    </>
  );
};

export default Knowledge;
