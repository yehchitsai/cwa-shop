const createPost = {
  id: 201,
  title: 'bar',
  body: 'foo',
  userId: 2
}

const updatePost = {
  id: 1,
  title: 'foo',
  body: 'bar',
  userId: 1
}

let apiPrefix
if (typeof window === 'object') {
  apiPrefix = window.VITE_AWS_HOST_PREFIX
} else {
  apiPrefix = process.env.VITE_AWS_HOST_PREFIX
}
const postUrl = `${apiPrefix}/posts`
const putUrl = `${apiPrefix}/posts/1`

export default [
  {
    url: postUrl,
    method: 'post',
    timeout: 1500,
    response: () => ({
      code: 0,
      message: 'ok',
      data: createPost
    })
  },
  {
    url: putUrl,
    method: 'put',
    timeout: 1500,
    response: () => ({
      code: 0,
      message: 'ok',
      data: updatePost
    })
  }
]
