function Store(getData, setData) {
  let transaction = Promise.resolve()

  this.setData = () => {}

  this.load = () => { }

  this.create = (element) => {
    transaction = transaction.then(() => getData().then((data) => {
      data = data || []
      data.push(element)
      return setData(data)
    }))
  }

  this.delete = (element) => {
    transaction = transaction.then(() => getData().then((data) => {
      data.splice(element.index, 1)
      return setData(data)
    }))
  }

  this.updateOrder = (elements) => {
    transaction = transaction.then(() => setData(elements))
  }

  this.save = data => {}

  this.dispatch = (actionName, args) => {
    return this[actionName](args)
  }
}

export default Store
