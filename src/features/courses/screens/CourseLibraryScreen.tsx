import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Plus } from 'lucide-react-native';
import { ScreenWrapper } from '@/shared/components/layout/ScreenWrapper';
import { SearchBar } from '@/shared/components/ui/SearchBar';
import { CourseCard } from '@/shared/components/cards/CourseCard';
import { SkeletonCard as LoadingSkeleton } from '@/shared/components/ui/LoadingSkeleton';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { useCourses } from '../hooks/useCourses';
import { useDebounce } from '@/shared/hooks/useDebounce'; // Assuming useDebounce exists

const FILTERS = ['All', 'In Progress', 'Completed'];

const CourseLibraryScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [activeFilter, setActiveFilter] = useState('All');

  const { data, isLoading, refetch, isRefetching } = useCourses(debouncedSearch);

  const courses = data?.data || [];
  
  const filteredCourses = courses.filter((course) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'In Progress') return course.progress > 0 && course.progress < 100;
    if (activeFilter === 'Completed') return course.progress === 100;
    return true;
  });

  return (
    <ScreenWrapper className="flex-1 bg-surface dark:bg-slate-900">
      <View className="px-6 pt-4 pb-2">
        <Text className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">
          My Courses
        </Text>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search courses..."
        />
        
        <View className="flex-row mt-4 gap-2">
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full border ${
                activeFilter === filter
                  ? 'bg-primary border-primary'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Text
                className={`font-medium ${
                  activeFilter === filter ? 'text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isLoading ? (
        <View className="px-6 flex-row flex-wrap justify-between">
          <LoadingSkeleton className="w-[48%] h-48 mb-4 rounded-3xl" />
          <LoadingSkeleton className="w-[48%] h-48 mb-4 rounded-3xl" />
          <LoadingSkeleton className="w-[48%] h-48 mb-4 rounded-3xl" />
          <LoadingSkeleton className="w-[48%] h-48 mb-4 rounded-3xl" />
        </View>
      ) : (
        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          ListEmptyComponent={
            <EmptyState
              title="No courses found"
              message="You haven't added any courses yet or none match your search."
            />
          }
          renderItem={({ item }) => (
            <View className="w-[48%]">
              <CourseCard id={item.id} title={item.title} subject={item.subject} progress={item.progress} totalTopics={item.totalTopics} completedTopics={item.completedTopics} lastAccessed={item.lastAccessed} onPress={() => {}} />
            </View>
          )}
        />
      )}

      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg"
        onPress={() => {}}
      >
        <Plus size={24} className="text-white" />
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

export default CourseLibraryScreen;
