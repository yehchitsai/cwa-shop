import useCreatePost from '../hooks/useCreatePost'
import useUpdatePost from '../hooks/useUpdatePost'

const newPost = { aa: 123 }

const updatedPost = { aa: 456, bb: 789 }

const Example = () => {
  const {
    trigger: createPost,
    data: newPostData = {},
    isMutating: isMutatingNewPost
  } = useCreatePost(newPost)
  const {
    trigger: updatePost,
    data: updatedPostData = {},
    isMutating: isMutatingUpdatedPost
  } = useUpdatePost(updatedPost)
  return (
    <div className='m-4 flex flex-wrap md:flex-nowrap md:space-x-4'>
      <div className='w-full md:w-1/2'>
        <button
          type='button'
          className='btn my-10'
          onClick={() => createPost()}
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
          onClick={() => updatePost()}
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
  )
}

export default Example
