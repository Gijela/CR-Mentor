import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_KEY!
const SUPABASE_BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME!

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function POST(req: Request) {
  const { folderName } = await req.json();

  try {
    const { data } = await supabase
      .storage
      .from(SUPABASE_BUCKET_NAME)
      .list(folderName, {
        limit: 10,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      })

    return NextResponse.json({ message: 'success', data, success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error, success: false, data: [] }, { status: 502 });
  }
}