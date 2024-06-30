const PurchaseModalTable = (props) => {
  const { rowData } = props
  const {
    fish_name,
    fish_size,
    unit_price,
    retail_price,
    inventory,
    min_purchase_quantity,
    note
  } = rowData
  return (
    <div className='m-4 rounded-box border border-base-200'>
      <table className='table table-sm'>
        <tbody>
          <tr>
            <td>品名</td>
            <td>{fish_name}</td>
          </tr>
          <tr>
            <td>尺寸</td>
            <td>{fish_size}</td>
          </tr>
          <tr>
            <td>單價</td>
            <td>{unit_price}</td>
          </tr>
          <tr>
            <td>建議零售價</td>
            <td>{retail_price}</td>
          </tr>
          <tr>
            <td>在庫量</td>
            <td>{inventory}</td>
          </tr>
          <tr>
            <td>起購量</td>
            <td>{min_purchase_quantity}</td>
          </tr>
          <tr>
            <td>說明</td>
            <td>{note}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default PurchaseModalTable
