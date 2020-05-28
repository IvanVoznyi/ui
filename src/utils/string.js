export const truncateUid = (value = '') =>
  value.length > 7 ? `...${value.slice(-7)}` : value

export const joinDataOfArrayOrObject = (data, splitCharacter = ',') => {
  if (Array.isArray(data)) {
    return data.join(splitCharacter)
  } else if (typeof data === 'object') {
    return Object.values(data).join(splitCharacter)
  }
  return data.toString()
}
