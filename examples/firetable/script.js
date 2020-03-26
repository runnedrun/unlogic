const andrew = '26YMauciy53gEik7zGEy'
const david = '3rmemIzSrwR5ZJ5L3EYx'

const firebase = require('firebase')
require('firebase/firestore')

const { buildFirestoreDataHandler } = require('unlogic')
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

const creatorId = dataHandler
  .collection('projects')
  .doc('n6jWl9Tgx0UONMWrz01x')
  .field('creator')

const reader = dataHandler.collection('users').doc(creatorId)

const subscriber = reader.subscribe(_ => console.log(_.data()))

window.unsub = () => subscriber.unsubscribe()

let tog = 0
window.toggle = () => {
  firebase
    .firestore()
    .collection('projects')
    .doc('n6jWl9Tgx0UONMWrz01x')
    .set({ creator: tog % 2 ? andrew : david })
  tog++
}
