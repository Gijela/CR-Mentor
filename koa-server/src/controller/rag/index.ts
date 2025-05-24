import { Context } from 'koa';
import {
  searchKnowledgeSnippets,
  getKnowledgeMetadata,
  associateKnowledgeToProfile
} from '../../service/rag';

// 语义搜索知识片段
export async function searchKnowledge(ctx: Context) {
  try {
    const {
      query,
      developer_id,
      filters,
      limit = 20
    } = ctx.request.body as {
      query: string;
      developer_id: string;
      filters?: {
        categories?: string[];
        tags?: string[];
        date_range?: { start: string; end?: string };
        similarity_threshold?: number;
      };
      limit?: number;
    };

    if (!query || !developer_id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "查询参数和开发者ID是必需的"
      };
      return;
    }

    // 调用服务层方法进行语义搜索
    const results = await searchKnowledgeSnippets(query, developer_id, filters, limit);

    ctx.body = {
      success: true,
      data: results
    };
  } catch (err) {
    console.error("知识库搜索错误:", err);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: "搜索知识片段时发生服务器错误",
      error: err instanceof Error ? err.message : String(err)
    };
  }
}

// 获取知识库元数据（分类和标签）
export async function getMetadata(ctx: Context) {
  try {
    const { developer_id } = ctx.request.body as { developer_id: string };

    if (!developer_id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "缺少开发者ID参数"
      };
      return;
    }

    // 获取知识库元数据
    const metadata = await getKnowledgeMetadata(developer_id);

    ctx.body = {
      success: true,
      data: metadata
    };
  } catch (err) {
    console.error("获取知识库元数据错误:", err);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: "获取知识库元数据时发生服务器错误",
      error: err instanceof Error ? err.message : String(err)
    };
  }
}

// 关联知识片段到开发者资料
export async function associateKnowledge(ctx: Context) {
  try {
    const {
      knowledge_id,
      developer_id,
      type
    } = ctx.request.body as {
      knowledge_id: string;
      developer_id: string;
      type: "strength" | "issue";
    };

    if (!knowledge_id || !developer_id || !type) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "知识片段ID、开发者ID和关联类型都是必需的"
      };
      return;
    }

    // 验证关联类型
    if (type !== "strength" && type !== "issue") {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "关联类型必须是'strength'或'issue'"
      };
      return;
    }

    // 关联知识片段到开发者资料
    const result = await associateKnowledgeToProfile(knowledge_id, developer_id, type);

    ctx.body = {
      success: true,
      data: result
    };
  } catch (err) {
    console.error("关联知识片段错误:", err);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: "关联知识片段时发生服务器错误",
      error: err instanceof Error ? err.message : String(err)
    };
  }
} 