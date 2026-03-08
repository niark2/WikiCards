// --- Barrel file: re-exports everything for backward compatibility ---
// Consumers can keep importing from "@/lib/wiki" or "@/lib/wikipedia"

export { parseWikipediaIdentifier } from "./utils";
export { fetchArticleDetails, fetchWikiArticle } from "./api";
export { generateBoosterPack } from "./booster";
export { generateMarketSelection } from "./market";
