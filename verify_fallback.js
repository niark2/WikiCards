
console.log("Verify manual implementation of the new logic...");

const WIKI_API_URL = "https://en.wikipedia.org/w/api.php";
const USER_AGENT = "WikiCards/1.0 (test@example.com)";

async function fetchFallbackImage(imageTitles) {
    if (!imageTitles || imageTitles.length === 0) return null;

    const excludedKeywords = [
        "red pog", "blue pog", "green pog", "yellow pog", "white pog", "black pog",
        "commons-logo", "question book", "ambox", "edit-clear", "magnifying glass",
        "wikisource-logo", "wikibooks-logo", "wikiquote-logo", "wiktionary-logo",
        "wikimedia-logo", "folder hexagonal", "symbol", "stub", "icon", "arrow",
        "increase", "decrease", "portal-puzzle", "star", "padlock", "discourse",
        "wikimedia", "magnifying", "search", "increase", "decrease", "padlock"
    ];

    const filtered = imageTitles.filter(title => {
        const lower = title.toLowerCase();
        return !excludedKeywords.some(keyword => lower.includes(keyword));
    });

    if (filtered.length === 0) return null;

    const sorted = [...filtered].sort((a, b) => {
        const keywords = ["map", "location", "photo", "flag", "landscape", "portrait"];
        const aScore = keywords.findIndex(k => a.toLowerCase().includes(k));
        const bScore = keywords.findIndex(k => b.toLowerCase().includes(k));

        if (aScore !== -1 && bScore !== -1) return aScore - bScore;
        if (aScore !== -1) return -1;
        if (bScore !== -1) return 1;
        return 0;
    });

    const candidates = sorted.slice(0, 3);
    console.log("Candidates:", candidates);
    const titlesParam = candidates.map(t => encodeURIComponent(t)).join('|');
    const url = `${WIKI_API_URL}?action=query&titles=${titlesParam}&prop=imageinfo&iiprop=url&iiurlwidth=1000&format=json&origin=*`;

    try {
        const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
        const data = await res.json();
        const pages = data.query?.pages || {};

        const results = Object.values(pages);
        for (const title of candidates) {
            const page = results.find(p => p.title === title);
            if (page?.imageinfo?.[0]?.thumburl) return page.imageinfo[0].thumburl;
            if (page?.imageinfo?.[0]?.url && !page.imageinfo[0].url.endsWith(".svg")) return page.imageinfo[0].url;
        }
    } catch (e) {
        console.error("Error fetching fallback image info:", e);
    }
    return null;
}

async function test() {
    const images = [
        "File:Flag of Oklahoma.svg",
        "File:Map of Oklahoma highlighting Pittsburg County.svg",
        "File:Red pog.svg",
        "File:USA Oklahoma location map.svg",
        "File:Usa edcp location map.svg"
    ];

    const imageUrl = await fetchFallbackImage(images);
    console.log("Resulting Image URL:", imageUrl);
}

test();
