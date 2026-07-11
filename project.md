# SearchEngine — Semester Project Competition Guide

## Current State

You have a working **BFS web crawler** in TypeScript that:
- Fetches pages via axios
- Extracts links via regex
- Filters and deduplicates URLs
- Converts relative URLs to absolute
- Runs sequentially (one URL at a time)

**What's missing:** Indexer, storage, search, and UI — the parts that judges actually care about.

---

## What Judges Look For in a DSA Project

| Criteria | Weight |
|---|---|
| **Working demo** — runs end-to-end | Highest |
| **DSA concepts visibly applied** | High |
| **Code quality & architecture** | Medium |
| **UI polish / presentation** | Medium |
| **Uniqueness / ambition** | Medium |

A crawler alone won't win. The search engine — **indexing, ranking, and retrieval** — is where DSA shines.

---

## Recommended Architecture

```
User (Browser)
    │
    ▼
┌─────────────────┐     ┌─────────────────────┐
│   Frontend UI   │────▶│   Express API       │
│  (React/Vanilla)│◀────│   (search endpoint) │
└─────────────────┘     └────────┬────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────┐
│           Indexer (build phase)         │
│  Inverted Index  │  TF-IDF  │  Ranking  │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│        SQLite Database (better-sqlite3) │
│  pages  │  terms  │  term_frequencies   │
└─────────────────────────────────────────┘
         ▲
         │
┌────────┴────────┐
│    Crawler      │ (already built — feed it to indexer)
└─────────────────┘
```

---

## Implementation Plan (Priority Order)

### Phase 1: Content Extraction + SQLite Storage (Day 1)

**Why first:** Without stored content, you can't search. This unblocks everything.

#### 1a. Fix Parser to Use Cheerio

`cheerio` is already installed but unused. Replace the regex-based link extractor with proper DOM parsing and extract **page content**:

```
Parse: cheerio.load(html)
Extract:
  - title: $('title').text()
  - headings: $('h1, h2, h3').map() → text
  - paragraphs: $('p').map() → text
  - meta description: $('meta[name="description"]').attr('content')
  - links: $('a[href]').map() → href values
```

**DSA angle:** Tokenization + stemming — apply `Map/Reduce` pattern for word frequency counting.

#### 1b. Add SQLite via better-sqlite3

```
npm install better-sqlite3
npm install -D @types/better-sqlite3
```

Schema:

```sql
CREATE TABLE pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT UNIQUE NOT NULL,
  title TEXT,
  content TEXT,           -- raw parsed text
  meta_description TEXT,
  crawl_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE terms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  term TEXT UNIQUE NOT NULL
);

CREATE TABLE term_frequency (
  term_id INTEGER NOT NULL,
  page_id INTEGER NOT NULL,
  frequency INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (term_id, page_id),
  FOREIGN KEY (term_id) REFERENCES terms(id),
  FOREIGN KEY (page_id) REFERENCES pages(id)
);
```

**DSA angle:** This schema is a direct implementation of an **inverted index** — the core data structure of information retrieval. The `term_frequency` table maps each term → set of documents it appears in.

---

### Phase 2: Inverted Index + TF-IDF Ranking (Day 2)

**Why second:** This is the DSA heart of the project. Winning projects show sophisticated data structures.

#### 2a. Text Processing Pipeline

```
raw text → lowercasing → tokenize (split on non-alpha)
         → remove stop words (the, a, an, is, are, was...)
         → stemming (Porter stemmer — implement yourself or port one)
         → compute TF-IDF
```

**DSA concepts on display:**
- **HashMaps** (`Map<string, Map<number, number>>`) for the inverted index
- **Sorting algorithms** for ranking results
- **Trie (Prefix Tree)** for auto-complete suggestions

#### 2b. TF-IDF Implementation

```
TF(term, page) = frequency of term in page / total words in page
IDF(term) = log(total pages / number of pages containing term)
TF-IDF = TF × IDF
```

**Why it matters:** TF-IDF is the classic DSA + math combo. Implement it **from scratch** (no libraries) to show you understand it.

#### 2c. Inverted Index in Memory (build phase)

```typescript
class InvertedIndex {
  // term → Map<pageId, tfidfScore>
  private index: Map<string, Map<number, number>>;

  build(pages: Page[]): void {
    // 1. For each page, tokenize and count term frequencies
    // 2. For each term, compute IDF across all pages
    // 3. Store term → (pageId → TF-IDF score)
  }

  search(query: string): Page[] {
    // 1. Tokenize query
    // 2. Look up each term in the index
    // 3. Aggregate scores per page (sum of TF-IDF for matching terms)
    // 4. Sort by score descending → return top K
  }
}
```

---

### Phase 3: Search API (Day 2-3)

A simple Express server that:
- `GET /search?q=query` — returns ranked results
- `GET /suggest?q=part` — auto-complete using a Trie
- `GET /` — serves the frontend

```
npm install express
npm install -D @types/express
```

---

### Phase 4: Frontend UI (Day 3)

**Keep it simple but polished.** Judges love visually clean demos.

#### Option A: Vanilla HTML + CSS (Recommended for speed)

Single `index.html` served by Express. Use a minimal, Google-inspired design:

```
┌──────────────────────────────────────┐
│           🔍 SearchEngine            │
│  ┌──────────────────────────────┐    │
│  │ search query here...         │ ▶  │
│  └──────────────────────────────┘    │
│                                      │
│  Results (10 per page):              │
│  ┌────────────────────────────────┐  │
│  │ Title ← clickable link         │  │
│  │ URL (small, green)             │  │
│  │ Snippet: ...matching text...   │  │
│  │ Score: 0.873                   │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ ...more results...             │  │
│  └────────────────────────────────┘  │
│                                      │
│  Pagination: ◀ 1 2 3 ... 10 ▶      │
└──────────────────────────────────────┘
```

Add these to impress:
- **Loading spinner** during search
- **Auto-complete dropdown** as user types (powered by Trie)
- **Highlight matching terms** in result snippets
- **Dark mode toggle** (super easy to add)

#### Option B: React (if you have time)

More impressive but more setup. Not necessary unless you're comfortable with it.

---

### Phase 5: Polish & Competition Prep (Day 4)

#### Must-have for competition:

1. **Auto-complete dropdown** — powered by a **Trie**. Shows top-5 suggestions as you type.
2. **"No results" handling** — friendly message, suggestions
3. **Search stats** — "Found 42 results in 0.03s"
4. **README.md** that explains:
   - How to run it
   - Architecture diagram
   - DSA concepts used: inverted index, TF-IDF, Trie, BFS (crawler)
   - What you'd add next

#### Nice-to-haves:

5. **PageRank** — simulate by counting inbound links during crawl; multiply TF-IDF score by PageRank
6. **Crawl progress dashboard** — real-time stats (pages crawled, queue size, errors)
7. **Search within results** — filter by domain or date
8. **Export data** — download index as JSON

---

## DSA Concepts to Highlight (for Judges)

| DSA Concept | Where You Use It | Why It's Impressive |
|---|---|---|
| **BFS (Graph Traversal)** | Crawler explores the web graph | Classic graph algorithm in action |
| **Inverted Index** | Maps terms → documents | Core of all search engines |
| **TF-IDF** | Ranks results by relevance | Information retrieval math |
| **Trie (Prefix Tree)** | Auto-complete suggestions | O(k) lookup, shows you know trees |
| **HashSet/HashMap** | Visited URLs, inverted index | Efficient O(1) operations |
| **Priority Queue** | (Optional) crawl prioritization | Better than a simple FIFO |
| **B-Tree** | SQLite index internally | Mention that SQLite uses B-Trees |
| **Sorting** | Ranking results by score | MergeSort or QuickSort in action |

---

## Project Structure (Final)

```
SearchEngine/
├── src/
│   ├── index.ts                 ← entry point (CLI or server)
│   ├── crawler/                 ← already built
│   │   ├── crawler.ts
│   │   ├── fetcher.ts
│   │   ├── frontier.ts
│   │   ├── parser.ts            ← upgrade to use cheerio
│   │   ├── urlManager.ts
│   │   └── types/
│   ├── indexer/                 ★ NEW — the DSA star
│   │   ├── indexer.ts           ← inverted index builder
│   │   ├── tokenizer.ts         ← tokenize + stem + stop words
│   │   ├── tfidf.ts             ← TF-IDF computation
│   │   └── trie.ts              ← auto-complete trie
│   ├── database/
│   │   ├── schema.ts            ← SQLite setup + migrations
│   │   └── query.ts             ← search queries
│   ├── server/
│   │   ├── app.ts               ← Express server
│   │   └── routes.ts            ← API endpoints
│   ├── ui/
│   │   └── public/
│   │       ├── index.html       ← search page
│   │       ├── style.css
│   │       └── app.js           ← frontend logic
│   └── utils/
│       └── lockDomain.ts
├── package.json
└── tsconfig.json
```

---

## How to Demo It (Winning the Presentation)

### The Script

1. **Start the server** — `npm run dev` (tsx watch)
2. **Show the UI** — a clean search page
3. **Search for something** — type "quantum physics"
4. **Show auto-complete** — as you type, suggestions appear
5. **Show results** — ranked, with snippets and scores
6. **Click a result** — opens the actual page
7. **Show the crawler log** — show that it actually crawled the web
8. **Search again** — "mars exploration" — results are different & relevant

### What to Say

- *"This is a full-text search engine. I built: a BFS web crawler, an inverted index using hash maps, TF-IDF scoring for ranking, a Trie for auto-complete, and a SQLite-backed database."*
- *"The crawler discovered [N] pages. The indexer processed [M] unique terms. Search returns results in ~[X]ms."*
- *"If I had more time, I'd add PageRank for link analysis and a spell checker using Levenshtein distance."*

---

## Quick Start (For Your README)

```bash
# Install
npm install
npm install better-sqlite3 express
npm install -D @types/better-sqlite3 @types/express

# Run crawler + indexer
npm run build-index

# Start search server
npm run start
```

Add these scripts to `package.json`:
```json
"scripts": {
  "crawl": "tsx src/index.ts",
  "build-index": "tsx src/indexer/indexer.ts",
  "start": "tsx src/server/app.ts",
  "dev": "concurrently \"tsx watch src/server/app.ts\"",
  "typeCheck": "tsc --noEmit"
}
```

---

## Final Checklist Before Competition

- [ ] Crawler saves pages to SQLite (not just console.log)
- [ ] Indexer builds inverted index from stored pages
- [ ] TF-IDF ranking is working
- [ ] Trie auto-complete works on the search box
- [ ] UI is clean and responsive
- [ ] Search returns correct, ranked results
- [ ] README.md explains DSA concepts clearly
- [ ] Demo script practiced and timed (< 5 min)
- [ ] Error cases handled (no results, server down, etc.)
- [ ] Dark mode toggle (impresses non-technical judges)

---

## Summary

| What | Why It Wins |
|---|---|
| **Inverted Index** | Classic DSA — every judge recognizes it |
| **TF-IDF** | Shows you understand information retrieval math |
| **Trie Auto-complete** | Polished UX + tree data structure |
| **SQLite** | Persistence — practical engineering |
| **Clean UI** | First impression matters |
| **Working Demo** | Most teams have broken or partial demos |

**You already have a working crawler. That's more than most teams. Add the indexer + SQLite + UI, and you'll have a complete, impressive project.**
