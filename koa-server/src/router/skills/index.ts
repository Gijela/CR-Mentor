import Router from "@koa/router";
import * as skillsController from '../../controller/skills';

const router = new Router({
  prefix: '/developers'
});

// 技能雷达图数据接口
router.post('/dashboard/skill-radar', skillsController.getSkillRadar);

// 技能趋势数据接口
router.post('/dashboard/skill-trends', skillsController.getSkillTrends);

// 技能网络数据接口
router.post('/dashboard/skill-network', skillsController.getSkillNetwork);

export default router; 