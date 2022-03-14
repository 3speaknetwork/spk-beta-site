import './App.css';
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
import { CreatePost } from './pages/CreatePost';
import { UserPosts } from './pages/UserPosts';
import { FeedsPage } from './pages/FeedsPage';

import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

import 'react-notifications/lib/notifications.css';

import { NotificationContainer } from 'react-notifications';

function App() {
  const {
    triggerLoginWithHive
  } = useAccountContext()
  const ac = useContext(AccountContext)


  const did = ResolveUsername('vaultec')
  console.log(did)




  return (
    <div className="App">
      <header className="App-header">


        <HashRouter>
          <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '80%', maxWidth: '300px' }}>


            {
              ac.hiveName ?
                <>
                  <Link to="/create">
                    <Button variant="contained">
                      Create
                    </Button>
                  </Link>
                  <Link to={`/@${ac.hiveName.split(':')[1]}/posts`}>
                    <Button variant="contained">
                      Your Posts
                    </Button>
                  </Link></> : <div><Button variant="contained" onClick={triggerLoginWithHive}>
                    Click to login (hive keychain)
                  </Button></div>
            }
          </div>
          <Divider />
          <div style={{ maxWidth: '600px', width: '70%', marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
            <Switch>
              <Route exact path="/@:id/posts" component={UserPosts} />
            </Switch>
            <Switch>
              <Route exact path="/@:id" component={userPage} />
            </Switch>
            <Switch>
              <Route exact path="/create" component={CreatePost} />
            </Switch>
            <Switch>
              <Route exact path="/feed" component={FeedsPage} />
            </Switch>
          </div>
        </HashRouter>
        <AccountSystem />
        <NotificationContainer />
      </header>
    </div>
  );
}

export default App;
