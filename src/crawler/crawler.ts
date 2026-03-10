import { Frontier } from "./frontier.js"
import { fetchPages } from "./fetcher.js";
import { extractLinks } from "./parser.js";
import { filterPipeline, getUniqueUrls } from "./urlManager.js";
// const Frontier = require("./frontier.ts")
const url = "https://www.spyroinc.com/"


const frontier = Frontier();



export async function Crawl(){
// const queue = frontier.getQueue('hello');


// while(!frontier.isEmpty()){
//     // will implement here
// }

const html =await fetchPages(url);
// console.log("fetched data from srouce" , html)
console.log("Extracting Links")
const links = await extractLinks(html)
// console.log("Links" , links)
const filtered = filterPipeline(links);
// console.log("filtered links " , filtered )
const uniqueUrlsList = getUniqueUrls(filtered)
console.log("unique links" , uniqueUrlsList)


}


