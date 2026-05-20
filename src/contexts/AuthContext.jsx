import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

function getAppUrl() {
  return import.meta.env.VITE_PUBLIC_APP_URL || window.location.origin
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    // Handle auth callback: check URL for auth tokens (email confirmation, password reset)
    const hash = window.location.hash
    const params = new URLSearchParams(window.location.search)
    if (hash && hash.includes('access_token')) {
      // Supabase implicit flow — tokens in hash, client picks them up automatically
      // Clean up URL after a short delay to let supabase process
      setTimeout(() => {
        window.history.replaceState(null, '', window.location.pathname)
      }, 500)
    } else if (params.get('code')) {
      // PKCE flow — exchange code for session
      supabase.auth.exchangeCodeForSession(params.get('code')).then(() => {
        window.history.replaceState(null, '', window.location.pathname)
      }).catch(console.error)
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function signUp(email, password) {
    if (!supabase) throw new Error('Supabase nicht konfiguriert')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getAppUrl(),
      },
    })
    if (error) throw error
    return data
  }

  async function signIn(email, password) {
    if (!supabase) throw new Error('Supabase nicht konfiguriert')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async function resetPassword(email) {
    if (!supabase) throw new Error('Supabase nicht konfiguriert')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getAppUrl(),
    })
    if (error) throw error
  }

  const value = {
    user,
    loading,
    isOnline: !!user,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
