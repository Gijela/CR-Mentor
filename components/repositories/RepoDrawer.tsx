import { getFileList, getRepoFile, postRepoFile } from "../../lib/utils/supabase";
import { useUser } from "@clerk/nextjs";
import { Button, Descriptions, Drawer, Form, message, Row, Select } from "antd";
import { useEffect, useState } from "react";

const RepoDrawer = ({ visible, selectedRepo, closeDrawer }) => {
  const [form] = Form.useForm();
  const { user } = useUser();
  const [knowledgeBases, setKnowledgeBases] = useState([]);

  // 打开弹窗，默认选中已保存的规范文件
  const initFileSelected = async (repo) => {
    const { success, msg, data } = await getRepoFile(repo?.full_name);
    if (success) {
      form.setFieldsValue({ fileName: data.file_name });
    } else {
      message.error(msg);
    }
  };

  useEffect(() => {
    initFileSelected(selectedRepo);
  }, [selectedRepo]);

  const makeSave = async () => {
    const { fileName } = form.getFieldsValue();
    if (!fileName) {
      closeDrawer();
      return;
    }

    const { success, msg } = await postRepoFile(
      selectedRepo?.full_name,
      user?.id,
      fileName
    );
    if (success) {
      message.success("Save file success");
    } else {
      message.error(msg);
    }
    closeDrawer();
  };

  const handleGetFileList = async (userId: string) => {
    const { success, data } = await getFileList(userId);
    if (success) {
      setKnowledgeBases(data);
    }
  };

  useEffect(() => {
    if (user) {
      handleGetFileList(user.id);
    }
  }, [user]);

  return (
    <Drawer
      title={"Personalized Setting"}
      placement="right"
      onClose={closeDrawer}
      open={visible}
      width={"38%"}
    >
      {selectedRepo && (
        <>
          <Form form={form} layout="vertical">
            <Form.Item name="fileName" label="Select One Code Standard file">
              <Select
                style={{ width: "100%" }}
                placeholder="Select Code Standard file"
              >
                {knowledgeBases.map((file) => (
                  <Select.Option key={file.id} value={file.name}>
                    {file.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>

          <Descriptions title="Repository Information" bordered column={1}>
            {[
              {
                label: "Repo Name",
                value: selectedRepo.name,
              },
              {
                label: "Creation Time",
                value: new Date(selectedRepo.created_at).toLocaleString(),
              },
              {
                label: "Last Updated",
                value: new Date(selectedRepo.updated_at).toLocaleString(),
              },
              { label: "Default Branch", value: selectedRepo.default_branch },
              { label: "Star Count", value: selectedRepo.stargazers_count },
              { label: "Fork Count", value: selectedRepo.forks_count },
              {
                label: "Open Issues Count",
                value: selectedRepo.open_issues_count,
              },
            ].map((item, index) => (
              <Descriptions.Item key={index} label={item.label}>
                {item.value}
              </Descriptions.Item>
            ))}
          </Descriptions>

          <Row justify={"end"} style={{ marginTop: 12 }}>
            <Button type="primary" onClick={makeSave}>
              保存
            </Button>
          </Row>
        </>
      )}
    </Drawer>
  );
};

export default RepoDrawer;
