import { useSSO } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";
import { getPushToken } from "@/services/messagingService";

WebBrowser.maybeCompleteAuthSession();

// const useWarmUpBrowser = () =>
//   useEffect(() => {
//     void WebBrowser.warmUpAsync();
//     return () => void WebBrowser.coolDownAsync();
//   }, []);

type SocialProvider = "oauth_google" | "oauth_facebook" | "oauth_apple";
type SignInState = "idle" | "loading" | "success" | "error";

interface SignInError {
  message: string;
  code?: string;
  provider?: SocialProvider;
}

export const useSocialSignIn = () => {
  const { startSSOFlow } = useSSO();
  const [state, setState] = useState<SignInState>("idle");
  const [error, setError] = useState<SignInError | null>(null);
  // useWarmUpBrowser();

  const resetState = useCallback(() => {
    setState("idle");
    setError(null);
  }, []);

  const signInWith = useCallback(
    async (
      provider: SocialProvider,
      onSignupComplete?: () => Promise<void>
    ) => {
      try {
        setState("loading");
        setError(null);

        const { createdSessionId, setActive, signUp } = await startSSOFlow({
          strategy: provider,
          redirectUrl: `${AuthSession.makeRedirectUri()}sso-callback`,
        });

        // redundant block
        if (signUp) {
          try {
            await signUp.update({
              unsafeMetadata: {
                role: "user",
                onboardingCompleted: false,
              },
            });
          } catch (metadataError) {
            console.warn("Failed to update user metadata:", metadataError);
          }
        }

        if (!createdSessionId) {
          throw new Error("No session created after authentication");
        }

        await setActive!({ session: createdSessionId });

        // Store push token after successful authentication
        try {
          const token = await getPushToken();
          if (token) {
            console.log("Push token obtained after social sign-in");
          }
        } catch (error) {
          console.warn("Failed to get push token after social sign-in:", error);
        }

        if (signUp && onSignupComplete) {
          try {
            await onSignupComplete();
          } catch (callbackError) {
            console.warn("Signup completion callback failed:", callbackError);
          }
        }

        setState("success");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Authentication failed";
        const errorCode =
          err && typeof err === "object" && "code" in err
            ? String(err.code)
            : undefined;

        setError({
          message: errorMessage,
          code: errorCode,
          provider,
        });
        setState("error");
        console.error("Social sign in error:", err);
      }
    },
    [startSSOFlow]
  );

  const signInWithGoogle = useCallback(
    async (onSignupComplete?: () => Promise<void>) => {
      await signInWith("oauth_google", onSignupComplete);
    },
    [signInWith]
  );

  const signInWithFacebook = useCallback(
    async (onSignupComplete?: () => Promise<void>) => {
      await signInWith("oauth_facebook", onSignupComplete);
    },
    [signInWith]
  );

  const signInWithApple = useCallback(
    async (onSignupComplete?: () => Promise<void>) => {
      await signInWith("oauth_apple", onSignupComplete);
    },
    [signInWith]
  );

  return {
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    state,
    error,
    isLoading: state === "loading",
    isSuccess: state === "success",
    isError: state === "error",
    resetState,
  };
};
