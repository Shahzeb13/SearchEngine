import crypto from "crypto"

export function generateUUID(){
    const  uuid = crypto.randomUUID();
    return  uuid;
}