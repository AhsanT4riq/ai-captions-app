import { isClerkAPIResponseError, useSSO, useSignIn, useSignUp } from '@clerk/clerk-expo';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'expo-checkbox';
import { Link, useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import { emailAtom } from '@/store/login';
import { twFullConfig } from '@/utils/twconfig';

export default function Login() {
  const [loading, setLoading] = useState<'google' | 'apple' | 'email' | false>(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [email, setEmail] = useState('ahsantariqfast@gamil.com');
  const setEmailAtom = useSetAtom(emailAtom);

  const { startSSOFlow } = useSSO();
  const { signUp } = useSignUp();
  const { signIn, setActive } = useSignIn();
  const router = useRouter();

  const handleSignInWithSSO = async (strategy: 'oauth_google' | 'oauth_apple') => {
    if (strategy === 'oauth_google' || strategy === 'oauth_apple') {
      setLoading(strategy.replace('oauth_', '') as 'google' | 'apple');
    } else {
      setLoading(false);
    }
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (err) {
      console.error('OAuth error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    if (!isTermsChecked) {
      console.log('Please agree to the terms.');
      return;
    }
    try {
      setEmailAtom(email);

      await signUp?.create({
        emailAddress: email,
      });
      await signUp!.prepareEmailAddressVerification({ strategy: 'email_code' });
      router.push('/verify');
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        if (error.status === 422) {
          handleSignInWithEmail();
        } else {
          Alert.alert('Error', 'Something went wrong');
        }
      }
    }
  };

  const handleSignInWithEmail = async () => {
    try {
      const signInAttempt = await signIn?.create({
        strategy: 'email_code',
        identifier: email,
      });
      console.log('signInAttempt', JSON.stringify(signInAttempt, null, 2));
      router.push('/verify?isLogin=true');
      // await signIn?.prepareFirstFactor({ strategy: 'email_code' });
    } catch (error) {
      console.error('Error:', JSON.stringify(error, null, 2));
    }
  };

  const signInWithPasskey = async () => {
    // 'discoverable' lets the user choose a passkey
    // without auto-filling any of the options
    try {
      const signInAttempt = await signIn?.authenticateWithPasskey({
        flow: 'discoverable',
      });

      if (signInAttempt?.status === 'complete') {
        if (setActive !== undefined) {
          await setActive({ session: signInAttempt.createdSessionId });
        }
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error('Error:', JSON.stringify(err, null, 2));
    }
  };

  const handleLinkPress = (linkType: 'terms' | 'privacy') => {
    Linking.openURL(linkType === 'terms' ? 'https://clerk.com/terms' : 'https://clerk.com/privacy');
  };

  return (
    <View className="flex-1 bg-black pt-safe">
      <View className="flex-1 p-6">
        <View className="flex-row justify-end">
          <Link href={'/faq'} asChild>
            <TouchableOpacity className="bg-gray-700 rounded-xl p-2">
              <Feather name="help-circle" size={24} color="white" />
            </TouchableOpacity>
          </Link>
        </View>
        <View className="items-center py-8">
          <Image source={require('@/assets/images/convex.png')} className="w-40 h-40" />
        </View>
        <Text className="text-gray-400 text-md font-Poppins_400Regular text-center">
          AI-powered Captions Editor
        </Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          className="border my-8 border-gray-800 rounded-xl p-4 bg-gray-700 text-gray-300"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View className="flex-row items-center gap-4">
          <Checkbox
            value={isTermsChecked}
            onValueChange={setIsTermsChecked}
            color={isTermsChecked ? (twFullConfig.theme.colors as any).primary : undefined}
          />
          <Text className="text-gray-400 text-sm  font-Poppins_500Medium flex-1 flex-wrap">
            I agree to the{' '}
            <Text onPress={() => handleLinkPress('terms')} className="text-white underline">
              Terms of Service
            </Text>{' '}
            and acknowledge Captions&apos;{' '}
            <Text onPress={() => handleLinkPress('privacy')} className="text-white underline">
              Privacy Policy
            </Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleSignInWithEmail}
          disabled={loading === 'email' || !email || !isTermsChecked}
          className={`w-full py-4 rounded-lg mt-10 transition-colors duration-300 ${!email || !isTermsChecked || loading ? 'bg-gray-800' : 'bg-primary'}`}
        >
          {loading === 'email' ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-Poppins_500Medium text-lg text-center">Continue</Text>
          )}
        </TouchableOpacity>

        <Text className="text-gray-400 text-md font-Poppins_400Regular text-center my-4">
          Or continue with
        </Text>

        <View className="gap-4">
          <Pressable
            className="w-full flex-row justify-center items-center bg-gray-800 p-4 rounded-lg"
            onPress={() => handleSignInWithSSO('oauth_apple')}
            disabled={!!loading}
          >
            {loading === 'apple' ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="logo-apple" size={24} color="white" />
                <Text className="text-white text-center font-Poppins_600SemiBold ml-3 text-base">
                  Continue with Apple
                </Text>
              </>
            )}
          </Pressable>

          <Pressable
            className="w-full flex-row justify-center items-center bg-gray-800 p-4 rounded-lg"
            onPress={() => handleSignInWithSSO('oauth_google')}
            disabled={!!loading}
          >
            {loading === 'google' ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Image source={require('@/assets/images/google.webp')} className="w-6 h-6" />
                <Text className="text-white text-center font-Poppins_600SemiBold ml-3 text-base">
                  Continue with Google
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}
