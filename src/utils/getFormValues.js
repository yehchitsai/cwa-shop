import { isEmpty, keyBy, size } from 'lodash-es'

const getFormValues = (target, fields, fileFields) => {
  const fileFieldMap = keyBy(fileFields)
  const formData = new FormData(target)
  const formValues = {}
  for (const field of fields) {
    let fieldValue = formData.getAll(field)
    const [value] = fieldValue
    switch (true) {
      case (field in fileFieldMap): {
        const isEmptyFile = (
          size(fieldValue) === 1 &&
          isEmpty(value.name)
        )
        if (isEmptyFile) {
          fieldValue = []
          break
        }
        const dt = new DataTransfer()
        for (const item of fieldValue) {
          dt.items.add(item)
        }
        fieldValue = dt.files
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
