import { createClient } from "@supabase/supabase-js"; // Supabase数据库客户端
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
);
export async function POST(req: NextRequest) {
  const { user_id, title, description } = await req.json();

  try {
    const { data } = await supabase
      .from('knowledge_bases')
      .insert([
        { user_id, title, description },
      ])
      .select()

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
