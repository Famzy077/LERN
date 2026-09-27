import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@/shared/components/layout/ScreenWrapper';
import { useGoogleLogin } from '../hooks/useAuth';
// import * as Google from 'expo-auth-session/providers/google'; // Assuming usage

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const { mutate: loginWithGoogle, isPending } = useGoogleLogin();

  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   clientId: 'YOUR_CLIENT_ID',
  // });

  const handleGoogleLogin = () => {
    // promptAsync();
    // Simulate login for now
    loginWithGoogle({ idToken: 'fake_token' }, {
      onSuccess: () => {
        navigation.replace('AcademicSetup'); // Or main depending on state
      }
    });
  };

  return (
    <ScreenWrapper className="flex-1 bg-surface dark:bg-slate-900 justify-center px-8">
      <View className="items-center mb-12">
        <Text className="text-primary text-4xl font-bold tracking-widest mb-6">CRAMLY</Text>
        <Text className="text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
          Welcome back
        </Text>
        <Text className="text-slate-500 text-center">
          Sign in to continue your learning journey
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleGoogleLogin}
        disabled={isPending}
        className="flex-row items-center justify-center bg-white dark:bg-slate-800 py-4 px-6 rounded-3xl shadow-sm mb-6"
      >
        <View className="w-6 h-6 bg-red-500 rounded-full mr-3" /> {/* Placeholder for Google Icon */}
        <Text className="text-slate-900 dark:text-slate-50 font-medium text-lg">
          {isPending ? 'Signing in...' : 'Continue with Google'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Main')}>
        <Text className="text-slate-500 text-center font-medium mb-12">
          Continue as Guest
        </Text>
      </TouchableOpacity>

      <View className="mt-auto">
        <Text className="text-slate-400 text-center text-sm">
          By continuing, you agree to our{' '}
          <Text className="text-primary font-medium">Terms of Service</Text>
        </Text>
      </View>
    </ScreenWrapper>
  );
};

export default LoginScreen;
