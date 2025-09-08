import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useSocialSignIn } from '../../hooks/useSocialSignIn'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const { signInWithGoogle, signInWithFacebook, signInWithApple } = useSocialSignIn()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/onboarding')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <View className="flex-1 bg-amber-50 px-6 pt-16">
      {/* Logo */}
      <View className="items-center mb-8">
        <View className="w-16 h-16 bg-black rounded-2xl items-center justify-center mb-6">
          <Text className="text-white text-2xl font-bold">J</Text>
        </View>
        <Text className="text-2xl font-bold text-center mb-2">Welcome back</Text>
      </View>

      {/* Form */}
      <View className="space-y-4 mb-8">
        <View className="bg-white rounded-xl px-4 py-4 flex-row items-center">
          <Text className="text-gray-400 mr-3">✉</Text>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email"
            className="flex-1 text-base"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
        </View>
        
        <View className="bg-white rounded-xl px-4 py-4 flex-row items-center">
          <Text className="text-gray-400 mr-3">🔒</Text>
          <TextInput
            value={password}
            placeholder="Password"
            secureTextEntry={true}
            className="flex-1 text-base"
            onChangeText={(password) => setPassword(password)}
          />
        </View>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity className="mb-6">
        <Text className="text-gray-500 text-center">Forgot password?</Text>
      </TouchableOpacity>

      {/* Log In Button */}
      <TouchableOpacity onPress={onSignInPress} className="bg-black rounded-full py-4 mb-6">
        <Text className="text-white text-center font-semibold text-base">Log in</Text>
      </TouchableOpacity>

      {/* Social Login Buttons */}
      <View className="space-y-3 mb-8">
        <TouchableOpacity onPress={signInWithFacebook} className="bg-black rounded-full py-4 flex-row items-center justify-center">
          <Text className="text-white mr-2">f</Text>
          <Text className="text-white font-semibold">Facebook</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={signInWithApple} className="bg-black rounded-full py-4 flex-row items-center justify-center">
          <Text className="text-white mr-2">🍎</Text>
          <Text className="text-white font-semibold">Apple</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={signInWithGoogle} className="bg-black rounded-full py-4 flex-row items-center justify-center">
          <Text className="text-white mr-2">G</Text>
          <Text className="text-white font-semibold">Google</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Up Link */}
      <View className="flex-row justify-center">
        <Text className="text-gray-500">Not a member yet? </Text>
        <Link href="/sign-up">
          <Text className="text-black font-semibold">Start your journey</Text>
        </Link>
      </View>
    </View>
  )
}