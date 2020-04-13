import React from 'react'
import ReactDOM from 'react-dom'

const firebase = require('firebase')
require('firebase/firestore')
const { WithData } = require('unlogic-ui')

const { buildFirestoreDataHandler, buildMemoryDataHandler } = require('unlogic')
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

const creatorId = dataHandler
  .collection(mem)
  .doc('n6jWl9Tgx0UONMWrz01x')
  .field('creator')

const userData = dataHandler.collection('users').data(creatorId)

const Display = WithData(({ userData }) => {
  return <div>{userData.name}</div>
})

const Root = () => {
  return (
    <div>
      <Display userData={userData} />
    </div>
  )
}

ReactDOM.render(<Root/>, document.getElementById('root'))
