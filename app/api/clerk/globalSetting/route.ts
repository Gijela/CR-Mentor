import { NextResponse } from "next/server";
import { clerkClient } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  const { userId, language } = await req.json();

  try {
    const { publicMetadata: rawData } = await clerkClient.users.getUser(userId);

    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        ...rawData,
        language
      },
    });

    return NextResponse.json({ success: true, msg: 'Save successfully ~' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, msg: 'Save failed' }, { status: 500 });
  }

}