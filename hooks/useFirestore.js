import {
  useReducer,
  useEffect,
  useState
} from 'react'
import {
  firestore,
  storage,
  timestamp
} from '../config/firebase/config'

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null
}

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      return { isPending: true, document: null, success: false, error: null }
    case 'ADDED_DOCUMENT':
      return { isPending: false, document: action.payload, success: true, error: null }
    case 'DELETED_DOCUMENT':
      return { isPending: false, document: null, success: true, error: null }
    case "UPDATED_DOCUMENT":
      return { isPending: false, document: action.payload, success: true, error: null }
    case 'ERROR':
      return { isPending: false, document: null, success: false, error: action.payload }
    default:
      return state
  }
}

export const useFirestore = (collection) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState)
  const [isCancelled, setIsCancelled] = useState(false)

  const ref = firestore.collection(collection)

  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action)
    }
  }

  const addDocument = async (doc) => {
    dispatch({ type: 'IS_PENDING' })

    try {
      const createdAt = timestamp.fromDate(new Date())
      const addedDocument = await ref.add({ ...doc, createdAt })


      const uploadPath = `data-model/${doc.uid}/${addedDocument.id}/${doc.title}`
      // photos should be an array on state
      const blobs = doc.photos.map(async (photo, index) => {
        // converts images to blobs to send to storage
        const response = await fetch(photo)
        const blob = await response.blob()

        const img = await storage.ref().child(`${uploadPath}-${index}`).put(blob)
        return await img.ref.getDownloadURL()
      })
      // Resolves a single promise once all above promises resolve
      const allBlobs = await Promise.all(blobs)

      // Updates newly created document with storage links for file uploads
      // photos is an array on state to hold multiple files
      await ref.doc(addedDocument.id).update({ ...doc, photos: allBlobs })

      dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument })
    }
    catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
      console.log(err.message)
    }
  }

  const deleteDocument = async (id) => {
    dispatch({ type: 'IS_PENDING' })

    try {
      await ref.doc(id).delete()
      dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT' })
    }
    catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
    }
  }

  const updateDocument = async (id, updates) => {
    dispatch({ type: "IS_PENDING" })

    try {
      const updatedDocument = await ref.doc(id).update(updates)
      dispatchIfNotCancelled({ type: "UPDATED_DOCUMENT", payload: updatedDocument })
      return updatedDocument
    }
    catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message })
      return null
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return {
    addDocument,
    deleteDocument,
    response,
    updateDocument
  }
}
