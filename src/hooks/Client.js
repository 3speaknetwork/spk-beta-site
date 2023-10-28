import { useContext, createContext, useEffect, useState, useCallback } from 'react'
import { SpkClient } from '@spknetwork/graph-client'
import Axios from 'axios'
import {CeramicInstance} from './Ceramic'

export const API_NODE = 'https://offchain.us-02.infra.3speak.tv'

class ClientContextClass { 
    
    constructor() {
        this.client = new SpkClient(API_NODE, CeramicInstance.Ceramic)
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
            /*if(userDid) {
                const output = await ClientInstance.client.getDocumentsForUser(userDid, 1, 100)
                setPosts(output);
            }*/
            if(userDid) {
                const {data} = await Axios.post(`${API_NODE}/v1/graphql`, {
                    query: `
                    {
                        publicFeed(parent_id:null, creator_id:"${userDid}") {
                          stream_id
                          parent_id
                          body
                          
                          author {
                            did
                            description
                          }
                          children {
                            stream_id
                            version_id
                            parent_id
                            title
                            body
                            category
                            lang
                            type
                            app
                            json_metadata
                            app_metadata
                            community_ref
                            author {
                              did
                            }
                          }
                        }
                      }
                    `
                })
                setPosts(data.data.publicFeed)
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