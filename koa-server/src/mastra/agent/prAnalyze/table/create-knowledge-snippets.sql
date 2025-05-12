-- 尝试启用 pgvector 扩展（如果尚未启用）。注意：这可能需要数据库超级用户权限。
CREATE EXTENSION IF NOT EXISTS vector;

-- 创建 knowledge_snippets 表
CREATE TABLE public.knowledge_snippets (
    id SERIAL PRIMARY KEY,                                  -- 记录唯一标识符
    developer_id TEXT NOT NULL,                             -- 开发者标识符
    topic TEXT,                                             -- 知识点主题 (可选)
    content_summary TEXT NOT NULL,                          -- 提炼的知识点/解决方案内容
    embedding vector(1536) NOT NULL,                        -- 内容的向量表示 (维度需匹配 text-embedding-3-small)
    source_pr TEXT,                                         -- 来源 PR 链接或标识符 (可选)
    extracted_from_section TEXT,                            -- PR 中提炼的具体部分 (例如 'walkthrough', 'discussion', 可选)
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP  -- 创建时间
);

-- 为 developer_id 创建索引 (优化按开发者查询)
CREATE INDEX idx_knowledge_snippets_developer_id ON public.knowledge_snippets (developer_id);

-- 为 embedding 创建 HNSW 向量索引 (优化语义搜索, 使用 L2 距离)
-- 对于 OpenAI embeddings，也可以考虑使用 vector_cosine_ops (余弦相似度)
CREATE INDEX idx_knowledge_snippets_embedding_hnsw ON public.knowledge_snippets USING hnsw (embedding vector_l2_ops);

-- -- (可选) 为 topic 创建索引 (如果需要频繁按主题过滤)
CREATE INDEX idx_knowledge_snippets_topic ON public.knowledge_snippets (topic);

-- -- (可选) 为 created_at 创建索引 (如果需要频繁按创建时间排序或过滤)
CREATE INDEX idx_knowledge_snippets_created_at ON public.knowledge_snippets (created_at);

-- 验证表和索引是否创建成功 (可选，在 psql 中执行比较方便)
-- \d public.knowledge_snippets