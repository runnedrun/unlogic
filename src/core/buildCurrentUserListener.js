import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

module.exports = firebase => {
  const currentUserObs = new Observable(subscriber => {
    firebase.auth().onAuthStateChanged(user => {
      subscriber.next(user)
    })
  })

  currentUserObs.id = currentUserObs.pipe(map(currentUser => currentUser.uid))
  return currentUserObs
}
