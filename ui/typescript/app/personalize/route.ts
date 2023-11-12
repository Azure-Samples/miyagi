import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    console.dir(request);
    const personalizeUrl = `${process.env.NEXT_PUBLIC_RECCOMMENDATION_SERVICE_URL?.replace(/\/+$/, '')}/personalize`
    const { body } = request
    console.log("Request body: ");
    console.dir(body)
    const res = await fetch(personalizeUrl, {
        method: 'POST',
        headers: { 'Content-type': `application/json` },
        duplex: 'half',
        body
    });

    const data = await res.json();

    return NextResponse.json(data);
}