import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import SignIn from './auth/SignIn'
import SignUp from './auth/SignUp'
import OpportunityList from './opportunities-list/OpportunityList'
import { combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'
import Dashboard from './components/Dashboard'
import NewOpportunity from './new-opportunity/NewOpportunity'
import NewOpportunityType from './new-opportunity-type/NewOpportunityType'
import EditOpportunity from './edit-opportunity/EditOpportunity'
import { MainListItems } from './components/ListItems'

const firebase = require('firebase')
require('firebase/firestore')
const { WithData } = require('unlogic-ui')
const { flatten } = require('underscore')
// const { WithData } = require('../../../dist/ui/unlogic-ui')

// const {
//   buildFirestoreDataHandler,
//   buildMemoryDataHandler,
//   buildCurrentUserListener,
// } = require('unlogic')

const {
  buildFirestoreDataHandler,
  buildMemoryDataHandler,
  buildCurrentUserListener,
} = require('unlogic')

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
const currentUserObs = buildCurrentUserListener(firebase)

const D = {
  opportunity: id => dataHandler.collection('opportunities').doc(id),
  opportunityTypeForOpportunity: opportunityId =>
    D.opportunityType(D.opportunity(opportunityId).data('type')),
  opportunityType: id => dataHandler.collection('opportunityTypes').doc(id),
  opportunityTypesRaw: () => dataHandler.collection('opportunityTypes'),
  opportunityTypes: () =>
    dataHandler
      .collection('opportunityTypes')
      .pipe(map(_ => _.map(_ => Object.assign(_.data(), { id: _.id })))),
  currentUserData: () =>
    dataHandler
      .collection('users')
      .doc(currentUserObs.id)
      .data(),
  currentUserCompanyId: () =>
    dataHandler
      .collection('users')
      .doc(currentUserObs.id)
      .data('companyId'),
  opportunitiesForCurrentUser: () =>
    combineLatest(
      dataHandler
        .collection('opportunities')
        .where('postingUser', '==', currentUserObs.id),
      dataHandler
        .collection('opportunities')
        .where('postingCompany', '==', D.currentUserCompanyId())
    ).pipe(map(_ => flatten(_))),
  opportunities: () => dataHandler.collection('opportunities'),
}

window.D = D

// This site has 3 pages, all of which are rendered
// dynamically in the browser (not server rendered).
//
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.

const RoutesWithAuth = WithData(({ currentUser, dataSources }) => {
  if (!dataSources.currentUser.firstResultReturned) {
    return <span />
  }

  return (
    <Router>
      <Switch>
        <Route path="/signin">
          <SignIn auth={firebase.auth()} />
        </Route>
        <Route path="/signup">
          <SignUp auth={firebase.auth()} />
        </Route>
        {currentUser ? (
          <Route>
            <Dashboard
              mainListItems={
                <MainListItems
                  currentUser={D.currentUserData()}
                  opportunityTypes={D.opportunityTypes()}
                />
              }
            >
              <Route exact path="/">
                <OpportunityList
                  opportunities={D.opportunitiesForCurrentUser()}
                />
              </Route>
              <Route path="/opportunity/new">
                <NewOpportunity currentUserId={currentUserObs.id} opportunityTypes={D.opportunityTypes()} />
              </Route>
              <Route path="/opportunity/edit/:opportunityId">
                <EditOpportunity />
              </Route>
              <Route path="/opportunity-type/:opportunityTypeId">
                <NewOpportunityType />
              </Route>
            </Dashboard>
          </Route>
        ) : (
          <Route
            render={({ location }) => (
              <Redirect
                to={{
                  pathname: '/signin',
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
  return <RoutesWithAuth currentUser={currentUserObs} />
}
