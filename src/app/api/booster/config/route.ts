import { NextResponse } from "next/server";
import ussrLinks from "@/data/boosters/ephemeral/ussr/links.json";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const theme = searchParams.get("theme");

        if (theme === "ussr") {
            return NextResponse.json({
                success: true,
                config: {
                    cost: ussrLinks.cost,
                    color: ussrLinks.color,
                    name: ussrLinks.name
                }
            });
        }

        return NextResponse.json({ success: false, error: "Theme not found" }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch config" }, { status: 500 });
    }
}
