import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@/shared/components/layout/ScreenWrapper';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { useInstitutions, usePrograms, useAcademicSetup } from '../hooks/useAuth';

const AcademicSetupScreen = () => {
  const navigation = useNavigation<any>();
  const [institutionSearch, setInstitutionSearch] = useState('');
  const [selectedInstId, setSelectedInstId] = useState('');
  const [selectedProgId, setSelectedProgId] = useState('');
  const [year, setYear] = useState(1);

  const { data: instData, isLoading: instLoading } = useInstitutions(institutionSearch);
  const { data: progData, isLoading: progLoading } = usePrograms(selectedInstId);
  const { mutate: setupAcademic, isPending } = useAcademicSetup();

  const handleSetup = () => {
    if (selectedInstId && selectedProgId && year) {
      setupAcademic(
        { institutionId: selectedInstId, programId: selectedProgId, yearOfStudy: year },
        {
          onSuccess: () => {
            navigation.replace('Main');
          },
        }
      );
    }
  };

  return (
    <ScreenWrapper className="flex-1 bg-surface dark:bg-slate-900 p-6">
      <Text className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-8">
        Set up your profile
      </Text>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-slate-700 dark:text-slate-300 font-medium mb-2">Institution</Text>
          <Input
            placeholder="Search institution..."
            value={institutionSearch}
            onChangeText={setInstitutionSearch}
          />
          {instLoading && <ActivityIndicator className="mt-2" />}
          {!selectedInstId && instData?.data?.map((inst) => (
            <TouchableOpacity
              key={inst.id}
              className="p-3 bg-white dark:bg-slate-800 mt-2 rounded-xl"
              onPress={() => setSelectedInstId(inst.id)}
            >
              <Text className="text-slate-900 dark:text-slate-50">{inst.name}</Text>
            </TouchableOpacity>
          ))}
          {!!selectedInstId && (
            <Text className="mt-2 text-primary font-medium">Selected. Tap to change.</Text>
          )}
        </View>

        <View className="mb-6">
          <Text className="text-slate-700 dark:text-slate-300 font-medium mb-2">Program</Text>
          {progLoading && <ActivityIndicator />}
          {progData?.data?.map((prog) => (
            <TouchableOpacity
              key={prog.id}
              className={`p-3 mt-2 rounded-xl border ${
                selectedProgId === prog.id ? 'border-primary bg-primary/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
              }`}
              onPress={() => setSelectedProgId(prog.id)}
            >
              <Text className="text-slate-900 dark:text-slate-50">{prog.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mb-8">
          <Text className="text-slate-700 dark:text-slate-300 font-medium mb-2">Year of Study</Text>
          <View className="flex-row flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((y) => (
              <TouchableOpacity
                key={y}
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  year === y ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'
                }`}
                onPress={() => setYear(y)}
              >
                <Text className={`${year === y ? 'text-white' : 'text-slate-900 dark:text-slate-50'} font-bold`}>
                  {y}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          title={isPending ? 'Setting up...' : 'Get Started'}
          onPress={handleSetup}
          disabled={!selectedInstId || !selectedProgId || isPending}
          className="mb-8"
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default AcademicSetupScreen;
