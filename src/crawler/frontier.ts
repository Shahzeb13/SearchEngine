
export function Frontier(){

const queue : string[] = []

const  visited : Set<string>= new Set()


function enqueue(url :string){
    if(typeof url === null || typeof url === undefined) return "Url can't be null/Undefined";
   
    
    queue.push(url)

    console.log("Url Pushed To the queue")

}

 function addToVisited(url : string){

    visited.add(url);

    console.log("Url Added to visited")
}

function dequeue(){
    queue.shift() // remove the first element of the array
    console.log("Url removed from the queue")
}


  function isEmpty() {
    return queue.length === 0
  }


return { 
    enqueue , dequeue , addToVisited , queue
}




}