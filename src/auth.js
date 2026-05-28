import { auth } from './firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'

const googleProvider = new GoogleAuthProvider()

// GOOGLE LOGIN
export const googleLogin = () =>
  signInWithPopup(auth, googleProvider)

// SIGNUP
export const signup = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password)

// LOGIN
export const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)

// LOGOUT
export const logout = () =>
  signOut(auth)

// RESET PASSWORD
export const resetPassword = (email) =>
  sendPasswordResetEmail(auth, email, {
    url: `${window.location.origin}/login`,
  })