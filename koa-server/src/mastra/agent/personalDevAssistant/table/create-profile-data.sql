    -- 创建 developer_profile_data 表
    CREATE TABLE public.developer_profile_data (
        id SERIAL PRIMARY KEY,                             -- 记录唯一标识符
        developer_id TEXT NOT NULL,                       -- 开发者标识符
        insight_type TEXT NOT NULL CHECK (insight_type IN ('issue', 'strength')), -- 洞察类型 ('issue' 或 'strength')
        category_or_area TEXT NOT NULL,                   -- 问题类别 或 优势领域
        description TEXT NOT NULL,                        -- 详细描述
        frequency INTEGER NOT NULL DEFAULT 1,             -- 出现频率 (主要用于 issue)
        first_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 首次出现时间
        last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 最后出现时间
        related_prs TEXT [],                              -- 相关 PR 列表 (文本数组)
        status TEXT CHECK (status IN ('active', 'resolved') OR status IS NULL), -- 状态 ('active'/'resolved' for issue)
        confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1 OR confidence IS NULL) -- 置信度 (可选, 主要用于 strength)
    );

    -- 为常用查询列添加索引
    CREATE INDEX idx_developer_profile_data_developer_id ON public.developer_profile_data (developer_id);
    CREATE INDEX idx_developer_profile_data_insight_type ON public.developer_profile_data (insight_type);
    CREATE INDEX idx_developer_profile_data_last_seen_at ON public.developer_profile_data (last_seen_at);
    -- 可选索引 (根据需要创建)
    -- CREATE INDEX idx_developer_profile_data_category ON public.developer_profile_data (category_or_area);
    -- CREATE INDEX idx_developer_profile_data_status ON public.developer_profile_data (status);

    -- 为表和列添加注释 (可选, 但推荐)
    COMMENT ON TABLE public.developer_profile_data IS '存储开发者的结构化洞察信息，如问题模式和技术优势';
    COMMENT ON COLUMN public.developer_profile_data.id IS '记录唯一标识符';
    COMMENT ON COLUMN public.developer_profile_data.developer_id IS '开发者标识符';
    COMMENT ON COLUMN public.developer_profile_data.insight_type IS '洞察类型 (''issue'' 或 ''strength'')';
    COMMENT ON COLUMN public.developer_profile_data.category_or_area IS '问题类别 或 优势领域';
    COMMENT ON COLUMN public.developer_profile_data.description IS '详细描述';
    COMMENT ON COLUMN public.developer_profile_data.frequency IS '出现频率 (主要用于 issue)';
    COMMENT ON COLUMN public.developer_profile_data.first_seen_at IS '首次出现时间';
    COMMENT ON COLUMN public.developer_profile_data.last_seen_at IS '最后出现时间';
    COMMENT ON COLUMN public.developer_profile_data.related_prs IS '相关 PR 列表 (文本数组)';
    COMMENT ON COLUMN public.developer_profile_data.status IS '状态 (''active''/''resolved'' for issue)';
    COMMENT ON COLUMN public.developer_profile_data.confidence IS '置信度 (可选, 主要用于 strength)';
