// export interface CrawledPage {
//   id: string;              // unique id (can be a hash of the URL, or just the URL itself)
//   url: string;              // canonical URL (normalized, no fragment/query)
//   title: string;             // page title
//   description: string;       // short summary — first paragraph or meta description
//   content: string;           // full extracted body text (for indexing)
//   links: string[];           // outgoing links found on this page (useful for link-based ranking later, e.g. PageRank)
//   wordCount: number;         // handy for ranking/debugging
//   crawledAt: string;         // ISO timestamp of when you crawled it
//   depth: number;             // BFS depth from your seed URL — useful metadata
// }


export interface CrawledPage {
  uuid: string;              // unique id (can be a hash of the URL, or just the URL itself)
               // canonical URL (normalized, no fragment/query)
  title: string;             // page title
  description: string;       // short summary — first paragraph or meta description
  content: string;    
  currentUrl: string       // full extracted body text (for indexing)
    // BFS depth from your seed URL — useful metadata
}
