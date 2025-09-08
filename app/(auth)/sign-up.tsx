import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { useSocialSignIn } from '../../hooks/useSocialSignIn'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  const { signInWithGoogle, signInWithFacebook, signInWithApple } = useSocialSignIn()

  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <View className="flex-1 bg-amber-50 px-6 pt-16">
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-black rounded-2xl items-center justify-center mb-6">
            <Text className="text-white text-2xl font-bold">J</Text>
          </View>
          <Text className="text-2xl font-bold text-center mb-2">Verify your email</Text>
        </View>
        
        <View className="bg-white rounded-xl px-4 py-4 mb-6">
          <TextInput
            value={code}
            placeholder="Enter your verification code"
            className="text-base"
            onChangeText={(code) => setCode(code)}
          />
        </View>
        
        <TouchableOpacity onPress={onVerifyPress} className="bg-black rounded-full py-4">
          <Text className="text-white text-center font-semibold text-base">Verify</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-amber-50 px-6 pt-16">
      {/* Logo */}
      <View className="items-center mb-8">
        <View className="w-16 h-16 bg-black rounded-2xl items-center justify-center mb-6">
          <Text className="text-white text-2xl font-bold">J</Text>
        </View>
        <Text className="text-2xl font-bold text-center mb-2">Welcome to</Text>
        <Text className="text-2xl font-bold text-center">Juicefast</Text>
      </View>

      {/* Form */}
      <View className="space-y-4 mb-8">
        <View className="bg-white rounded-xl px-4 py-4 flex-row items-center">
          <Text className="text-gray-400 mr-3">👤</Text>
          <TextInput
            value={firstName}
            placeholder="First name"
            className="flex-1 text-base"
            onChangeText={(firstName) => setFirstName(firstName)}
          />
        </View>
        
        <View className="bg-white rounded-xl px-4 py-4 flex-row items-center">
          <Text className="text-gray-400 mr-3">👤</Text>
          <TextInput
            value={lastName}
            placeholder="Last name"
            className="flex-1 text-base"
            onChangeText={(lastName) => setLastName(lastName)}
          />
        </View>
        
        <View className="bg-white rounded-xl px-4 py-4 flex-row items-center">
          <Text className="text-gray-400 mr-3">✉</Text>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email"
            className="flex-1 text-base"
            onChangeText={(email) => setEmailAddress(email)}
          />
        </View>
        
        <View className="bg-white rounded-xl px-4 py-4 flex-row items-center">
          <Text className="text-gray-400 mr-3">🔒</Text>
          <TextInput
            value={password}
            placeholder="Create a password"
            secureTextEntry={true}
            className="flex-1 text-base"
            onChangeText={(password) => setPassword(password)}
          />
        </View>
      </View>

      {/* Create Account Button */}
      <TouchableOpacity onPress={onSignUpPress} className="bg-black rounded-full py-4 mb-6">
        <Text className="text-white text-center font-semibold text-base">Create account</Text>
      </TouchableOpacity>

      {/* Terms Text */}
      <Text className="text-xs text-gray-500 text-center mb-6">
        Your email will be used to send you product and{"\n"}
        marketing updates
      </Text>

      {/* Checkbox */}
      <View className="flex-row items-center mb-6">
        <View className="w-5 h-5 border border-gray-300 rounded mr-3" />
        <Text className="text-sm text-gray-600 flex-1">
          I don't want to receive updates and information via email
        </Text>
      </View>

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

      {/* Sign In Link */}
      <View className="flex-row justify-center">
        <Text className="text-gray-500">Already have an account? </Text>
        <Link href="/sign-in">
          <Text className="text-black font-semibold">Log in</Text>
        </Link>
      </View>
    </View>
  )
}