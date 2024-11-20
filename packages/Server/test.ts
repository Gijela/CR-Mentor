import dotenv from 'dotenv';

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import codeReviewRouter from './src/github/codeReview';

const app = new Koa();
// 加载环境变量
dotenv.config();

// 使用中间件
app.use(bodyParser());

// 注册路由
app.use(codeReviewRouter.routes());
app.use(codeReviewRouter.allowedMethods());

// 启动服务器
app.listen(3560, () => {
  console.log(`服务器运行在 http://localhost:3560`);
});
