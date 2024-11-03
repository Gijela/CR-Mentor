import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_KEY!
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function POST(req: Request) {
  const { repo_fullName } = await req.json();

  try {
    const { data, error } = await supabase
      .from('repoName_file')
      .select('*')
      .eq('repo_fullName', repo_fullName);
    console.log("🚀 ~ getRepoFile ~ data:", data)
    console.log("🚀 ~ getRepoFile ~ error:", error)

    return NextResponse.json({ success: true, msg: '获取对应文件成功', data: data[0] || {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, msg: '获取对应文件失败' }, { status: 500 });
  }
}