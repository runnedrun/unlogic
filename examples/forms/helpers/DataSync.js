module.exports.sync = (setter) => {
  return event => setter(event.target.value)
}
