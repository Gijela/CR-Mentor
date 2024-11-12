import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_KEY!;
const SUPABASE_BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function POST(req: Request) {
  try {
    const { folderName, fileName } = await req.json();
    console.log("🚀 ~ download ~ folderName, fileName:", folderName, fileName)

    const { data, error } = await supabase
      .storage
      .from(SUPABASE_BUCKET_NAME)
      .download(`${folderName}/${fileName}`);

    console.log("🚀 ~ download ~ error:", error)
    console.log("🚀 ~ download ~ data:", data)

    if (error) {
      console.log('下载文件erorr => ', error)
    }

    const text = await data.text();
    return NextResponse.json({ message: 'success', data: { text } }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: error.message, success: false, data: {} }, { status: 502 });
  }
}