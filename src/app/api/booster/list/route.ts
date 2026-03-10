import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const ephemeralDir = path.join(process.cwd(), "src/data/boosters/ephemeral");

        if (!fs.existsSync(ephemeralDir)) {
            return NextResponse.json({ success: true, boosters: [] });
        }

        const folders = fs.readdirSync(ephemeralDir);
        const boosters = [];

        for (const folder of folders) {
            const jsonPath = path.join(ephemeralDir, folder, "links.json");
            if (fs.existsSync(jsonPath)) {
                try {
                    const content = fs.readFileSync(jsonPath, "utf-8");
                    const config = JSON.parse(content);
                    boosters.push({
                        id: folder,
                        label: config.name,
                        color: config.color,
                        cost: config.cost,
                        // Generate dark/light from color if not present or just placeholders
                        dark: config.color, // Ideally would compute this
                        light: config.color,
                        category: 'ephemeral',
                        icon: config.icon,
                        description: config.description
                    });
                } catch (e) {
                    console.error(`Error reading booster config for ${folder}:`, e);
                }
            }
        }

        return NextResponse.json({ success: true, boosters });
    } catch (error) {
        console.error("Failed to list boosters:", error);
        return NextResponse.json({ success: false, error: "Failed to list boosters" }, { status: 500 });
    }
}
