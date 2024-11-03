"use client";

import { useUser } from "@clerk/nextjs";
import { Button, message } from "antd";
import React, { useEffect, useState } from "react";

const TestPage: React.FC = () => {
  const { user } = useUser();
  const [token, setToken] = useState<string | null>(null);

  const fetchToken = async () => {
    console.log('user:', user);

    if (!user?.publicMetadata?.github_id) {
      message.error("请先在设置中绑定 github 账号");
      return;
    }

    const response = await fetch('/api/github/generateJWT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ githubId: user?.publicMetadata?.github_id }),
    });

    if (response.ok) {
      const data = await response.json();
      setToken(data.token);
    } else {
      console.error('获取 token 失败');
    }
  };

  return (
    <div>
      <h1>生成的 JWT Token</h1>
      <Button onClick={fetchToken}>生成 token</Button>
      {token ? <pre>{token}</pre> : <p>正在生成 token...</p>}
    </div>
  );
};

export default TestPage;
