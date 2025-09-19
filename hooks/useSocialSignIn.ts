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

  const signInWith = useCallback(async (provider: SocialProvider, onSignupComplete?: () => Promise<void>) => {
    try {
      const { createdSessionId, setActive, signUp } = await startSSOFlow({
        strategy: provider,
        redirectUrl: AuthSession.makeRedirectUri(),
      })

      // If this is a new user (signUp exists), add metadata
      if (signUp) {
        await signUp.update({
          unsafeMetadata: {
            role: "user",
            onboardingCompleted: false,
          },
        })
      }

      if (createdSessionId) {
        setActive!({ session: createdSessionId })

        // If this was a new user signup, call the completion callback
        if (signUp && onSignupComplete) {
          await onSignupComplete()
        }
      }
    } catch (err) {
      console.error('Social sign in error:', err)
    }
  }, [startSSOFlow, router])

  return {
    signInWithGoogle: (onSignupComplete?: () => Promise<void>) => signInWith('oauth_google', onSignupComplete),
    signInWithFacebook: (onSignupComplete?: () => Promise<void>) => signInWith('oauth_facebook', onSignupComplete),
    signInWithApple: (onSignupComplete?: () => Promise<void>) => signInWith('oauth_apple', onSignupComplete),
  }
}