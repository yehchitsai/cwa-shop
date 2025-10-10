import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import PurchaseModal from '../../../components/Modal/Purchase'
import PurchaseModalTable from './PurchaseModalTable'
import { FORM_ITEM } from './constants'

function quantityRange(count) {
  const { min_purchase_quantity: min, inventory: max } = this.parent
  if (count == null || min == null) {
    return true
  }

  if (count > max && max !== -1) {
    return this.createError({
      message: `不可超過在庫量 ${max}`
    })
  }

  return count >= min
    ? true
    : this.createError({
      message: `起購量為 ${min}`
    })
}

const validationSchema = Yup.object().shape({
  [FORM_ITEM.QUANTITY]: Yup.number().typeError('僅限數字').required('不可為空').when(FORM_ITEM.MIN_PURCHASE_QUANTITY, {
    is: () => true,
    then: (schema) => schema.test(
      'greater-than-min',
      quantityRange
    )
  }),
  [FORM_ITEM.REQUEST]: Yup.string()
})

const EditRowModal = (props) => {
  const {
    modalRef,
    isAddToCart,
    isLoading,
    onSubmit,
    onClose,
    initialValues
  } = props
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <PurchaseModal
        modalRef={modalRef}
        isAddToCart={isAddToCart}
        onClose={onClose}
      >
        {(footer) => {
          return (
            <Form>
              <PurchaseModalTable
                rowData={initialValues}
                disabled={isLoading}
                isAddToCart
              />
              {footer}
            </Form>
          )
        }}
      </PurchaseModal>
    </Formik>
  )
}

export default EditRowModal
