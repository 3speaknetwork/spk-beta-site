import React, {useCallback, useEffect, useState, useContext} from 'react'
import { hash } from '@stablelib/sha256';
import { Ed25519Provider } from 'key-did-provider-ed25519'
import KeyResolver from 'key-did-resolver'
import { DID } from 'dids'
import {DHive} from '../const'
import { createGlobalState } from 'react-hooks-global-state';
import { CeramicClient } from '@ceramicnetwork/http-client'

import {useCeramic} from '../hooks/Ceramic'
import {ClientInstance} from '../hooks/Client'


function normalizeAuthSecret(authSecret64) {
    const authSecret = new Uint8Array(32);
    for (let i = 0; i < authSecret.length; i++) {
        authSecret[i] = authSecret64[i];
    }
    return authSecret;
}


class AccountContextClass {

    storeAuth(authInfo) {
        localStorage.setItem('login.auth', JSON.stringify(authInfo))
    }
    getAuth() {
        const authInfo = localStorage.getItem('login.auth')
        return authInfo ? JSON.parse(authInfo) : null
    }
    async checkLogin() {
        const auth = this.getAuth()

        if(!auth) {
            return;
        } 
        auth.authSecret = Object.values(auth.authSecret)
        console.log(auth)
        await this.createIdentity(auth)
    }
    async createIdentity({authId, authSecret}) {
        const provider = new Ed25519Provider(authSecret)
        const did = new DID({ provider, resolver: KeyResolver.getResolver() })
        await did.authenticate(); 
        this.did = did;
        return did;  
    }
    async loginWithHive(hiveName) {
        const loginResult = await (new Promise((resolve, reject) => {
            window.hive_keychain.requestSignBuffer(hiveName, "Allow this account to control your identity", "Posting", (e) => {
                if (e.success) {
                    resolve(e)
                } else {
                    return reject(e)
                }
            }, "https://hive-api.3speak.tv", "Login to SPK network")
        }))

        const { username } = loginResult.data

        
        const authId = `hive:${username}`;
        const authSecret = normalizeAuthSecret(
            hash(
                Buffer.from(
                    loginResult.result
                )
            )
        );
        const did = await this.createIdentity({authId, authSecret})
        // log the DID 
        this.storeAuth({authId, authSecret})

        const accountInfo = (await DHive.database.getAccounts([
            username
        ]))[0]
        let json_meatadata = JSON.parse(accountInfo.posting_json_metadata)
        if (!json_meatadata?.did) {
            json_meatadata.did = did.id
            window.hive_keychain.requestBroadcast(username, [['account_update2', {
                "account": username,
                "json_metadata": "",
                "posting_json_metadata": JSON.stringify(json_meatadata)
            }]], 'Posting', (e) => console.log(e))
        }
    }
    async runLoginComplete() {

    }
}


export const AccountContext = React.createContext(new AccountContextClass());


const initialState = { count: 0, did: null, ceramic: null };
const { useGlobalState } = createGlobalState(initialState);



export const AccountSystem = () => {
    const ac = useContext(AccountContext)
    const [, setMyDid] = useGlobalState('did');

    useEffect(async () => {
        //Trigger login
        await ac.checkLogin()
        setMyDid(ac.did)
    }, [])
    return (null)
};

export const useAccountContext = function() {
    const ac = useContext(AccountContext)
    const [myDid, setMyDid] = useGlobalState('did');
    const {Ceramic} = useCeramic();

    const triggerLoginWithHive = useCallback(async() => {
        await ac.loginWithHive()
        if(ac.did) {
            await Ceramic.setDID(ac.did);
        }
        setMyDid(ac.did)
        const ts = await ClientInstance.client.createDocument({
            text: 'hello world!'
          })
          console.log(ts)
    }, [ac, setMyDid])
    



    return {
        loggedIn: !!myDid,
        myDid,
        triggerLoginWithHive
    }
}

window.AccountContext = AccountContext;


