import { NextResponse } from "next/server";
import { isAdminRequest, listAdminData } from "@/lib/server/persistent-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const data = await listAdminData();
  return NextResponse.json(data);
}
