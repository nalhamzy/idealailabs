import { NextResponse } from "next/server";
import {
  isAdminRequest,
  updateLead,
  type LeadStatus,
} from "@/lib/server/persistent-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const lead = await updateLead(id, {
    status: body.status as LeadStatus | undefined,
    priority: body.priority,
    assignedTo: body.assignedTo,
    note: body.note,
    author: body.author,
  });

  if (!lead) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ lead });
}
