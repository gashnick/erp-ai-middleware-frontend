import { type NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3000";

async function proxyRequest(request: NextRequest): Promise<NextResponse> {
  const { pathname, search } = request.nextUrl;

  // Strip the /api prefix to get the actual backend path
  const backendPath = pathname.replace(/^\/api/, "");
  const targetUrl = `${API_BASE_URL}${backendPath}${search}`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("host");

  let body: BodyInit | undefined;
  const method = request.method;
  if (method !== "GET" && method !== "HEAD") {
    body = await request.text();
  }

  try {
    const response = await fetch(targetUrl, {
      method,
      headers: requestHeaders,
      body,
      // Do not follow redirects — pass them through
      redirect: "manual",
    });

    const responseBody = await response.text();
    const responseHeaders = new Headers();

    // Forward safe response headers
    const FORWARDED_HEADERS = ["content-type", "cache-control", "x-request-id"];
    FORWARDED_HEADERS.forEach((header) => {
      const value = response.headers.get(header);
      if (value) responseHeaders.set(header, value);
    });

    return new NextResponse(responseBody, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[BFF] Proxy error:", error);
    return NextResponse.json(
      { statusCode: 502, message: "Backend unavailable" },
      { status: 502 },
    );
  }
}

export async function GET(request: NextRequest) {
  return proxyRequest(request);
}

export async function POST(request: NextRequest) {
  return proxyRequest(request);
}

export async function PATCH(request: NextRequest) {
  return proxyRequest(request);
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request);
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request);
}
