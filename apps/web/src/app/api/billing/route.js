import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/api-base-url";

export async function POST(request) {
  try {
    const payload = await request.json();

    const response = await fetch(`${getApiBaseUrl()}/billing/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      cache: "no-store"
    });
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to create the billing session." },
      { status: 500 }
    );
  }
}
