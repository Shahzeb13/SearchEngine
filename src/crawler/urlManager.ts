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


    // /wiki/Cat#History becomes /wiki/  ua necha wali line link.splite("#")[0] ek array return karti ha but us links
    //ma sa# ka bad wali shit remove kr deti hain
    const cleaned = links.map(link => link.split("#")[0]!).filter(link => {
        if (!link || link === "/") return false;

        const isBlockedExtension = blockedExtensions.some(ext => link.endsWith(ext));
        const isBlockedPrefix = blockedPrefixes.some(prefix => link.startsWith(prefix));

        if (isBlockedExtension) return false;
        if (isBlockedPrefix) return false;

// any link that isn't an email/phone/admin/internal-asset/junk link — so a pretty wide net at this stage, including stuff like:

// /wiki/Cat — actual article links (what you want)
// /wiki/Category:Mammals — namespace/category pages (still gets through here, since : filtering happens later in isValidArticleUrl, not here)
// /w/index.php?title=Cat&action=edit — MediaWiki special pages, edit links, etc.
// https://en.wikipedia.org/wiki/Dog — full absolute URLs, if any snuck in
// //upload.wikimedia.org/... — protocol-relative links (not blocked, since they don't match your prefixes)
// /wiki/Special:Random — special pages
// Query-param links like /wiki/Cat?oldid=12345 — allowed through here, since query rejection only happens in isValidArticleUrl
        return true;
    });

    return cleaned; // stirng array 
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



// ┌─────────────┐         ┌──────────────┐         ┌─────────────┐
// │   Crawler    │  writes │              │  reads  │ Query Engine │
// │  (run once,  │────────▶│  crawl.db    │────────▶│ (run anytime,│
// │  or on-demand)│        │  (SQLite)    │         │  builds Trie  │
// └─────────────┘         └──────────────┘         │  in-memory)   │
//                                                     └─────────────┘