import { Frontier } from "./frontier.ts"
import { fetchPages } from "./fetcher.ts";
// const Frontier = require("./frontier.ts")
const url = "https://www.spyroinc.com/"


const frontier = Frontier();



export async function Crawl(){
// const queue = frontier.getQueue('hello');


// while(!frontier.isEmpty()){
//     // will implement here
// }

const data =await fetchPages(url);
console.log("fetched data from srouce" , data)


}

// module.exports  = {Crawl}