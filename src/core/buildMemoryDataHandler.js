import { Observable } from 'rxjs'
import { BehaviorSubject } from 'rxjs'


const buildMemoryDataHandler = () => {
  return new BehaviorSubject(undefined)
}

module.exports = buildMemoryDataHandler
