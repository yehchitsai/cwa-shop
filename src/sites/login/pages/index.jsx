import { useEffect } from 'react'
import { Formik, Field, Form } from 'formik'
import qs from 'query-string'

const FORM = {
  TOKEN_TYPE: 'token_type',
  ACCESS_TOKEN: 'access_token'
}

const Login = () => {
  useEffect(() => {
    [FORM.TOKEN_TYPE, FORM.ACCESS_TOKEN].map((key) => window.localStorage.removeItem(key))
  }, [])

  return (
    <div className='hero fixed top-0 z-0 min-h-screen bg-base-200'>
      <div className='hero-content flex-col lg:flex-row-reverse'>
        <div className='card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl'>
          <Formik
            initialValues={{
              [FORM.TOKEN_TYPE]: 'Bearer',
              [FORM.ACCESS_TOKEN]: 'mock-access-token_123'
            }}
          >
            {({ values }) => (
              <Form className='card-body'>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>Token Type</span>
                  </label>
                  <Field name={FORM.TOKEN_TYPE} className='input input-bordered' required />
                </div>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>Access Token</span>
                  </label>
                  <Field name={FORM.ACCESS_TOKEN} className='input input-bordered' required />
                </div>
                <div className='form-control mt-6'>
                  <a
                    className='btn btn-primary'
                    href={window.location.href.replace(window.location.pathname, `${window.APP_BASENAME}/external/#${qs.stringify(values)}`)}
                  >
                    Login
                  </a>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default Login
