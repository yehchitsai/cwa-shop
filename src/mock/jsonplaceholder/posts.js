import getApiPrefix from '../../utils/getApiPrefix'

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

const apiPrefix = getApiPrefix()
const postUrl = `${apiPrefix}/posts`
const putUrl = `${apiPrefix}/posts/1`

export default [
  {
    url: postUrl,
    method: 'post',
    timeout: 100,
    response: () => ({
      code: 0,
      message: 'ok',
      data: createPost
    })
  },
  {
    url: putUrl,
    method: 'put',
    timeout: 100,
    response: () => ({
      code: 0,
      message: 'ok',
      data: updatePost
    })
  }
]
