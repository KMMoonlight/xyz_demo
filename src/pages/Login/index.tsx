import React, { useCallback, useContext, useState } from 'react'
import { AlertContext } from '../../hooks/useMessageWrapper'
import { COMMON_HEADER } from '../../utils'

const Login: React.FC = () => {
  const { showAlert } = useContext(AlertContext)

  const [phoneNumber, setPhoneNumber] = useState<string>('')

  const [codeLoading, setCodeLoading] = useState<boolean>(false)

  const [verifyCode, setVerifyCode] = useState<string>('')

  const [loginLoading, setLoginLoading] = useState<boolean>(false)

  const getVerifyCode = useCallback((loading: boolean, phoneNumber: string) => {
    if (loading) {
      return
    }

    if (phoneNumber === '') {
      showAlert('Phone number is required', 'error')
      return
    }

    const data = {
      mobilePhoneNumber: phoneNumber,
      areaCode: '+86',
    }

    const options = {
      method: 'POST',
      headers: COMMON_HEADER,
      body: JSON.stringify(data),
    }

    setCodeLoading(true)

    fetch('/api/v1/auth/sendCode', options)
      .then((res) => res.json())
      .then(() => {
        showAlert('SMS already send!', 'success')
      })
      .finally(() => {
        setCodeLoading(false)
      })
  }, [])

  const doLogin = useCallback(
    (loading: boolean, phoneNumber: string, verifyCode: string) => {
      if (loading) {
        return
      }

      if (phoneNumber === '') {
        showAlert('Phone number is required', 'error')
        return
      }

      if (verifyCode === '') {
        showAlert('Verify code is required', 'error')
        return
      }

      const data = {
        mobilePhoneNumber: phoneNumber,
        areaCode: '+86',
        verifyCode: verifyCode,
      }

      const options = {
        method: 'POST',
        headers: COMMON_HEADER,
        body: JSON.stringify(data),
      }

      setLoginLoading(true)

      fetch('/api/v1/auth/loginOrSignUpWithSMS', options)
        .then((res) => {
          const accessToken = res.headers.get('x-jike-access-token') || ''
          const refreshToken = res.headers.get('x-jike-refresh-token') || ''

          localStorage.setItem('x-jike-access-token', accessToken)
          localStorage.setItem('x-jike-refresh-token', refreshToken)

          return res.json()
        })
        .then(() => {
          showAlert('Login success!', 'success')
          window.location.href = '/'
        })
        .finally(() => {
          setLoginLoading(false)
        })
    },
    []
  )

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Login</h2>
          <label className="input input-bordered flex items-center gap-2 input-primary input-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M7.616 22q-.691 0-1.153-.462T6 20.385V3.615q0-.69.463-1.152T7.616 2h8.769q.69 0 1.152.463T18 3.616v16.769q0 .69-.462 1.153T16.384 22zM7 18.5h10v-13H7z"
              />
            </svg>
            <input
              value={phoneNumber}
              type="text"
              className="grow "
              placeholder="Phone Number"
              onChange={(val) => {
                setPhoneNumber(val.target.value)
              }}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 input-primary input-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M8 10.77q.31 0 .54-.23t.23-.54t-.23-.54T8 9.23t-.54.23t-.23.54t.23.54t.54.23m4 0q.31 0 .54-.23t.23-.54t-.23-.54t-.54-.23t-.54.23t-.23.54t.23.54t.54.23m4 0q.31 0 .54-.23t.23-.54t-.23-.54t-.54-.23t-.54.23t-.23.54t.23.54t.54.23M3 20.076V4.616q0-.691.463-1.153T4.615 3h14.77q.69 0 1.152.463T21 4.616v10.769q0 .69-.463 1.153T19.385 17H6.077zM5.65 16h13.735q.23 0 .423-.192t.192-.423V4.615q0-.23-.192-.423T19.385 4H4.615q-.23 0-.423.192T4 4.615v13.03zM4 16V4z"
              />
            </svg>
            <input
              value={verifyCode}
              type="text"
              className="grow"
              placeholder="Verify Code"
              onChange={(val) => setVerifyCode(val.target.value)}
            />
          </label>
          <div className="card-actions">
            <button
              className="btn btn-sm btn-neutral"
              onClick={() => getVerifyCode(codeLoading, phoneNumber)}
            >
              {codeLoading && <span className="loading loading-spinner"></span>}
              Code
            </button>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => doLogin(loginLoading, phoneNumber, verifyCode)}
            >
              {loginLoading && (
                <span className="loading loading-spinner"></span>
              )}
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
