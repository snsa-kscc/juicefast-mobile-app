import { useCallback, useEffect } from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import { useSSO } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

type SocialProvider = 'oauth_google' | 'oauth_facebook' | 'oauth_apple'

export const useSocialSignIn = () => {
  const { startSSOFlow } = useSSO()
  const router = useRouter()

  useWarmUpBrowser()

  const signInWith = useCallback(async (provider: SocialProvider) => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: provider,
        redirectUrl: AuthSession.makeRedirectUri(),
      })

      if (createdSessionId) {
        setActive!({ session: createdSessionId })
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }, [startSSOFlow, router])

  return {
    signInWithGoogle: () => signInWith('oauth_google'),
    signInWithFacebook: () => signInWith('oauth_facebook'),
    signInWithApple: () => signInWith('oauth_apple'),
  }
}