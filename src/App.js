import './App.css';
import { SpkClient } from 'spk-graph-client/dist/spk-client'
import { CeramicClient } from '@ceramicnetwork/http-client'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import KeyResolver from 'key-did-resolver'
import { DID } from 'dids'


import { AccountContext, useAccountContext, AccountSystem } from './contexts/AccountContext'
import { useContext } from 'react';

import { ResolveUsername } from './hooks/Hive'
import {
  BrowserRouter as Router,
  HashRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { userPage } from './pages/UserPage';




function App() {
  const {
    triggerLoginWithHive
  } = useAccountContext()
  const ac = useContext(AccountContext)
  console.log(ac)

  const did = ResolveUsername('vaultec')
  console.log(did)



  return (
    <div className="App">
      <header className="App-header">

        <button onClick={triggerLoginWithHive}>
          Login with hive keyChain!
        </button>
        <HashRouter>
          <Switch>
            <Route exact path="/@:id" component={userPage} />
          </Switch>

        </HashRouter>
        <AccountSystem />
      </header>
    </div>
  );
}

export default App;
