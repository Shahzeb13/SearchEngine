export function filterPipeline(links: string[]) {
    const blockedPrefixes = [
        "mailto:",
        "tel:",
        "/admin",
        "/_next",
        "/favicon"
    ];

    const blockedExtensions = [
        ".png",
        ".jpg",
        ".jpeg",
        ".svg",
        ".webp",
        ".css",
        ".js",
        ".pdf"
    ];

    const cleaned = links.map(link => link.split("#")[0]!).filter(link => {
        if (!link || link === "/") return false;

        const isBlockedExtension = blockedExtensions.some(ext => link.endsWith(ext));
        const isBlockedPrefix = blockedPrefixes.some(prefix => link.startsWith(prefix));

        if (isBlockedExtension) return false;
        if (isBlockedPrefix) return false;

        return true;
    });

    return cleaned;
}


export function getUniqueUrls(filteredLinks: string[]) {
    const unique = [...new Set(filteredLinks)]
    return unique
}


//today i learned about pipeline pattern , guard clause pattern and separation of concerens principles

export function convertIntoAbsoluteUrls(uniqueLinks : string[] , baseUrl : string){


    const absoluteURLs = uniqueLinks.map((link) => {
        return new URL(link, baseUrl).href
    })

    return absoluteURLs

}


export function isValidArticleUrl(url: string, seedDomain: string): boolean {
    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        return false;
    }

    // 1. Same domain only
    if (parsed.hostname !== seedDomain) return false;

    // 2. Only /wiki/ article links
    if (!parsed.pathname.startsWith("/wiki/")) return false;

    // 3. No query parameters
    if (parsed.search !== "") return false;

    // 4. No namespace pages (colon after /wiki/)
    const pageTitle = parsed.pathname.slice("/wiki/".length);
    if (pageTitle.includes(":")) return false;

    // 5. No fragments — already handled by checking the base URL,
    //    but reject outright if somehow a fragment-only URL sneaks in

    // 6. No fake protocols — new URL() already rejects non-http(s),
    //    so if we got here it's valid

    return true;
}

interface CrawledPage {
  id: string;              // unique id (can be a hash of the URL, or just the URL itself)
  url: string;              // canonical URL (normalized, no fragment/query)
  title: string;             // page title
  description: string;       // short summary — first paragraph or meta description
  content: string;           // full extracted body text (for indexing)
  links: string[];           // outgoing links found on this page (useful for link-based ranking later, e.g. PageRank)
  wordCount: number;         // handy for ranking/debugging
  crawledAt: string;         // ISO timestamp of when you crawled it
  depth: number;             // BFS depth from your seed URL — useful metadata
}


// ┌─────────────┐         ┌──────────────┐         ┌─────────────┐
// │   Crawler    │  writes │              │  reads  │ Query Engine │
// │  (run once,  │────────▶│  crawl.db    │────────▶│ (run anytime,│
// │  or on-demand)│        │  (SQLite)    │         │  builds Trie  │
// └─────────────┘         └──────────────┘         │  in-memory)   │
//                                                     └─────────────┘