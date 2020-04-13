import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import SignIn from './auth/SignIn'
import SignUp from './auth/SignUp'

const firebase = require('firebase')
require('firebase/firestore')
// const { WithData } = require('unlogic-ui')
const { WithData } = require('../../../unlogic-ui')

// const {
//   buildFirestoreDataHandler,
//   buildMemoryDataHandler,
//   buildCurrentUserListener,
// } = require('unlogic')

const {
  buildFirestoreDataHandler,
  buildMemoryDataHandler,
  buildCurrentUserListener,
} = require('../../../unlogic')
// const unlogicUI = require('unlogic-ui')

firebase.initializeApp({
  apiKey: 'AIzaSyAMFOUclnu3bWpqtV5Mu_1U2GPK85VMpTE',
  authDomain: 'unlogic-test.firebaseapp.com',
  databaseURL: 'https://unlogic-test.firebaseio.com',
  projectId: 'unlogic-test',
  storageBucket: 'unlogic-test.appspot.com',
  messagingSenderId: '174798137478',
  appId: '1:174798137478:web:db343f7be80fd7bb104907',
})

const dataHandler = buildFirestoreDataHandler(firebase.firestore())

const mem = buildMemoryDataHandler()
mem.next('projects')

// This site has 3 pages, all of which are rendered
// dynamically in the browser (not server rendered).
//
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.

const RoutesWithAuth = WithData(({ currentUser }) => {
  console.log('currentUser', currentUser)
  return (
    <Router>
      <Switch>
        <Route path="/signin">
          <SignIn />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
        {currentUser ? (
          <div>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
          </div>
        ) : (
          <Route
            render={({ location }) => (
              <Redirect
                to={{
                  pathname: '/login',
                  state: { from: location },
                }}
              />
            )}
          />
        )}
      </Switch>
    </Router>
  )
})

export default function BasicExample() {
  return <RoutesWithAuth />
}

// You can think of these components as "pages"
// in your app.

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  )
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  )
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  )
}
