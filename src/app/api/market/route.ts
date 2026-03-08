import { NextResponse } from "next/server";
import { generateMarketSelection } from "@/lib/wiki";

export async function GET() {
    try {
        const cards = await generateMarketSelection(6);
        return NextResponse.json({ success: true, cards });
    } catch (error) {
        console.error("Failed to generate market selection:", error);
        return NextResponse.json({ success: false, error: "Failed to generate market selection" }, { status: 500 });
    }
}
