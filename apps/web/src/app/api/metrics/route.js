import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/api-base-url";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(`${getApiBaseUrl()}/metrics`, {
      cache: "no-store"
    });
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to reach the API service." },
      { status: 500 }
    );
  }
}
