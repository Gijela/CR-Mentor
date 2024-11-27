import { createClient } from "@supabase/supabase-js"; // Supabase数据库客户端
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
);

export async function POST(req: NextRequest) {
  const { id, user_id, title, description } = await req.json();
  try {

    let { data } = await supabase
      .from('knowledge_bases')
      .update({
        title,
        description,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user_id)

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
