import { useState, useEffect } from 'react'
import { auth, firestore } from '../config/firebase/config'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (email, password, displayName) => {
    setError(null)
    setIsPending(true)

    try {
      const res = await auth.createUserWithEmailAndPassword(email, password)

      if (!res) {
        throw new Error('Sign up failed')
      }

      await res.user.updateProfile({ displayName })
      await firestore.collection('users').doc(res.user.uid).set({
        displayName,
      })

      dispatch({ type: 'LOGIN', payload: res.user })

      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    }
    catch (err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return {
    error,
    isPending,
    signup
  }
}
