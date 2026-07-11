export function LockMyDomain(url : string){
    try{
         const parsed = new URL(url);
    console.log("Hostname" , parsed.hostname);
        const host = parsed.hostname;
        const isEnglishWekipedia = host === "en.wikipedia.org";

        
    if(!isEnglishWekipedia){
        console.log(`Domain leakage detected at ${url}`);
        return false;
    }
    return true;
    }
    catch(e : any){
        console.log(`Error Parsing the Url ${url} : ${e.message}`);
        return false;
    }
   


}