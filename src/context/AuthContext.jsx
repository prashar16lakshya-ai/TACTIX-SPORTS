import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'
import {
  login as firebaseLogin,
  logout as firebaseLogout,
  signup as firebaseSignup,
  resetPassword as firebaseResetPassword,
  googleLogin as firebaseGoogleLogin,
  checkGoogleRedirectResult
} from '../auth'

// Firebase error code → user-friendly message
function friendlyAuthError(error) {
  const code = error?.code || ''
  const map = {
    'auth/configuration-not-found': 'Sign-in method not enabled. Please contact the admin to enable Email/Password or Google sign-in in Firebase Console.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/email-already-in-use': 'An account already exists with this email.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/popup-closed-by-user': 'Login cancelled. Please try again.',
    'auth/popup-blocked': 'Popup blocked by browser. Please allow popups.',
    'auth/network-request-failed': 'Network error. Check your internet connection.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact your admin.',
  }
  return map[code] || error?.message || 'Something went wrong. Try again.'
}

// Demo user profiles removed

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🔥 SAFE USER HYDRATION (FIXED)
  const hydrateUser = async (firebaseUser) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        const name = firebaseUser.displayName || firebaseUser.email.split('@')[0]

        const profile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name,
          role: 'player',
          initials: name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2),
          createdAt: serverTimestamp(),
        }

        // Try creating profile, but don't crash if it fails
        try {
          await setDoc(userRef, profile)
        } catch (err) {
          console.warn('[AuthContext] Failed to create Firestore profile:', err)
        }

        return profile
      }

      return { uid: firebaseUser.uid, ...userDoc.data() }

    } catch (error) {
      console.error('[AuthContext] Firestore failed, using fallback user:', error)

      // ✅ CRITICAL FIX: fallback instead of breaking app
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || 'User',
        role: 'player',
        initials: (firebaseUser.displayName || 'U')
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
      }
    }
  }

  useEffect(() => {
    console.log('[AuthContext] Setting up auth listener')

    console.log('[AuthContext] Setting up auth listener')

    // Check for Google redirect result (Capacitor)
    checkGoogleRedirectResult()
      .then(result => {
        if (result?.user) {
          console.log('[AuthContext] Google redirect result received:', result.user.uid)
        }
      })
      .catch(err => {
        console.warn('[AuthContext] Google redirect check failed:', err)
      })

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[AuthContext] Auth state changed:', firebaseUser?.uid)

      setLoading(true)

      try {
        if (!firebaseUser) {
          console.log('[AuthContext] No user → logout state')
          setUser(null)
        } else {
          console.log('[AuthContext] Hydrating user:', firebaseUser.uid)

          const profile = await hydrateUser(firebaseUser)

          console.log('[AuthContext] User ready:', profile.role)
          setUser(profile)
        }
      } catch (err) {
        console.error('[AuthContext] Critical auth error:', err)

        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || 'User',
            role: 'player',
          })
        } else {
          setUser(null)
        }
      } finally {
        console.log('[AuthContext] Loading finished')
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // ======================
  // AUTH FUNCTIONS
  // ======================


  const signup = async (email, password, name, role = 'player', additionalData = {}) => {
    setLoading(true)
    try {
      let firebaseUser;
      
      if (password === 'GOOGLE_AUTH_USER') {
        // Skip firebase signup for Google users as they are already authenticated
        firebaseUser = auth.currentUser;
        if (!firebaseUser) throw new Error('No authenticated Google user found');
      } else {
        const result = await firebaseSignup(email, password)
        firebaseUser = result.user
      }

      // Create or update Firestore profile
      const userRef = doc(db, 'users', firebaseUser.uid)
      const profile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: name || firebaseUser.email.split('@')[0],
        role,
        initials: (name || firebaseUser.email.split('@')[0])
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
        createdAt: serverTimestamp(),
        ...additionalData
      }

      await setDoc(userRef, profile, { merge: true })
      setUser(profile) // Set user state immediately

      setLoading(false)
      return { success: true, user: firebaseUser }
    } catch (err) {
      setLoading(false)
      return { success: false, error: friendlyAuthError(err) }
    }
  }

  const login = async (email, password) => {
    setLoading(true)
    try {
      const result = await firebaseLogin(email, password)
      // Hydrate profile immediately so callers know the role
      const profile = await hydrateUser(result.user)
      setUser(profile)
      setLoading(false)
      return { success: true, user: profile }
    } catch (err) {
      setLoading(false)
      return { success: false, error: friendlyAuthError(err) }
    }
  }

  const loginWithGoogle = async (role = null) => {
    setLoading(true)
    try {
      const result = await firebaseGoogleLogin()
      const firebaseUser = result.user

      // If a role is provided, it means this is likely a signup/registration attempt from SignupScreen
      if (role) {
        console.log('[AuthContext] Google Signup with role:', role)
        const userRef = doc(db, 'users', firebaseUser.uid)
        const userDoc = await getDoc(userRef)

        if (!userDoc.exists()) {
          const name = firebaseUser.displayName || firebaseUser.email.split('@')[0]
          const profile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name,
            role,
            initials: name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2),
            createdAt: serverTimestamp(),
          }
          console.log('[AuthContext] Creating profile via Google Signup:', profile)
          await setDoc(userRef, profile)
          setUser(profile)
        } else {
          console.log('[AuthContext] User already exists, ignoring role selection for Google login')
        }
      }

      const profile = await hydrateUser(firebaseUser)
      setUser(profile)
      setLoading(false)
      return { success: true, user: profile }
    } catch (err) {
      setLoading(false)

      let message = friendlyAuthError(err)
      if (err.code === 'auth/popup-closed-by-user') {
        message = 'Login cancelled. Please try again.'
      } else if (err.code === 'auth/popup-blocked') {
        message = 'Popup blocked. Enable popups.'
      }

      return { success: false, error: message }
    }
  }

  const logout = async () => {
    setUser(null)
    setLoading(false)
    await firebaseLogout()
  }

  const updateSession = (newData) => {
    setUser(prev => prev ? { ...prev, ...newData } : null)
  }

  const resetPassword = async (email) => {
    try {
      await firebaseResetPassword(email)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemo,
        signup,
        login,
        loginWithGoogle,
        logout,
        updateSession,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)