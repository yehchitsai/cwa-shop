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

export default [
  {
    url: '/api/posts',
    method: 'post',
    timeout: 1500,
    response: () => ({
      code: 0,
      message: 'ok',
      data: createPost
    })
  },
  {
    url: '/api/posts/1',
    method: 'put',
    timeout: 1500,
    response: () => ({
      code: 0,
      message: 'ok',
      data: updatePost
    })
  }
]
