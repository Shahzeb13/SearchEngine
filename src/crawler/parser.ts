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

export function extractContent(html :string){
    const $ = cheerio.load(html)
      // Remove junk BEFORE extracting text, so it doesn't pollute content
    $('.reference').remove();        // citation superscripts like [1]
    $('table.infobox').remove();     // side info boxes
    $('table.navbox').remove();      // navigation boxes at bottom
    $('.hatnote').remove();          // "For other uses, see..." notes
    $('sup').remove();               // any remaining superscripts
    $('style, script').remove();     // just in case




    const title = $('#firstHeading').text().trim();

     const paragraphs = $('.mw-parser-output p')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(text => text.length > 0); // drop empty <p> tags

    const description = paragraphs[0] || '';
    const content = paragraphs.join('\n\n');

    return { title, description, content };

}



// so this fucntion return me title description content
// tullo na pehla bo kho mo u hashset use kavuna shi 
// id bo uuid jur kan 

