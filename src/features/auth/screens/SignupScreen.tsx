import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@/shared/components/layout/ScreenWrapper';
import { Button } from '@/shared/components/ui/Button';
import { useAuthStore } from '../store/auth.store';
import { apiClient } from '@/shared/services/api.client';
import { ENDPOINTS } from '@/shared/constants/endpoints';

const SignupScreen = () => {
  const navigation = useNavigation<any>();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!form.name || !form.username || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/register', form);
      if (response.data && response.data.accessToken) {
        setAuth(response.data.user, response.data.accessToken, response.data.refreshToken);
        navigation.replace('AcademicSetup');
      }
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper className="flex-1 bg-surface dark:bg-slate-900 justify-center px-8" padded={false}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 40 }} showsVerticalScrollIndicator={false}>
        <View className="mb-10">
          <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</Text>
          <Text className="text-slate-500 dark:text-slate-400 text-lg">Join SlotStudy to start your journey.</Text>
        </View>

        <View className="space-y-4 mb-8">
          <View>
            <Text className="text-slate-700 dark:text-slate-300 font-medium mb-2">Full Name</Text>
            <TextInput
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white"
              placeholder="John Doe"
              placeholderTextColor="#94a3b8"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
            />
          </View>

          <View>
            <Text className="text-slate-700 dark:text-slate-300 font-medium mb-2">Username</Text>
            <TextInput
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white"
              placeholder="johndoe123"
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
              value={form.username}
              onChangeText={(text) => setForm({ ...form, username: text.toLowerCase() })}
            />
          </View>

          <View>
            <Text className="text-slate-700 dark:text-slate-300 font-medium mb-2">Email Address</Text>
            <TextInput
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white"
              placeholder="name@example.com"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
            />
          </View>

          <View>
            <Text className="text-slate-700 dark:text-slate-300 font-medium mb-2">Password</Text>
            <TextInput
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white"
              placeholder="••••••••"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
            />
          </View>
        </View>

        <Button title="Sign Up" onPress={handleSignup} isLoading={loading} className="w-full mb-6" />

        <View className="flex-row justify-center">
          <Text className="text-slate-500 dark:text-slate-400">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-primary font-semibold">Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default SignupScreen;
