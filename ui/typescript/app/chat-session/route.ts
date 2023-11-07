import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const chatsUrl = `${process.env.NEXT_PUBLIC_COPILOT_CHAT_BASE_URL}/chats`
    console.log("Request body: ");
    console.dir(userId)
    const res = await fetch(chatsUrl, {
        method: 'POST',
        headers: {
            'Content-type': `application/json`
        }
    });

    const data = await res.json();
    return NextResponse.json(data);
}