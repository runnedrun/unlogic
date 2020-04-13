import { Observable } from 'rxjs'

module.exports.buildCurrentUserListener = firebase => {
  return new Observable(subscriber => {
    firebase.auth().onAuthStateChanged(user => {
      subscriber.next(user)
    })
  })
}
