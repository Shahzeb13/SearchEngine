
export function Frontier(){

const queue : string[] = []

const  visited : Set<string>= new Set()


function enqueue(url :string){
    // if(typeof url === null || typeof url === undefined) return "Url can't be null/Undefined";
    // typeof return string remember
   if(url === null || url === undefined) return "Url Cannot be null/Undefined"
    

    queue.push(url)

    console.log("Url Pushed To the queue")

}

 function addToVisited(url : string){

    visited.add(url);

    console.log("Url Added to visited")
}

function dequeue(){
    console.log("Removing url from the queue")
    return queue.shift() // remove the first element of the array
    
}


  function isEmpty() {
    return queue.length === 0
  }

  function getQueue(secretKey : string){
    const mySecret = 'hello';
    if(secretKey === mySecret){
        return queue
    }
    else {
        return null;
    }
    
  
  }


return { 
    enqueue , dequeue , addToVisited , isEmpty ,getQueue
}




}