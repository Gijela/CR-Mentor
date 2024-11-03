import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";
import { clerkClient } from '@clerk/nextjs/server'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_KEY!
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function POST(req: Request) {
  const { repo_fullName, folder_name, file_name } = await req.json();

  // const userId = folder_name // 上传文件时，用 clerk 的 id 作为文件夹名字
  // 
  // const { publicMetadata } = await clerkClient.users.getUser(userId);
  // const github_accessToken = publicMetadata.accessToken;

  try {
    const { data } = await supabase
      .from('repoName_file')
      .insert({ repo_fullName, folder_name, file_name })
      .select('*')

    console.log("🚀 ~ 保存仓库名和代码规范文件的关系 ~ data:", data);

    return NextResponse.json({ success: true, msg: '保存仓库与规范文件关系成功' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, msg: '保存仓库与规范文件关系失败' }, { status: 500 });
  }
}