import { DocumentChunk } from "@/components/KnowledgeBase/EditChunks";
import { createClient } from "@supabase/supabase-js"; // Supabase数据库客户端
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { kb_id } = await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
  );

  try {

    let { data }: { data: DocumentChunk[] } = await supabase
      .from('kb_chunks')
      .select('*')
      .eq('kb_id', kb_id)
      .order('created_at', { ascending: false })

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
