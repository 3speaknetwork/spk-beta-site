import { CeramicClient } from '@ceramicnetwork/http-client'
import { useContext, createContext } from 'react'


class CeramicContextClass { 
    
    constructor() {
        this.Ceramic = new CeramicClient('https://d12-b-ceramic.3boxlabs.com/');
    }

}
export const CeramicInstance = new CeramicContextClass();

export const CeramicContext =  createContext(CeramicInstance);


export function useCeramic() {
    const ac = useContext(CeramicContext)

    return {
        Ceramic: ac.Ceramic
    }
}