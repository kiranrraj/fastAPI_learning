// app/api/v1/portlets/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(request: NextRequest) {
    const auth = request.headers.get("authorization");
    const cookie = request.headers.get("cookie") || "";

    const resp = await fetch(`${BACKEND}/api/v1/portlets`, {
        headers: {
            ...(auth ? { Authorization: auth } : {}),
            Cookie: cookie,
        },
        credentials: "include",
    });

    // If FastAPI returns 404, it will be forwarded here.
    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
}

export async function POST(request: NextRequest) {
    const auth = request.headers.get("authorization");
    const body = await request.json();

    const resp = await fetch(`${BACKEND}/api/v1/portlets`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(auth ? { Authorization: auth } : {}),
        },
        credentials: "include",
        body: JSON.stringify(body),
    });

    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
}
