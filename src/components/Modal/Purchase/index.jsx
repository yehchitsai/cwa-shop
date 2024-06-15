import Modal from '../index'

const PurchaseModal = (props) => {
  const {
    modalRef, onClose, onOk, isAddToCert, children
  } = props
  return (
    <Modal
      modalRef={modalRef}
      id='PURCHASE_MODAL'
      onClose={onClose}
      onOk={onOk}
      title={isAddToCert ? '加入購物車' : '從購物車移除'}
    >
      {children}
    </Modal>
  )
}

export default PurchaseModal
