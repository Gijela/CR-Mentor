import { locales } from "./lib/i18n";
import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 处理 API 请求的 CORS
  if (pathname.startsWith("/api")) {
    const response = NextResponse.next();

    // 设置 CORS 头
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );

    // 处理 OPTIONS 预检请求
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: response.headers,
      });
    }

    return response;
  }

  // 处理语言路由重定向
  const isExit = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (isExit) return;

  request.nextUrl.pathname = `/`;
  return Response.redirect(request.nextUrl);
}

// 更新 matcher 配置以确保中间件能处理所有需要的路由
export const config = {
  matcher: [
    // API 路由
    "/api/:path*",
    // 静态资源和其他路由
    "/((?!_next)(?!.*\\.(?:ico|png|gif|svg|jpg|jpeg|xml|txt|mp4)$)(?!/api).*)",
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
