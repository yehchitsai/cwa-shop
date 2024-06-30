import { useSearchParams } from 'react-router-dom'
import { get } from 'lodash-es'
import clx from 'classnames'
import useGetCategoryList from '../../../hooks/useGetCategoryList'

const ItemSelectSection = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, isLoading } = useGetCategoryList()
  const defaultType = searchParams.get('type') || 'all'
  const options = get(data, 'category_list', [])

  const onSelectType = (e) => {
    const newType = e.target.value
    setSearchParams({ type: newType })
  }

  return (
    <div className='w-full'>
      <select
        className={clx(
          'select select-sm select-bordered w-full'
        )}
        onChange={onSelectType}
        value={defaultType}
        disabled={isLoading}
      >
        <option value={-1} disabled>Select type</option>
        <option value='all'>All</option>
        {options.map((option) => {
          const { category, subcategory } = option
          return (
            <optgroup key={category} label={category}>
              {subcategory.map((item) => {
                return (
                  <option value={item} key={item}>
                    {item}
                  </option>
                )
              })}
            </optgroup>
          )
        })}
      </select>
    </div>
  )
}

export default ItemSelectSection
