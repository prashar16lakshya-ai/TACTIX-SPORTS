import { auth } from './firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithCredential
} from 'firebase/auth'
import { GoogleSignIn } from '@capawesome/capacitor-google-sign-in'

import { Capacitor } from '@capacitor/core'

const googleProvider = new GoogleAuthProvider()

// Detect if running inside Capacitor WebView (APK)
const isCapacitor = () => Capacitor.isNativePlatform()

let isGoogleSignInInitialized = false

const initGoogleSignIn = async () => {
  if (isGoogleSignInInitialized) return
  try {
    console.log('[auth.js] Initializing Google Sign-In with Web Client ID...')
    await GoogleSignIn.initialize({
      clientId: '160203350263-i91r1ti78q56qct32psojgdhb4j9h6qp.apps.googleusercontent.com',
    })
    isGoogleSignInInitialized = true
    console.log('[auth.js] Google Sign-In initialized successfully')
  } catch (err) {
    console.error('[auth.js] Google Sign-In initialization failed:', err)
  }
}

// GOOGLE LOGIN — Prioritize native auth in Capacitor, and popup/redirect on Web
export const googleLogin = async () => {
  if (isCapacitor()) {
    console.log('[auth.js] Capacitor native platform detected. Initiating native Google Sign-in...')
    try {
      await initGoogleSignIn()
      const result = await GoogleSignIn.signIn()
      console.log('[auth.js] Native Google Sign-in result received')
      
      if (!result.idToken) {
        throw new Error('Google Sign-in failed: No ID Token returned from native API.')
      }

      console.log('[auth.js] Exchanging native ID token for Firebase credential...')
      const credential = GoogleAuthProvider.credential(result.idToken)
      const userCredential = await signInWithCredential(auth, credential)
      console.log('[auth.js] Natively authenticated in Firebase successfully:', userCredential.user.uid)
      return userCredential
    } catch (error) {
      console.error('[auth.js] Native Google Sign-In failed:', error)
      throw error
    }
  }

  // Web flow
  try {
    console.log('[auth.js] Web platform detected. Initiating signInWithPopup...')
    return await signInWithPopup(auth, googleProvider)
  } catch (error) {
    console.warn('[auth.js] signInWithPopup failed, attempting signInWithRedirect...', error)
    if (error.code === 'auth/popup-blocked') {
      return await signInWithRedirect(auth, googleProvider)
    }
    throw error
  }
}

// Check for redirect result (call on app init for Capacitor)
export const checkGoogleRedirectResult = () => {
  if (isCapacitor()) {
    return Promise.resolve(null) // Redirect is not used for native capacitor auth
  }
  return getRedirectResult(auth)
}

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