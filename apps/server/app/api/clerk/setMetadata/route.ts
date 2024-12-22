import { NextResponse } from "next/server";
import { clerkClient } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  const { installationId, userId } = await req.json();

  try {
    // 保存 installationId 到 clerk 中
    const client = await clerkClient()
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { installationId },
    })

    return NextResponse.json({ success: true, msg: 'Save successfully ~' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, msg: 'Save failed' }, { status: 500 });
  }

}