import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_KEY!
const SUPABASE_BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME!

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const folderName = formData.get('folderName') as string;

  if (!file || !folderName) {
    return NextResponse.json({ message: 'file or folderName is required', success: false }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const fileContent = new Uint8Array(arrayBuffer);
    const fileName = file.name;

    const { data } = await supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .upload(`${folderName}/${fileName}`, fileContent)

    return NextResponse.json({ message: 'upload success', success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error, success: false, data: {} }, { status: 502 });
  }
}