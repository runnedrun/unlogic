import { doc, collection } from 'rxfire/firestore'
import { Observable, of, combineLatest } from 'rxjs'
import { mergeMap, map, tap } from 'rxjs/operators'

const obsOrStatic = val => (val.subscribe ? val : of(val))

const fakeEmptySnapshot = () => ({
  data: () => undefined,
  get: () => undefined,
})

const fakeEmptyFirestore = () => ({
  where: () => fakeEmptyFirestore(),
  collection: () => fakeEmptyFirestore(),
  onSnapshot: (...args) => {
    typeof args[0] === 'function'
      ? args[0](fakeEmptySnapshot)
      : args[1].next(fakeEmptySnapshot())
  },
})

const buildFirestoreDataHandler = firestoreOrObs => {
  const firestoreObs = obsOrStatic(firestoreOrObs)

  const dataObs = firestoreObs.pipe(
    mergeMap(firestore => {
      if (firestore.add) {
        return collection(firestore)
      } else if (firestore.collection) {
        return doc(firestore)
      } else {
        return Observable.throwError("Can't subscribe to the root")
      }
    })
  )

  dataObs.collection = collectionNameObs => {
    return buildFirestoreDataHandler(
      firestoreObs.pipe(
        map(firestore => {
          if (collectionNameObs.subscribe) {
            return collectionNameObs.pipe(
              map(collectionName => {
                collectionName
                  ? firestore.collection(collectionName)
                  : fakeEmptyFirestore()
              })
            )
          } else {
            return firestore.collection(collectionNameObs)
          }
        })
      )
    )
  }

  dataObs.where = (cond1ObsOrStatic, operatorObsOrStatic, cond2ObsOrStatic) => {
    return buildFirestoreDataHandler(
      combineLatest(
        obsOrStatic(cond1ObsOrStatic),
        obsOrStatic(operatorObsOrStatic),
        obsOrStatic(cond2ObsOrStatic),
        firestoreObs
      ).pipe(
        map(([cond1, operator, cond2, firestore]) => {
          if (cond1 && operator && cond2) {
            return firestore.where(cond1, operator, cond2)
          } else {
            return fakeEmptyFirestore()
          }
        })
      )
    )
  }

  dataObs.doc = pathObs => {
    return buildFirestoreDataHandler(
      combineLatest(obsOrStatic(pathObs), firestoreObs).pipe(
        map(([path, firestore]) => {
          return path ? firestore.doc(path) : fakeEmptyFirestore()
        })
      )
    )
  }

  dataObs.field = fieldName => dataObs.pipe(map(ref => ref.get(fieldName)))

  return dataObs
}

module.exports.buildFirestoreDataHandler = buildFirestoreDataHandler
