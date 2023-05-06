import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const RECCOMMENDATION_SERVICE_URL = `${process.env.COPILOT_CHAT_BASE_URL}/chatSession/getAllChats/${userId}`
    console.log("Request body: ");
    console.dir(userId)
    const res = await fetch(RECCOMMENDATION_SERVICE_URL, {
        method: 'POST',
        headers: { 'Content-type': `application/json` }
    });

    const data = await res.json();
    return NextResponse.json(data);
}