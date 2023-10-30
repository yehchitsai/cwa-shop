import {
  get, isEmpty, keyBy, keys, map
} from 'lodash-es'

const getFormValues = (formValues, fileFields = []) => {
  const fileFieldMap = keyBy(fileFields)
  const fields = keys(formValues)
  const convertedFormValues = {}
  for (const field of fields) {
    let fieldValue = formValues[field]
    switch (true) {
      case (field in fileFieldMap): {
        if (isEmpty(fieldValue)) {
          fieldValue = []
          break
        }
        fieldValue = map(fieldValue, (item) => get(item, 'url'))
        break
      }
      default:
        break
    }
    convertedFormValues[field] = fieldValue
  }
  return convertedFormValues
}

export default getFormValues
