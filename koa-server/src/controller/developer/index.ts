import { Context } from 'koa';
import {
  getKpiSummaryData,
  getInsightTrendsData,
  getStrengths,
  getIssues,
  getKnowledgeSnippets
} from '../../service/developer'; // Adjust path as needed

// Helper function to get a single query parameter value
const getQueryParam = (param: string | string[] | undefined): string | undefined => {
  if (Array.isArray(param)) {
    return param[0];
  }
  return param;
};

// Controller methods
export async function getKpiSummary(ctx: Context) {
  try {
    const { developer_id } = ctx.request.body as { developer_id: string };
    if (!developer_id) {
      ctx.status = 400;
      ctx.body = { success: false, message: "Missing developer_id in request body." };
      return;
    }
    const summary = await getKpiSummaryData(developer_id);
    ctx.body = { success: true, data: summary };
  } catch (err) {
    let errorMessage = "An unknown error occurred while fetching KPI summary.";
    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === 'string') {
      errorMessage = err;
    }
    console.error("Error in getKpiSummary Controller:", err);
    ctx.status = 500;
    ctx.body = { success: false, message: "Internal server error fetching KPI summary.", error: errorMessage };
  }
}

export async function getInsightTrends(ctx: Context) {
  try {
    const { developer_id, period: rawPeriod, granularity: rawGranularity } = ctx.request.body as { developer_id: string, period?: string, granularity?: string };
    if (!developer_id) {
      ctx.status = 400;
      ctx.body = { success: false, message: "Missing developer_id in request body." };
      return;
    }
    const period = rawPeriod || "30d";
    const granularity = rawGranularity || "daily";

    const trends = await getInsightTrendsData(developer_id, period, granularity);
    ctx.body = { success: true, data: { period, granularity, ...trends } }; // Include params in response
  } catch (err) {
    let errorMessage = "An unknown error occurred while fetching insight trends.";
    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === 'string') {
      errorMessage = err;
    }
    console.error("Error in getInsightTrends Controller:", err);
    ctx.status = 500;
    ctx.body = { success: false, message: "Internal server error fetching insight trends.", error: errorMessage };
  }
}

// Common handler for list endpoints to reduce repetition
async function handleListRequest(ctx: Context, serviceMethod: Function, allowedSortFields: string[], defaultSortBy: string) {
  try {
    const {
      developer_id,
      page: rawPage,
      limit: rawLimit,
      sortBy: rawSortBy,
      sortOrder: rawSortOrder,
      status,
      topic,
      q
    } = ctx.request.body as {
      developer_id: string,
      page?: string | number,
      limit?: string | number,
      sortBy?: string,
      sortOrder?: string,
      status?: string,
      topic?: string,
      q?: string
    };

    if (!developer_id) {
      ctx.status = 400;
      ctx.body = { success: false, message: "Missing developer_id in request body." };
      return;
    }

    const page = parseInt(String(rawPage || "1"), 10);
    const limit = parseInt(String(rawLimit || "10"), 10);
    const sortBy = rawSortBy || defaultSortBy;
    const sortOrder = rawSortOrder || "desc";

    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      ctx.status = 400;
      ctx.body = { success: false, message: "Invalid page or limit parameter." };
      return;
    }

    if (!allowedSortFields.includes(sortBy)) {
      ctx.status = 400;
      ctx.body = { success: false, message: `Invalid sortBy parameter. Allowed fields: ${allowedSortFields.join(', ')}` };
      return;
    }
    const validatedSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const offset = (page - 1) * limit;

    const params = {
      developerId: developer_id,
      limit,
      offset,
      sortBy,
      sortOrder: validatedSortOrder,
      status,
      topic,
      q,
    };

    const result = await serviceMethod(params);

    ctx.body = {
      success: true,
      data: result.data,
      pagination: { currentPage: page, totalPages: result.totalPages, totalItems: result.totalItems, limit },
    };

  } catch (err) {
    let errorMessage = "An unknown error occurred while fetching list data.";
    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === 'string') {
      errorMessage = err;
    }
    console.error(`Error in list Controller:`, err);
    ctx.status = 500;
    ctx.body = { success: false, message: "Internal server error fetching list data.", error: errorMessage };
  }
}

// Specific list controllers using the common handler
export async function listStrengths(ctx: Context) {
  const allowedSortBy = ["last_seen_at", "first_seen_at", "frequency", "confidence"];
  await handleListRequest(ctx, getStrengths, allowedSortBy, "last_seen_at");
}

export async function listIssues(ctx: Context) {
  const allowedSortBy = ["last_seen_at", "first_seen_at", "frequency"];
  await handleListRequest(ctx, getIssues, allowedSortBy, "last_seen_at");
}

export async function listKnowledgeSnippets(ctx: Context) {
  const allowedSortBy = ["created_at", "topic"];
  await handleListRequest(ctx, getKnowledgeSnippets, allowedSortBy, "created_at");
}
