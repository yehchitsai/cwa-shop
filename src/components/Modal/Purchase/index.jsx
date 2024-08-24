import Modal from '../index'

const PurchaseModal = (props) => {
  const {
    modalRef, onClose, onOk, isAddToCart, children
  } = props
  return (
    <Modal
      modalRef={modalRef}
      id='PURCHASE_MODAL'
      onClose={onClose}
      onOk={onOk}
      title={isAddToCart ? '加入購物車' : '從購物車移除'}
      isFormModal
    >
      {children}
    </Modal>
  )
}

export default PurchaseModal
