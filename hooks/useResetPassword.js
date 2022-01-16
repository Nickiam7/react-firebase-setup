import { useState } from 'react'
import { auth } from '../config/firebase/config'

export const useResetPassword = () => {
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)

  const resetPassword = async (email) => {
    setError(null)
    setIsPending(true)
    try {
      await auth.sendPasswordResetEmail(email)
      setIsPending(false)
      setError(null)

    } catch (err) {
      setError(err.message)
      setIsPending(false)
    }
  }

  return {
    error,
    isPending,
    resetPassword
  }
}


