import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase'

const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024  // 5MB
const MAX_DOC_SIZE = 10 * 1024 * 1024   // 10MB

/**
 * Upload a profile picture to Firebase Storage
 * @param {string} uid - User ID
 * @param {File} file - Image file
 * @param {function} onProgress - Progress callback (0-100)
 * @returns {Promise<string>} Download URL
 */
export async function uploadProfilePicture(uid, file, onProgress) {
  if (!VALID_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image.')
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('File too large. Maximum size is 5MB.')
  }

  const storageRef = ref(storage, `profilePictures/${uid}`)
  const uploadTask = uploadBytesResumable(storageRef, file)

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        onProgress?.(progress)
      },
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(downloadURL)
      }
    )
  })
}

/**
 * Upload a generic document to Firebase Storage
 * @param {string} path - Storage path
 * @param {File} file - File to upload
 * @param {function} onProgress - Progress callback (0-100)
 * @returns {Promise<string>} Download URL
 */
export async function uploadDocument(path, file, onProgress) {
  if (file.size > MAX_DOC_SIZE) {
    throw new Error('File too large. Maximum size is 10MB.')
  }

  const storageRef = ref(storage, path)
  const uploadTask = uploadBytesResumable(storageRef, file)

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        onProgress?.(progress)
      },
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(downloadURL)
      }
    )
  })
}
