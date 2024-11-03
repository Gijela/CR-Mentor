"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Space,
  Typography,
  message,
  Spin,
} from "antd";
import { useUser } from "@clerk/nextjs";

const { Title } = Typography;
const { Option } = Select;

export interface CRConfigForm {
  accessToken: string;
  knowledgeBase: string[];
  languages: string;
  difyBaseUrl: string;
  difyKnowLedgeApiKey: string;
}

const langs = [
  { value: "中文", label: "中文" },
  { value: "English", label: "English" },
  { value: "Español", label: "Español" },
  { value: "Français", label: "Français" },
  { value: "Deutsch", label: "Deutsch" },
  { value: "日本語", label: "日本語" },
  { value: "한국어", label: "한국어" },
  { value: "Italiano", label: "Italiano" },
  { value: "Português", label: "Português" },
  { value: "Русский", label: "Русский" },
  { value: "العربية", label: "العربية" },
  { value: "Nederlands", label: "Nederlands" },
  { value: "Svenska", label: "Svenska" },
  { value: "Norsk", label: "Norsk" },
  { value: "Dansk", label: "Dansk" },
  { value: "Suomi", label: "Suomi" },
  { value: "Polski", label: "Polski" },
  { value: "Türkçe", label: "Türkçe" },
  { value: "עברית", label: "עברית" },
  { value: "हिन्दी", label: "हिन्दी" },
];

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);

      const { language } = user.publicMetadata;
      form.setFieldsValue({ language: language || "en" });

      setLoading(false);
    }
  }, [user]);

  const onFinish = async ({ language }) => {
    console.log("🚀 ~ onFinish ~ language:", language);
    if (!user) {
      message.error("Please login first");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/clerk/globalSetting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.id, language }),
    });
    const { success, msg } = await response.json();
    if (success) {
      message.success(msg);
    } else {
      message.error(msg);
    }

    setLoading(false);
  };

  return (
    <>
      <Title level={3} className="mb-6">
        Settings
      </Title>
      <Spin spinning={loading} size="large" tip="Loading...">
        <div className="overflow-auto max-h-[calc(100vh-200px)]">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* <Form.Item
              name="accessToken"
              label="Github AccessToken"
              rules={[
                { required: true, message: "Please input Github Access Token" },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Please input Github Access Token"
              />
            </Form.Item> */}

            <Form.Item
              name="language"
              label="response language"
              rules={[
                { required: true, message: "Please select the language" },
              ]}
            >
              <Select
                style={{ width: "30%" }}
                placeholder="select the language you want"
              >
                {langs.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  save
                </Button>
                {/* <Button htmlType="button" onClick={() => form.resetFields()}>
                  reset
                </Button> */}
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </>
  );
};

export default Settings;
