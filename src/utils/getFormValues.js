import { isEmpty, keyBy } from 'lodash-es'

const getFormValues = (target, fields = [], fileFields = []) => {
  const fileFieldMap = keyBy(fileFields)
  const formData = new FormData(target)
  const formValues = {}
  for (const field of fields) {
    let fieldValue = formData.getAll(field)
    const [value] = fieldValue
    switch (true) {
      case (field in fileFieldMap): {
        if (isEmpty(value)) {
          fieldValue = []
          break
        }
        fieldValue = JSON.parse(value)
        break
      }
      default:
        fieldValue = value
        break
    }
    formValues[field] = fieldValue
  }
  return formValues
}

export default getFormValues
