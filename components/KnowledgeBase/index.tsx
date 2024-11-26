import React from "react";
import { Input, Card, Dropdown, Row, Col, Pagination, Button } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  MoreOutlined,
  StarFilled,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

function KnowledgeBase() {
  const dropdownItems: MenuProps["items"] = [
    {
      key: "2",
      label: "Delete KB",
    },
  ];

  // 模拟会员数据
  const members = [
    {
      id: 1,
      name: "Dominik McNeail",
      description:
        "Fitness Fanatic, Design Enthusiast, Mentor, Meetup Organizer & PHP Lover.",
    },
    {
      id: 2,
      name: "张三峰",
      description: "全栈开发工程师，专注于React和Node.js开发，热爱开源社区。",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      description:
        "UX Designer with 5 years experience. Passionate about creating user-friendly interfaces.",
    },
    {
      id: 4,
      name: "李小明",
      avatar: "/file-logo.png",
      description: "数据分析师，精通Python和机器学习，致力于AI领域研究。",
    },
    {
      id: 5,
      name: "Mark Wilson",
      avatar: "/file-logo.png",
      description:
        "DevOps Engineer, AWS Certified Solutions Architect, Docker & Kubernetes Expert.",
    },
    {
      id: 6,
      name: "王丽华",
      avatar: "/file-logo.png",
      description: "产品经理，有着丰富的B端产品设计经验，关注用户体验。",
    },
    {
      id: 7,
      name: "Emily Chen",
      description:
        "Frontend Developer specializing in Vue.js and React. Love creating beautiful web experiences.",
    },
    {
      id: 8,
      name: "刘大壮",
      avatar: "/file-logo.png",
      description: "后端工程师，Java架构专家，微服务架构设计师。",
    },
    {
      id: 9,
      name: "Tom Anderson",
      avatar: "/file-logo.png",
      description:
        "Mobile App Developer, iOS Specialist, Swift Programming Guru.",
    },
    {
      id: 10,
      name: "赵小红",
      avatar: "/file-logo.png",
      description: "UI设计师，擅长移动端界面设计，追求极致用户体验。",
    },
  ];

  // 添加搜索状态
  const [searchText, setSearchText] = React.useState("");

  // 过滤会员列表
  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
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
            <button className="h-10 px-4 flex items-center gap-2 bg-[rgba(99,0,255,0.87)] hover:bg-[rgba(99,0,255,1)] text-white rounded-lg transition-colors duration-200">
              <PlusOutlined />
              <span>添加成员</span>
            </button>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          {filteredMembers.map((member) => (
            <Col xs={24} md={12} lg={8} key={member.id}>
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
                          {member.name}
                        </h3>
                      </div>
                      <Dropdown
                        menu={{ items: dropdownItems }}
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
                      {member.description}
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
  );
}

export default KnowledgeBase;
