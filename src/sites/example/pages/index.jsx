import { Link } from 'react-router-dom'
import { uniqueId } from 'lodash-es'
import toast from 'react-hot-toast'
import useCreate from '../../../hooks/useCreate'
import useUpdate from '../../../hooks/useUpdate'

const host = window.IS_MOCK
  ? import.meta.env.VITE_LOCAL_MOCK_API_HOST
  : import.meta.env.VITE_MOCK_API_HOST

const newPost = { aa: 123 }
const updatedPost = { aa: 456, bb: 789 }

const Example = () => {
  const {
    trigger: createPost,
    data: newPostData = {},
    isMutating: isMutatingNewPost
  } = useCreate(host)
  const {
    trigger: updatePost,
    data: updatedPostData = {},
    isMutating: isMutatingUpdatedPost
  } = useUpdate(host)
  return (
    <>
      <div className='m-4'>
        <Link to='detail/' className='btn btn-outline'>Detail</Link>
        <br />
      </div>
      <div className='m-4 flex flex-wrap md:flex-nowrap md:space-x-4'>
        <div className='w-full md:w-1/2'>
          <button
            type='button'
            className='btn my-10'
            onClick={async () => {
              const toastId = toast.loading('Creating...')
              const url = '/posts'
              await createPost({
                url,
                body: { uniqId: uniqueId('ex-new'), ...newPost }
              }).then(console.log)
              toast.success('Created', { id: toastId })
            }}
            disabled={isMutatingNewPost}
          >
            Click to send post request
          </button>
          <br />
          <pre className='h-[50vh] rounded-xl bg-slate-400 p-2'>
            {JSON.stringify(newPostData, null, 2)}
          </pre>
        </div>
        <div className='w-full md:w-1/2'>
          <button
            type='button'
            className='btn my-10'
            onClick={async () => {
              const toastId = toast.loading('Updating...')
              const url = '/posts/1'
              await updatePost({
                url,
                body: { uniqId: 'ex-updated', ...updatedPost }
              }).then(console.log)
              toast.success('Updated', { id: toastId })
            }}
            disabled={isMutatingUpdatedPost}
          >
            Click to send put request
          </button>
          <br />
          <pre className='h-[50vh] rounded-xl bg-slate-400 p-2'>
            {JSON.stringify(updatedPostData, null, 2)}
          </pre>
        </div>
      </div>
    </>
  )
}

export default Example
