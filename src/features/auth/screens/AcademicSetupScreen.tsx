import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Check, GraduationCap, Search } from 'lucide-react-native';
import { ScreenWrapper } from '@/shared/components/layout/ScreenWrapper';
import { AppAlert as Alert } from '@/shared/components/feedback/AppAlert';
import { Button } from '@/shared/components/ui/Button';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useDebounce } from '@/shared/hooks/useDebounce';
import {
  useInstitutions,
  usePrograms,
  useAcademicSetup,
} from '../hooks/useAuth';
import type { Institution } from '../types/auth.types';

const NIGERIAN_DISTANCE_LEARNING_IDS = new Set([
  'univ-noun',
  'univ-miva',
  'univ-unilag',
  'univ-ui',
  'univ-unn',
]);

const AcademicSetupScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isEditing = route.name === 'AcademicDetails';
  const { data: profileResponse } = useProfile(isEditing);
  const [institutionSearch, setInstitutionSearch] = useState('');
  const [selectedInstId, setSelectedInstId] = useState('');
  const [selectedProgId, setSelectedProgId] = useState('');
  const [year, setYear] = useState(1);
  const didInitialize = useRef(false);
  const debouncedInstitutionSearch = useDebounce(institutionSearch, 250);

  const {
    data: instData,
    isLoading: instLoading,
    isFetching: instSearching,
    isError: instError,
    refetch: refetchInstitutions,
  } = useInstitutions(debouncedInstitutionSearch);
  const {
    data: progData,
    isLoading: progLoading,
    isError: progError,
    refetch: refetchPrograms,
  } = usePrograms(selectedInstId);
  const { mutate: setupAcademic, isPending } = useAcademicSetup();

  const institutions = (instData?.data ?? []).filter(
    (institution) =>
      institution.country === 'Nigeria' &&
      NIGERIAN_DISTANCE_LEARNING_IDS.has(institution.id),
  );
  const recommendedInstitutions = useMemo(() => {
    const priority = ['univ-noun', 'univ-miva'];
    return [...institutions].sort((a, b) => {
      const aPriority = priority.indexOf(a.id);
      const bPriority = priority.indexOf(b.id);
      if (aPriority === -1 && bPriority === -1) {
        return a.name.localeCompare(b.name);
      }
      if (aPriority === -1) return 1;
      if (bPriority === -1) return -1;
      return aPriority - bPriority;
    });
  }, [institutions]);
  useEffect(() => {
    if (!isEditing || didInitialize.current || !profileResponse?.data) return;

    const profile = profileResponse.data;
    if (profile.university) setInstitutionSearch(profile.university);
    if (profile.yearOfStudy) setYear(profile.yearOfStudy);
    didInitialize.current = true;
  }, [isEditing, profileResponse]);

  useEffect(() => {
    if (
      !isEditing ||
      selectedInstId ||
      !profileResponse?.data.university ||
      !institutions.length
    ) {
      return;
    }

    const currentInstitution = institutions.find(
      (institution) =>
        institution.name.toLocaleLowerCase() ===
        profileResponse.data.university.toLocaleLowerCase(),
    );
    if (currentInstitution) setSelectedInstId(currentInstitution.id);
  }, [institutions, isEditing, profileResponse, selectedInstId]);

  useEffect(() => {
    const programs = progData?.data;
    const currentProgram = profileResponse?.data.program;
    if (!isEditing || !programs?.length || !currentProgram || selectedProgId)
      return;

    const matchingProgram = programs.find(
      (program) =>
        program.name.toLocaleLowerCase() === currentProgram.toLocaleLowerCase(),
    );
    if (matchingProgram) setSelectedProgId(matchingProgram.id);
  }, [isEditing, profileResponse, progData, selectedProgId]);

  const selectInstitution = (institution: Institution) => {
    setSelectedInstId(institution.id);
    setSelectedProgId('');
    setInstitutionSearch(institution.name);
  };

  const handleSetup = () => {
    if (!selectedInstId || !selectedProgId) return;

    setupAcademic(
      {
        institutionId: selectedInstId,
        programId: selectedProgId,
        yearOfStudy: year,
      },
      {
        onSuccess: () => {
          if (isEditing) {
            navigation.goBack();
          } else {
            navigation.getParent()?.navigate('Main');
          }
        },
        onError: (error) =>
          Alert.alert(
            'Could not save education details',
            error.message || 'Please try again.',
          ),
      },
    );
  };

  const handleSkip = () => {
    navigation.getParent()?.navigate('Main');
  };

  const renderInstitution = (institution: Institution) => {
    const selected = selectedInstId === institution.id;
    return (
      <TouchableOpacity
        key={institution.id}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        onPress={() => selectInstitution(institution)}
        className={`mb-2 flex-row items-center rounded-2xl border p-4 ${
          selected
            ? 'border-primary bg-primary/5 dark:bg-slate-800'
            : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
        }`}
      >
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-slate-700">
          <GraduationCap size={19} color="#2563EB" />
        </View>
        <View className="ml-3 flex-1">
          <Text className="font-semibold text-slate-900 dark:text-slate-50">
            {institution.name}
          </Text>
          <Text className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {institution.country}
          </Text>
        </View>
        {selected ? <Check size={19} color="#2563EB" /> : null}
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper padded={false}>
      <View className="flex-1 bg-surface dark:bg-slate-900">
        <View className="flex-row items-center px-5 pb-4 pt-3">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
            className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800"
          >
            <ArrowLeft size={21} color="#334155" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-slate-900 dark:text-slate-50">
              {isEditing ? 'Education details' : 'Set up your profile'}
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              Your school helps personalize your study experience
            </Text>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 28 }}
        >
          <View className="mb-5 rounded-3xl bg-blue-50 p-4 dark:bg-slate-800">
            <Text className="font-semibold text-slate-900 dark:text-slate-50">
              Made for Nigerian distance learners
            </Text>
            <Text className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
              Find your school from our curated list of Nigerian universities
              offering open and distance-learning programmes.
            </Text>
          </View>

          <Text className="mb-2 ml-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
            University or institution
          </Text>
          <View className="mb-4 min-h-14 flex-row items-center rounded-2xl border border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-800">
            <Search size={19} color="#64748B" />
            <TextInput
              accessibilityLabel="Search Nigerian distance-learning universities"
              placeholder="Search universities in Nigeria"
              placeholderTextColor="#94A3B8"
              value={institutionSearch}
              onChangeText={(value) => {
                setInstitutionSearch(value);
                if (selectedInstId) {
                  setSelectedInstId('');
                  setSelectedProgId('');
                }
              }}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="search"
              className="ml-3 min-h-14 flex-1 py-3 text-base text-slate-900 dark:text-slate-50"
            />
            {institutionSearch.length > 0 ? (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Clear university search"
                onPress={() => {
                  setInstitutionSearch('');
                  setSelectedInstId('');
                  setSelectedProgId('');
                }}
                className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700"
              >
                <Text className="text-base font-semibold text-slate-500">
                  ×
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {instSearching ? (
            <ActivityIndicator className="my-4" color="#2563EB" />
          ) : null}
          {instError ? (
            <TouchableOpacity
              onPress={() => void refetchInstitutions()}
              className="mb-4 rounded-xl bg-red-50 p-3"
            >
              <Text className="text-sm text-red-700">
                Couldn’t load universities. Tap to retry.
              </Text>
            </TouchableOpacity>
          ) : null}

          {selectedInstId ? (
            <View className="mb-5">
              {institutions.find(
                (institution) => institution.id === selectedInstId,
              ) ? (
                renderInstitution(
                  institutions.find(
                    (institution) => institution.id === selectedInstId,
                  )!,
                )
              ) : (
                <TouchableOpacity
                  onPress={() => setSelectedInstId('')}
                  className="rounded-2xl border border-primary bg-primary/5 p-4"
                >
                  <Text className="font-semibold text-primary">
                    {institutionSearch}
                  </Text>
                  <Text className="mt-1 text-xs text-slate-500">
                    Tap to choose a different institution
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              {recommendedInstitutions.length ? (
                <>
                  <Text className="mb-2 mt-1 text-xs font-bold uppercase tracking-wider text-primary">
                    {debouncedInstitutionSearch
                      ? 'Search results'
                      : 'Nigerian distance-learning universities'}
                  </Text>
                  {recommendedInstitutions.map(renderInstitution)}
                </>
              ) : null}
              {!instSearching &&
              !instError &&
              recommendedInstitutions.length === 0 ? (
                <View className="mb-5 rounded-2xl bg-white p-4 dark:bg-slate-800">
                  <Text className="font-semibold text-slate-800 dark:text-slate-100">
                    {debouncedInstitutionSearch
                      ? 'No matching university found'
                      : 'No universities available yet'}
                  </Text>
                  <Text className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                    Try another spelling or contact support to suggest a
                    Nigerian distance-learning university.
                  </Text>
                </View>
              ) : null}
            </>
          )}

          {selectedInstId ? (
            <>
              <Text className="mb-2 mt-2 ml-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                Program of study
              </Text>
              {progLoading ? (
                <ActivityIndicator className="my-3" color="#2563EB" />
              ) : null}
              {progError ? (
                <TouchableOpacity
                  onPress={() => void refetchPrograms()}
                  className="mb-3 rounded-xl bg-red-50 p-3"
                >
                  <Text className="text-sm text-red-700">
                    Couldn’t load programs. Tap to retry.
                  </Text>
                </TouchableOpacity>
              ) : null}
              {progData?.data?.length ? (
                <View className="mb-5 flex-row flex-wrap gap-2">
                  {progData.data.map((program) => {
                    const selected = selectedProgId === program.id;
                    return (
                      <TouchableOpacity
                        key={program.id}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        onPress={() => setSelectedProgId(program.id)}
                        className={`rounded-full border px-4 py-2.5 ${
                          selected
                            ? 'border-primary bg-primary'
                            : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
                        }`}
                      >
                        <Text
                          className={`text-sm font-medium ${
                            selected
                              ? 'text-white'
                              : 'text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {program.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
              {!progLoading && !progError && progData?.data?.length === 0 ? (
                <Text className="mb-5 text-sm text-slate-500">
                  No programs are listed for this institution yet.
                </Text>
              ) : null}

              <Text className="mb-2 ml-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                Year of study
              </Text>
              <View className="mb-6 flex-row flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((studyYear) => {
                  const selected = year === studyYear;
                  return (
                    <TouchableOpacity
                      key={studyYear}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => setYear(studyYear)}
                      className={`h-11 w-11 items-center justify-center rounded-full ${
                        selected ? 'bg-primary' : 'bg-white dark:bg-slate-800'
                      }`}
                    >
                      <Text
                        className={`font-bold ${selected ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}
                      >
                        {studyYear}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          ) : null}

          <Button
            title={
              isPending
                ? 'Saving...'
                : isEditing
                  ? 'Save education details'
                  : 'Continue'
            }
            onPress={handleSetup}
            disabled={!selectedInstId || !selectedProgId || isPending}
          />
          {!isEditing ? (
            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleSkip}
              className="mt-4 items-center py-3"
            >
              <Text className="font-semibold text-slate-500 dark:text-slate-400">
                I’ll add this later
              </Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default AcademicSetupScreen;
