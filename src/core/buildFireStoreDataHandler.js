import { doc, collection } from 'rxfire/firestore'
import { Observable, of, combineLatest } from 'rxjs'
import { mergeMap, map, take } from 'rxjs/operators'

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
  firestoreObs.toPromise = () => {
    return new Promise(resolve => {
      firestoreObs.pipe(take(1)).subscribe(value => {
        resolve(value)
      })
    })
  }

  const addIdToCollectionItems = collection =>
    collection.map(snapshot =>
      Object.assign(snapshot.data(), { id: snapshot.id })
    )

  const dataObs = firestoreObs.pipe(
    mergeMap(firestore => {
      if (firestore.add) {
        return collection(firestore).pipe(map(addIdToCollectionItems))
      } else if (firestore.collection) {
        return doc(firestore)
      } else if (firestore.onSnapshot) {
        return collection(firestore).pipe(map(addIdToCollectionItems))
      } else {
        return Observable.throw("Can't subscribe to the root")
      }
    })
  )

  dataObs.collection = collectionNameObs => {
    return buildFirestoreDataHandler(
      firestoreObs.pipe(
        mergeMap(firestore => {
          if (collectionNameObs.subscribe) {
            return collectionNameObs.pipe(
              map(collectionName => {
                return collectionName
                  ? firestore.collection(collectionName)
                  : fakeEmptyFirestore()
              })
            )
          } else {
            return of(firestore.collection(collectionNameObs))
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

  dataObs.set = (...args) =>
    firestoreObs.toPromise().then(firestore => firestore.set(...args))

  dataObs.update = (...args) =>
    firestoreObs.toPromise().then(firestore => firestore.update(...args))

  dataObs.add = (...args) =>
    firestoreObs.toPromise().then(firestore => firestore.add(...args))

  dataObs.delete = (...args) =>
    firestoreObs.toPromise().then(firestore => firestore.delete(...args))

  const buildPipeFn = obs => {
    const _oldPipe = obs.pipe

    obs.pipe = (...args) => {
      const newObs = _oldPipe.call(obs, ...args)
      newObs.set = obs.set
      newObs.add = obs.add
      newObs.delete = obs.delete
      newObs.update = obs.update
      buildPipeFn(newObs)
      return newObs
    }
  }

  buildPipeFn(dataObs)

  dataObs.data = fieldName => {
    return dataObs.pipe(
      map(snapshot => {
        return fieldName
          ? (snapshot.data() || {})[fieldName]
          : snapshot.data()
          ? Object.assign(snapshot.data(), { id: snapshot.id })
          : snapshot.data()
      })
    )
  }

  dataObs.field = fieldName => dataObs.pipe(map(ref => ref.get(fieldName)))

  return dataObs
}

module.exports = buildFirestoreDataHandler
