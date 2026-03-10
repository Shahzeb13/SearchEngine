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




    const filteredLinks = links.filter((link) => {


        if (link === "#" || link === "/") return false;

        const isBlockedExtension = blockedExtensions.some(ext =>
            link.endsWith(ext)
        ); 
        const isBlokedPrefix = blockedPrefixes.some((prefix) => link.startsWith(prefix));

        if (isBlockedExtension) return false;
        if (isBlokedPrefix) return false;

        return true

    });
    return filteredLinks
  
}


export function getUniqueUrls(filteredLinks: string[]) {
    const unique = [...new Set(filteredLinks)]
    return unique
}


//today i learned about pipeline pattern , guard clause pattern and separation of concerens principles