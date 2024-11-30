import { Form, Input, message, Modal } from "antd";
import { FC, useState } from "react";

const NewKBModal: FC<{
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  fetchKnowledgeBases: () => void;
  clientUserId: string;
}> = ({ isModalOpen, setIsModalOpen, fetchKnowledgeBases, clientUserId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

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
      fetchKnowledgeBases();
    } else {
      message.error("Failed to create knowledge base");
    }
    setLoading(false);
  };

  return (
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
          rules={[{ required: true, message: "Please enter the description" }]}
        >
          <Input.TextArea
            placeholder="Please enter the description"
            rows={4}
            className="focus:border-[rgba(99,0,255,0.87)] hover:border-[rgba(99,0,255,0.87)]"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewKBModal;
