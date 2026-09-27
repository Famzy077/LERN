#!/bin/bash

# AI Summary Badge
sed -i 's|<Badge variant={summary.difficulty === '"'"'advanced'"'"' ? '"'"'error'"'"' : summary.difficulty === '"'"'intermediate'"'"' ? '"'"'warning'"'"' : '"'"'success'"'"'}>|<Badge label={summary.difficulty} variant={summary.difficulty === '"'"'advanced'"'"' ? '"'"'error'"'"' : summary.difficulty === '"'"'intermediate'"'"' ? '"'"'warning'"'"' : '"'"'success'"'"'} />|g' src/features/ai/screens/AISummaryScreen.tsx
sed -i 's|{summary.difficulty}||g' src/features/ai/screens/AISummaryScreen.tsx
sed -i 's|</Badge>||g' src/features/ai/screens/AISummaryScreen.tsx

# Auth Hook
sed -i 's|setAuth(response.data);|setAuth(response.data.user, response.data.accessToken, response.data.refreshToken);|g' src/features/auth/hooks/useAuth.ts
sed -i 's|state.clearAuth|state.logout|g' src/features/auth/hooks/useAuth.ts

# Course Library Empty State
sed -i 's|description="You|message="You|g' src/features/courses/screens/CourseLibraryScreen.tsx

# CourseCard in Home and Course Library
sed -i 's|course={course} onPress={() => {}}|id={course.id} title={course.title} subject={course.subject} progress={course.progress} totalTopics={course.totalTopics} completedTopics={course.completedTopics} lastAccessed={course.lastAccessed} onPress={() => {}}|g' src/features/home/components/ContinueStudying.tsx
sed -i 's|course={item}|id={item.id} title={item.title} subject={item.subject} progress={item.progress} totalTopics={item.totalTopics} completedTopics={item.completedTopics} lastAccessed={item.lastAccessed} onPress={() => {}}|g' src/features/courses/screens/CourseLibraryScreen.tsx

# StreakWidget in Home
sed -i 's|streak={dashboard.streak.current}|currentStreak={dashboard.streak.current}|g' src/features/home/screens/HomeScreen.tsx

# XPBadge in Home
sed -i 's|total={dashboard.xp.total}|xp={dashboard.xp.total}|g' src/features/home/screens/HomeScreen.tsx

# ProgressCard in Home
sed -i 's|progress={dashboard.examReadiness.overall}|value={dashboard.examReadiness.overall}|g' src/features/home/screens/HomeScreen.tsx
sed -i 's|details=|subtitle=|g' src/features/home/screens/HomeScreen.tsx

# StreakWidget in Progress
sed -i 's|longest={progress.studyStreak.longest}||g' src/features/progress/screens/ProgressScreen.tsx
sed -i 's|thisMonth={progress.studyStreak.thisMonth}||g' src/features/progress/screens/ProgressScreen.tsx

# Subscription ErrorState
find src/features -type f -name "*.tsx" -exec sed -i 's|<ErrorState onRetry={() => {}} />|<ErrorState message="An error occurred" onRetry={() => {}} />|g' {} +
