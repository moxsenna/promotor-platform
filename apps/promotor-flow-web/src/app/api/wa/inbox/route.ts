import { NextResponse } from "next/server";
import { readInbox } from "@/lib/wa-inbox";

export const dynamic = "force-dynamic";

/** Daftar balasan masuk (terbaru dulu) untuk feed inbox & badge. */
export async function GET() {
  return NextResponse.json({ messages: readInbox() });
}
