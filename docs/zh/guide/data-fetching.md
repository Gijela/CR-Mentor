# 数据请求

- 使用 [`ofetch`](https://github.com/unjs/ofetch) 请求数据
- 使用 [`@tanstack/react-query`](https://tanstack.com/query/latest/docs/framework/react/overview) 管理 server 数据

## 获取数据

### 使用 `useQuery` 请求数据

- 直接使用
```tsx
// src/pages/post.tsx
// 定义 fetcher
const fetcher = (url: string) => ofetch(url, { method: 'GET' });

// 使用 `useQuery` 请求数据
const { data, isLoading, isError, error } = useQuery({ queryKey: ['posts'], queryFn: fetcher });

// 使用
// pages/post.tsx
export function Component() {
  const { data, isLoading, isError, error } = usePosts();

  return <div>{data.title}</div>;
}

```

- 自定义 hook （推荐）

因为在多处使用的时候 react-query 会将数据缓存，我不知道什么时候会多处用，所以我喜欢全都用自定义 hook 来管理
（单一数据流？）

```ts
// hooks/query/use-posts.ts
// 定义 fetcher
const fetcher = (url: string) => ofetch(url, { method: 'GET' });

// 使用 `useQuery` 请求数据

export function usePosts() {
  const { data, isLoading, isError, error } = useQuery({ queryKey: ['posts'], queryFn: fetcher });

  return { data, isLoading, isError, error };
}

// 使用
// pages/post.tsx
export function Component() {
  const { data, isLoading, isError, error } = usePosts();

  return <div>{data.title}</div>;
}
```

### 使用 react-router 的 loader 请求数据

> https://reactrouter.com/en/main/route/loader

- 基本使用

```tsx
// src/pages/post.tsx

const loader = async () => {
  const data = await fetcher('/api/posts');
  return data;
};

// 使用
// pages/post.tsx
export function Component() {
  const data = useLoaderData();

  return <div>{data.title}</div>;
}

```

### 使用 react-router + react-query 请求数据

我还没有用过，等我用了再来写这个文档

> [react-router + react-query](https://github.com/remix-run/react-router/tree/main/examples/query)

## 提交数据

### 使用 `useMutation` 提交数据

```tsx
// src/pages/post.tsx

const mutation = useMutation({ mutationFn: fetcher });

// 使用
// pages/post.tsx
export function Component() {
  const { mutate } = useMutation();

  return <button onClick={() => mutate({ title: 'Hello World' })}>Submit</button>;
}

```

### 使用 react-router 的 action 提交数据

没用过

> https://reactrouter.com/en/main/route/action
