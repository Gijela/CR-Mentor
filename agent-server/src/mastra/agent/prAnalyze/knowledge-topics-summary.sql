-- 查询知识库主题分布
-- 这个查询获取指定开发者的知识片段主题分布统计
-- 返回每个主题的数量和百分比
SELECT 
    COALESCE(topic, '未分类') AS topic,
    COUNT(*) AS count,
    -- 计算百分比（保留两位小数）
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM public.knowledge_snippets 
                            WHERE developer_id = :developer_id), 1) AS percentage
FROM 
    public.knowledge_snippets
WHERE 
    developer_id = :developer_id
GROUP BY 
    topic
ORDER BY 
    count DESC; 