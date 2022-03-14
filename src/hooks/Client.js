import { useContext, createContext, useEffect, useState, useCallback } from 'react'
import { SpkClient } from '@spknetwork/graph-client'
import {CeramicInstance} from './Ceramic'



class ClientContextClass { 
    
    constructor() {
        this.client = new SpkClient('https://us-01.infra.3speak.tv', CeramicInstance.Ceramic)
    }

}
export const ClientInstance = new ClientContextClass();

export const ClientContext =  createContext(CeramicInstance);


export function useClient() {
    const ac = useContext(ClientContext)

    return {
        Client: ac.client
    }
}

export function GetUserDocs(userDid) {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        ;(async () => {
            if(userDid) {
                const output = await ClientInstance.client.getDocumentsForUser(userDid, 1, 100)
                setPosts(output);
            }
        })();
    }, [userDid])

    return {
        posts
    }
}

export function GetChildDocs(streamId) {
    const [posts, setPosts] = useState()
    useEffect(() => {
        ;(async () => {
            const output = await ClientInstance.client.getDocumentChildren(streamId)
            setPosts(output);
        })();
    }, [streamId])

    return {
        posts
    }
}

export function GetFeedPosts() {
    const [posts, setPosts] = useState()
    console.log(ClientInstance.client)
    useEffect(() => {
        ;(async () => {
            const output = await ClientInstance.client.getFeedDocs()
            setPosts(output);
        })();
    }, [])
    
    return {
        posts
    }

}
export function UserActions() {

    const postContent = useCallback(() => {

    }, [])
    
    return {
        postContent
    }
} 