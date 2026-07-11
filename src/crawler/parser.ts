import * as cheerio from "cheerio";


// Link extraction algorithm (no libraries)

// Scan the HTML for href=

// After href=, the value is inside quotes: "..." or '...'

// Grab what’s inside the quotes → that’s your raw link

// Convert relative links to absolute using new URL(raw, baseUrl)

// Filter out trash (mailto, tel, #, /_next, images, pdf, etc.)


export async function extractLinks(html: string ){
//  const links : string[] = [];
// const $ = cheerio.load(html);
//load return a special fucniton 
// $("a[href]").

//  const hrefRegex = /href\s*=\s*["']([^"']+)["']/gi

  if (!html) {
        console.error("HTML cannot be null/undefined");
        return [];
    }

    const $ = cheerio.load(html);//load return specail function that can be used to find any tag in html tree constructed by cheeio
    const links: string[] = [];

    $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        if (href) {
            links.push(href);
        }
    });

    return links;


// let match : RegExpExecArray | null;


    // while((match = hrefRegex.exec(html)) !== null){
    //     // console.log(match[0]);
    //     // console.log(match[1]);
    
    //     saveLinks(match[1]  , links)


// }


// console.log("LInks" , links)

    // return links
        


}


function saveLinks(match : string  | undefined, links : string[]){
    if(match !== undefined){
             links.push(match)
    
        }
        // console.log(links)

}