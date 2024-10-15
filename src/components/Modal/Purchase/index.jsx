import Modal from '../index'

const PurchaseModal = (props) => {
  const {
    modalRef,
    onClose,
    onOk,
    children,
    isAddToCart
  } = props
  return (
    <Modal
      modalRef={modalRef}
      id='PURCHASE_MODAL'
      onClose={onClose}
      onOk={onOk}
      title={isAddToCart ? '加入購物車' : '修改購物車'}
      isFormModal
      closeText='關閉'
      okText={isAddToCart ? '新增' : '修改'}
    >
      {children}
    </Modal>
  )
}

export default PurchaseModal
