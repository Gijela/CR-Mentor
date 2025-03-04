import { createClient } from "@supabase/supabase-js"; // Supabase数据库客户端
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const { user_id } = await req.json();
  try {


    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!,
    );

    let { data } = await supabase
      .from('knowledge_bases')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
