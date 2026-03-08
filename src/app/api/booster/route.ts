import { NextResponse } from "next/server";
import { generateBoosterPack } from "@/lib/wikipedia";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const theme = searchParams.get("theme") || undefined;

        let customTitles: string[] | undefined = undefined;

        if (theme) {
            const ephemeralJsonPath = path.join(process.cwd(), "src/data/boosters/ephemeral", theme, "links.json");

            if (fs.existsSync(ephemeralJsonPath)) {
                try {
                    const content = fs.readFileSync(ephemeralJsonPath, "utf-8");
                    const config = JSON.parse(content);
                    customTitles = config.links || [];
                } catch (e) {
                    console.error(`Error loading ephemeral booster config ${theme}:`, e);
                }
            }
        }

        const cards = await generateBoosterPack(5, theme, customTitles);
        return NextResponse.json({ success: true, cards });
    } catch (error) {
        console.error("Failed to generate booster:", error);
        return NextResponse.json({ success: false, error: "Failed to generate booster" }, { status: 500 });
    }
}
