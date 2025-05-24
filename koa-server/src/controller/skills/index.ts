import { Context } from 'koa';
import {
  getSkillRadarData,
  getSkillTrendsData,
  getSkillNetworkData
} from '../../service/skills';

// 获取技能雷达图数据
export async function getSkillRadar(ctx: Context) {
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

    // 获取技能雷达图数据
    const radarData = await getSkillRadarData(developer_id);

    ctx.body = {
      success: true,
      data: radarData
    };
  } catch (err) {
    console.error("获取技能雷达图数据错误:", err);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: "获取技能雷达图数据时发生服务器错误",
      error: err instanceof Error ? err.message : String(err)
    };
  }
}

// 获取技能趋势数据
export async function getSkillTrends(ctx: Context) {
  try {
    const {
      developer_id,
      skill_category,
      time_range = "6m" // 默认6个月
    } = ctx.request.body as {
      developer_id: string;
      skill_category?: string;
      time_range?: string;
    };

    if (!developer_id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "缺少开发者ID参数"
      };
      return;
    }

    // 获取技能趋势数据
    const trendsData = await getSkillTrendsData(developer_id, skill_category, time_range);

    ctx.body = {
      success: true,
      data: trendsData
    };
  } catch (err) {
    console.error("获取技能趋势数据错误:", err);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: "获取技能趋势数据时发生服务器错误",
      error: err instanceof Error ? err.message : String(err)
    };
  }
}

// 获取技能关联网络数据
export async function getSkillNetwork(ctx: Context) {
  try {
    const {
      developer_id,
      min_strength = 0.5,
      max_nodes = 30
    } = ctx.request.body as {
      developer_id: string;
      min_strength?: number;
      max_nodes?: number;
    };

    if (!developer_id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "缺少开发者ID参数"
      };
      return;
    }

    // 获取技能网络数据
    const networkData = await getSkillNetworkData(developer_id, min_strength, max_nodes);

    ctx.body = {
      success: true,
      data: networkData
    };
  } catch (err) {
    console.error("获取技能网络数据错误:", err);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: "获取技能网络数据时发生服务器错误",
      error: err instanceof Error ? err.message : String(err)
    };
  }
} 