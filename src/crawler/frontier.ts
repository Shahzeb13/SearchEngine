import { LockMyDomain } from "../utils/lockDomain.ts";

export function Frontier() {

  const queue: string[] = []

  const visited: Set<string> = new Set()


  function enqueue(url: string) {
    if (url === null || url === undefined) return;
    
    // Simple duplicate check: don't add if already visited or in queue
    if (visited.has(url) || queue.includes(url)) {
      console.log("Already Visited or Already Waiting in Queue");
      return
    };
   

    queue.push(url);
    console.log(`Url Pushed To Queue: ${url}`);
  }

  function hasVisited(url: string) {
    return visited.has(url);
  }

  function addToVisited(url: string) {

    visited.add(url);

    console.log("Url Added to visited")
    console.log("Logging Visited :" , visited)
  }

  function dequeue() {
    console.log("Removing url from the queue ( Means we will visit this current url")
    return queue.shift() // remove the first element of the array

  }


  function isEmpty() {
    return queue.length === 0
  }

  function getQueue(secretKey: string) {
    const mySecret = 'hello';
    if (secretKey === mySecret) {
      return queue
    }
    else {
      return null;
    }


  }


  return {
    enqueue, dequeue, addToVisited, isEmpty, getQueue, hasVisited
  }




}