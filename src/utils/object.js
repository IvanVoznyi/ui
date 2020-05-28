export const parseKeyValues = (object = {}) =>
  Object.entries(object).map(([key, value]) => `${key}: ${value}`)

export const parseJobsDefaultParameters = (parameters, method) => {
  let parseParameters = parameters
    .map(parameter => parameter.items)
    .reduce((prev, curr) => {
      let name = curr.name
      return { ...prev, [name]: curr.value }
    }, {})
  method(parseParameters)
}
