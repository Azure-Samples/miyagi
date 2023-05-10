import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    console.dir(request);
    const RECCOMMENDATION_SERVICE_URL = `${process.env.RECCOMMENDATION_SERVICE_URL}/personalize`
    const { body } = request
    console.log("Request body: ");
    console.dir(body)
    const res = await fetch(RECCOMMENDATION_SERVICE_URL, {
        method: 'POST',
        headers: { 'Content-type': `application/json` },
        body
    });

    const data = await res.json();

    return NextResponse.json(data);
}