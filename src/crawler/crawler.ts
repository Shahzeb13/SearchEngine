import { Frontier } from "./frontier.ts"
import { fetchPages } from "./fetcher.ts";
import { extractLinks } from "./parser.ts";
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
await extractLinks(html)

}

// module.exports  = {Crawl}