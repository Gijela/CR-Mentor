import { NextResponse } from "next/server";
import { clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function POST(req: Request) {
  const { github_id } = await req.json();
  console.log("🚀 ~ POST ~ github_id:", github_id)

  try {
    const { data } = await supabase
      .from('githubId_clerkId')
      .select('*')
      .eq('github_id', github_id)

    const clerk_id = data[0].clerk_id
    const { publicMetadata } = await clerkClient.users.getUser(clerk_id);
    return NextResponse.json({ success: true, data: publicMetadata }, { status: 200 });

  } catch (error) {
    console.log("🚀 ~ getMetadata ~ error:", error)
    return NextResponse.json({ success: false, data: {}, msg: error }, { status: 500 });
  }
}