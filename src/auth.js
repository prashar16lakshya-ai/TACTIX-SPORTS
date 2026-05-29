import { auth } from './firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth'

const googleProvider = new GoogleAuthProvider()

// Detect if running inside Capacitor WebView (APK)
const isCapacitor = () => !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform())

// GOOGLE LOGIN — uses redirect for Capacitor (popups don't work in WebView), popup for web
export const googleLogin = () => {
  if (isCapacitor()) {
    return signInWithRedirect(auth, googleProvider)
  }
  return signInWithPopup(auth, googleProvider)
}

// Check for redirect result (call on app init for Capacitor)
export const checkGoogleRedirectResult = () => getRedirectResult(auth)

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