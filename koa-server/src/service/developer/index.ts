import { Pool } from 'pg';

// Initialize PostgreSQL Pool (assuming MEMORY_DB_PG_VECTOR is the correct env var)
const connectionString = process.env.MEMORY_DB_PG_VECTOR;
if (!connectionString) {
  console.error("FATAL ERROR: MEMORY_DB_PG_VECTOR environment variable is not set.");
  // In a real app, you might want more robust error handling or dependency injection
  // For now, we exit if the critical configuration is missing.
  process.exit(1);
}

const pool = new Pool({
  connectionString,
});

// Database access object using the pool
const db = {
  query: async (sql: string, params: any[] = []) => {
    const client = await pool.connect();
    try {
      console.log("Executing SQL:", sql, "Params:", params); // Keep logging for debug
      const result = await client.query(sql, params);
      return result;
    } finally {
      client.release();
    }
  },
};

// --- Service Methods ---

interface KpiSummary {
  strengthsOverview: { totalCount: number; topCategory: { name: string; count: number } };
  issuesOverview: { activeCount: number; topCategory: { name: string; count: number } };
  knowledgeBaseStats: { totalSnippets: number; topTopic: { name: string; count: number } };
  recentActivity: {
    latestInsight: { description: string | null; category: string | null; timestamp: string | null };
    latestKnowledge: { summary: string | null; timestamp: string | null };
  };
}

export async function getKpiSummaryData(developerId: string): Promise<KpiSummary> {
  // Strengths Overview
  const strengthsCountSql = "SELECT COUNT(*) FROM developer_profile_data WHERE insight_type = 'strength' AND developer_id = $1";
  const strengthsCountResult = await db.query(strengthsCountSql, [developerId]);
  const totalStrengths = parseInt(strengthsCountResult.rows[0]?.count || "0", 10);

  const topStrengthCategorySql = `SELECT category_or_area, COUNT(*) as count FROM developer_profile_data WHERE insight_type = 'strength' AND developer_id = $1 GROUP BY category_or_area ORDER BY count DESC LIMIT 1;`;
  const topStrengthCategoryResult = await db.query(topStrengthCategorySql, [developerId]);
  let topStrengthCategory = { name: "N/A", count: 0 };
  if (topStrengthCategoryResult.rows && topStrengthCategoryResult.rows.length > 0) {
    const row = topStrengthCategoryResult.rows[0];
    topStrengthCategory = { name: row.category_or_area, count: parseInt(row.count, 10) };
  }

  // Issues Overview
  const activeIssuesCountSql = "SELECT COUNT(*) FROM developer_profile_data WHERE insight_type = 'issue' AND status = 'active' AND developer_id = $1";
  const activeIssuesCountResult = await db.query(activeIssuesCountSql, [developerId]);
  const totalActiveIssues = parseInt(activeIssuesCountResult.rows[0]?.count || "0", 10);

  const topIssueCategorySql = `SELECT category_or_area, COUNT(*) as count FROM developer_profile_data WHERE insight_type = 'issue' AND developer_id = $1 GROUP BY category_or_area ORDER BY count DESC LIMIT 1;`;
  const topIssueCategoryResult = await db.query(topIssueCategorySql, [developerId]);
  let topIssueCategory = { name: "N/A", count: 0 };
  if (topIssueCategoryResult.rows && topIssueCategoryResult.rows.length > 0) {
    const row = topIssueCategoryResult.rows[0];
    topIssueCategory = { name: row.category_or_area, count: parseInt(row.count, 10) };
  }

  // KnowledgeBase Stats
  const snippetsCountSql = "SELECT COUNT(*) FROM knowledge_snippets WHERE developer_id = $1";
  const snippetsCountResult = await db.query(snippetsCountSql, [developerId]);
  const totalSnippets = parseInt(snippetsCountResult.rows[0]?.count || "0", 10);

  const topTopicSql = `SELECT topic, COUNT(*) as count FROM knowledge_snippets WHERE developer_id = $1 AND topic IS NOT NULL GROUP BY topic ORDER BY count DESC LIMIT 1;`;
  const topTopicResult = await db.query(topTopicSql, [developerId]);
  let topTopic = { name: "N/A", count: 0 };
  if (topTopicResult.rows && topTopicResult.rows.length > 0) {
    const row = topTopicResult.rows[0];
    topTopic = { name: row.topic, count: parseInt(row.count, 10) };
  }

  // Recent Activity
  const latestInsightSql = "SELECT description, category_or_area, last_seen_at FROM developer_profile_data WHERE developer_id = $1 ORDER BY last_seen_at DESC LIMIT 1";
  const latestInsightResult = await db.query(latestInsightSql, [developerId]);
  let latestInsight: KpiSummary['recentActivity']['latestInsight'] = { description: "N/A", category: "N/A", timestamp: null };
  if (latestInsightResult.rows && latestInsightResult.rows.length > 0) {
    const row = latestInsightResult.rows[0];
    latestInsight = { description: row.description, category: row.category_or_area, timestamp: row.last_seen_at };
  }

  const latestKnowledgeSql = "SELECT content_summary, created_at FROM knowledge_snippets WHERE developer_id = $1 ORDER BY created_at DESC LIMIT 1";
  const latestKnowledgeResult = await db.query(latestKnowledgeSql, [developerId]);
  let latestKnowledge: KpiSummary['recentActivity']['latestKnowledge'] = { summary: "N/A", timestamp: null };
  if (latestKnowledgeResult.rows && latestKnowledgeResult.rows.length > 0) {
    const row = latestKnowledgeResult.rows[0];
    latestKnowledge = { summary: row.content_summary, timestamp: row.created_at };
  }

  return {
    strengthsOverview: { totalCount: totalStrengths, topCategory: topStrengthCategory },
    issuesOverview: { activeCount: totalActiveIssues, topCategory: topIssueCategory },
    knowledgeBaseStats: { totalSnippets: totalSnippets, topTopic: topTopic },
    recentActivity: { latestInsight, latestKnowledge },
  };
}


interface InsightTrendsData {
  labels: string[];
  datasets: Array<{ label: string; data: number[] }>;
}

export async function getInsightTrendsData(developerId: string, period: string, granularity: string): Promise<InsightTrendsData> {
  let pgGranularity: string;
  switch (granularity.toLowerCase()) {
    case "daily": pgGranularity = "day"; break;
    case "weekly": pgGranularity = "week"; break;
    case "monthly": pgGranularity = "month"; break;
    default:
      console.warn(`Unsupported granularity: ${granularity}, defaulting to 'day'.`);
      pgGranularity = "day";
  }

  const sql = `
      SELECT DATE_TRUNC($3, first_seen_at) AS time_bucket, insight_type, COUNT(*) AS count 
      FROM developer_profile_data 
      WHERE developer_id = $1 AND first_seen_at >= NOW() - $2::interval 
      GROUP BY time_bucket, insight_type 
      ORDER BY time_bucket;
    `;
  const periodInterval = period.endsWith('d') ? `${parseInt(period, 10)} days` : period;
  const result = await db.query(sql, [developerId, periodInterval, pgGranularity]);

  const labels: string[] = [];
  const strengthsData: number[] = [];
  const issuesData: number[] = [];
  const dataMap = new Map<string, { strengths: number; issues: number }>();

  result.rows.forEach((row: any) => {
    const dateLabel = new Date(row.time_bucket).toISOString().split('T')[0];
    if (!dataMap.has(dateLabel)) {
      dataMap.set(dateLabel, { strengths: 0, issues: 0 });
    }
    const currentCounts = dataMap.get(dateLabel)!;
    if (row.insight_type === 'strength') {
      currentCounts.strengths = parseInt(row.count, 10);
    } else if (row.insight_type === 'issue') {
      currentCounts.issues = parseInt(row.count, 10);
    }
  });

  const sortedDates = Array.from(dataMap.keys()).sort();
  sortedDates.forEach(date => {
    labels.push(date);
    const counts = dataMap.get(date)!;
    strengthsData.push(counts.strengths);
    issuesData.push(counts.issues);
  });

  return {
    labels,
    datasets: [
      { label: "Identified Strengths", data: strengthsData },
      { label: "Identified Issues", data: issuesData },
    ]
  };
}

interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
}

interface ListParams {
  developerId: string;
  limit: number;
  offset: number;
  sortBy: string;
  sortOrder: string;
  status?: string; // For issues
  topic?: string;  // For snippets
  q?: string;      // For snippets search
}

// Internal helper function - DO NOT export
async function fetchPaginatedData<T>(
  dataSql: string,
  countSql: string,
  queryParams: any[],
  countParams: any[],
  limit: number
): Promise<PaginatedResult<T>> {
  const [dataResult, countResult] = await Promise.all([
    db.query(dataSql, queryParams),
    db.query(countSql, countParams)
  ]);

  const totalItems = parseInt(countResult.rows[0]?.count || "0", 10);
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data: dataResult.rows,
    totalItems,
    totalPages
  };
}


export async function getStrengths(params: ListParams): Promise<PaginatedResult<any>> {
  const { developerId, limit, offset, sortBy, sortOrder } = params;
  const dataSql = `
      SELECT id, category_or_area, description, confidence, frequency, related_prs, last_seen_at, first_seen_at
      FROM developer_profile_data
      WHERE developer_id = $1 AND insight_type = 'strength'
      ORDER BY ${sortBy} ${sortOrder} 
      LIMIT $2 OFFSET $3;
    `;
  const countSql = "SELECT COUNT(*) FROM developer_profile_data WHERE developer_id = $1 AND insight_type = 'strength'";

  return fetchPaginatedData(dataSql, countSql, [developerId, limit, offset], [developerId], limit);
}

export async function getIssues(params: ListParams): Promise<PaginatedResult<any>> {
  const { developerId, limit, offset, sortBy, sortOrder, status } = params;
  let dataSql = `
      SELECT id, category_or_area, description, status, frequency, related_prs, last_seen_at, first_seen_at
      FROM developer_profile_data
      WHERE developer_id = $1 AND insight_type = 'issue'
    `;
  const queryParams: any[] = [developerId];
  let paramCount = 1;

  if (status) {
    paramCount++;
    dataSql += ` AND status = $${paramCount}`;
    queryParams.push(status);
  }

  dataSql += ` ORDER BY ${sortBy} ${sortOrder} LIMIT $${paramCount + 1} OFFSET $${paramCount + 2};`;
  queryParams.push(limit, offset);

  let countSql = "SELECT COUNT(*) FROM developer_profile_data WHERE developer_id = $1 AND insight_type = 'issue'";
  const countParams: any[] = [developerId];
  if (status) {
    countSql += " AND status = $2";
    countParams.push(status);
  }

  return fetchPaginatedData(dataSql, countSql, queryParams, countParams, limit);
}


export async function getKnowledgeSnippets(params: ListParams): Promise<PaginatedResult<any>> {
  const { developerId, limit, offset, sortBy, sortOrder, topic, q } = params;
  let dataSql = `
      SELECT id, content_summary, topic, source_pr, extracted_from_section, created_at
      FROM knowledge_snippets
      WHERE developer_id = $1
    `;
  const queryParams: any[] = [developerId];
  let paramCount = 1;

  if (topic) {
    paramCount++;
    dataSql += ` AND topic = $${paramCount}`;
    queryParams.push(topic);
  }
  if (q) {
    paramCount++;
    dataSql += ` AND content_summary ILIKE $${paramCount}`;
    queryParams.push(`%${q}%`);
  }

  dataSql += ` ORDER BY ${sortBy} ${sortOrder} LIMIT $${paramCount + 1} OFFSET $${paramCount + 2};`;
  queryParams.push(limit, offset);

  let countSql = "SELECT COUNT(*) FROM knowledge_snippets WHERE developer_id = $1";
  const countParams: any[] = [developerId];
  let countParamIdx = 1;
  if (topic) {
    countParamIdx++;
    countSql += ` AND topic = $${countParamIdx}`;
    countParams.push(topic);
  }
  if (q) {
    countParamIdx++;
    countSql += ` AND content_summary ILIKE $${countParamIdx}`;
    countParams.push(`%${q}%`);
  }

  const result = await fetchPaginatedData<any>(dataSql, countSql, queryParams, countParams, limit);
  // Explicitly remove embedding if it were selected (it's not here)
  result.data = result.data.map(r => ({ ...r, embedding: undefined }));
  return result;
} 