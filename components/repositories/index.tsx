import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  List,
  Typography,
  Spin,
  Row,
  message,
  Empty,
  Input,
} from "antd";
import {
  ForkOutlined,
  GithubOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { getLangFromUrl, getRepos, handleInstall } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import RepoDrawer from "./RepoDrawer";
const { Title } = Typography;

const Repositories: React.FC = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [originalReposList, setOriginalReposList] = useState<any[]>([]); // 保存的全部数据
  const [reposList, setReposList] = useState<any[]>([]); // 用户模糊搜索的数据
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);

  // 初始化获取仓库列表
  const initFetchRepos = async () => {
    setLoading(true);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const installation_id = urlParams.get("installation_id");
      console.log("🚀 ~ initFetch ~ installation_id:", installation_id);
      if (installation_id) {
        // 将 githubId 保存到 clerk user metadata 中
        const { success, data, msg } = await handleInstall(
          installation_id,
          user?.id,
          (user?.publicMetadata?.language || getLangFromUrl()) as string
        );
        if (!success) {
          message.error(msg);
        }
        await fetchRepos(data?.account?.node_id);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("🚀 ~ initFetch ~ error:", error);
    }
  };

  useEffect(() => {
    if (user) {
      if (user?.publicMetadata?.github_id) {
        fetchRepos(user?.publicMetadata?.github_id as string);
        return;
      }
      initFetchRepos();
    }
  }, [user]);

  const fetchRepos = async (github_id: string) => {
    setLoading(true);
    const { success, data } = await getRepos(github_id);
    if (success) {
      setReposList(data);
      setOriginalReposList(data);
    }
    setLoading(false);
  };

  const showDrawer = async (repo) => {
    setSelectedRepo(repo);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <>
      <Row justify={"space-between"}>
        <Title level={3} className="pb-3 sticky top-0 bg-white z-10">
          Repositories
        </Title>
        <Button
          icon={<PlusOutlined />}
          className="bg-black text-white h-10 text-base"
          onClick={() => {
            if (!user) {
              message.error("Please login first");
              return;
            }

            window.open(
              "https://github.com/apps/cr-mentor/installations/select_target",
              "_blank"
            );
          }}
        >
          Install
        </Button>
      </Row>
      <Spin spinning={loading} tip="loading..." size="large">
        <Input.Search
          placeholder="search repo"
          onSearch={(value) => {
            const filteredRepos = reposList.filter((repo) =>
              repo.name.toLowerCase().includes(value.toLowerCase())
            );
            setReposList(filteredRepos);
          }}
          style={{ marginBottom: 16 }}
          allowClear
          onChange={(e) => {
            if (!e.target.value) {
              setReposList(originalReposList);
            }
          }}
        />
        <Card>
          {reposList.length > 0 ? (
            <List
              pagination={{ position: "bottom", align: "end" }}
              dataSource={reposList}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={
                          item.fork ? (
                            <ForkOutlined />
                          ) : (
                            <Avatar
                              src={user?.publicMetadata?.avatar_url as string}
                            />
                          )
                        }
                        style={{
                          backgroundColor: item.fork ? "#87d068" : undefined,
                        }}
                      />
                    }
                    title={<a href={item.html_url}>{item.name}</a>}
                    description={item.description || "No Description"}
                  />
                  <Button
                    className="mr-2"
                    onClick={() => window.open(item.html_url, "_blank")}
                  >
                    <GithubOutlined />
                  </Button>
                  <Button onClick={() => showDrawer(item)}>
                    <SettingOutlined />
                  </Button>
                </List.Item>
              )}
            />
          ) : (
            <Empty
              description={
                !!originalReposList.length
                  ? "Could Found The Repo"
                  : "Please install CR-Mentor first"
              }
            ></Empty>
          )}
        </Card>
      </Spin>

      <RepoDrawer
        visible={drawerVisible}
        selectedRepo={selectedRepo}
        closeDrawer={closeDrawer}
      />
    </>
  );
};

export default Repositories;
