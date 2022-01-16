import { useState } from 'react'
import { auth } from '../config/firebase/config'

export const useUpdatePassword = () => {
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const updatePassword = async (newPassword) => {
    setError(null)
    setIsPending(true)
    try {
      await auth.currentUser.updatePassword(newPassword)
      setError(null)
      setSuccess(true)
      setIsPending(false)
    } catch (err) {
      setError(err.message)
      setIsPending(false)
      setSuccess(false)
    }
  }

  return {
    updatePassword,
    error,
    success,
    isPending
  }
}
