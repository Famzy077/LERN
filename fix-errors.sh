#!/bin/bash

# Fix imports in auth
sed -i 's|@/shared/components/ui/Button|@/shared/components/ui/Button|g' src/features/auth/screens/*.tsx
sed -i 's|import Button |import { Button } |g' src/features/auth/screens/*.tsx
sed -i 's|import ScreenWrapper |import { ScreenWrapper } |g' src/features/auth/screens/*.tsx
sed -i 's|@/shared/components/ScreenWrapper|@/shared/components/layout/ScreenWrapper|g' src/features/auth/screens/*.tsx
sed -i 's|import Input |import { Input } |g' src/features/auth/screens/*.tsx

# Fix auth service return
sed -i 's|return response as any|return response|g' src/features/auth/hooks/useAuth.ts

# Fix courses imports
sed -i 's|import ScreenWrapper |import { ScreenWrapper } |g' src/features/courses/screens/*.tsx
sed -i 's|@/shared/components/ScreenWrapper|@/shared/components/layout/ScreenWrapper|g' src/features/courses/screens/*.tsx
sed -i 's|import SearchBar |import { SearchBar } |g' src/features/courses/screens/*.tsx
sed -i 's|import CourseCard |import { CourseCard } |g' src/features/courses/screens/*.tsx
sed -i 's|@/shared/components/CourseCard|@/shared/components/cards/CourseCard|g' src/features/courses/screens/*.tsx
sed -i 's|import LoadingSkeleton |import { SkeletonCard as LoadingSkeleton } |g' src/features/courses/screens/*.tsx
sed -i 's|@/shared/components/LoadingSkeleton|@/shared/components/ui/LoadingSkeleton|g' src/features/courses/screens/*.tsx
sed -i 's|import EmptyState |import { EmptyState } |g' src/features/courses/screens/*.tsx
sed -i 's|@/shared/components/EmptyState|@/shared/components/feedback/EmptyState|g' src/features/courses/screens/*.tsx
sed -i 's|apiClient.get(ENDPOINTS.COURSES, { params })|apiClient.get(ENDPOINTS.COURSES, { params }) as any|g' src/features/courses/services/course.service.ts

# Fix home imports
sed -i 's|import CourseCard |import { CourseCard } |g' src/features/home/components/ContinueStudying.tsx
sed -i 's|@/shared/components/CourseCard|@/shared/components/cards/CourseCard|g' src/features/home/components/ContinueStudying.tsx

sed -i 's|import ScreenWrapper |import { ScreenWrapper } |g' src/features/home/screens/HomeScreen.tsx
sed -i 's|@/shared/components/ScreenWrapper|@/shared/components/layout/ScreenWrapper|g' src/features/home/screens/HomeScreen.tsx
sed -i 's|import StreakWidget |import { StreakWidget } |g' src/features/home/screens/HomeScreen.tsx
sed -i 's|@/shared/components/StreakWidget|@/shared/components/cards/StreakWidget|g' src/features/home/screens/HomeScreen.tsx
sed -i 's|import XPBadge |import { XPBadge } |g' src/features/home/screens/HomeScreen.tsx
sed -i 's|@/shared/components/XPBadge|@/shared/components/cards/XPBadge|g' src/features/home/screens/HomeScreen.tsx
sed -i 's|import ProgressCard |import { ProgressCard } |g' src/features/home/screens/HomeScreen.tsx
sed -i 's|@/shared/components/ProgressCard|@/shared/components/cards/ProgressCard|g' src/features/home/screens/HomeScreen.tsx
sed -i 's|import LoadingSkeleton |import { SkeletonCard as LoadingSkeleton } |g' src/features/home/screens/HomeScreen.tsx
sed -i 's|@/shared/components/LoadingSkeleton|@/shared/components/ui/LoadingSkeleton|g' src/features/home/screens/HomeScreen.tsx
sed -i 's|import ErrorState |import { ErrorState } |g' src/features/home/screens/HomeScreen.tsx
sed -i 's|@/shared/components/ErrorState|@/shared/components/feedback/ErrorState|g' src/features/home/screens/HomeScreen.tsx

# Fix AI
sed -i 's|<ErrorState />|<ErrorState message="Failed to load summary" />|g' src/features/ai/screens/AISummaryScreen.tsx
sed -i 's|<ErrorState onRetry={() => refetch()} />|<ErrorState message="Failed to load summary" onRetry={() => refetch()} />|g' src/features/ai/screens/AISummaryScreen.tsx

# Fix ErrorState missing message prop
find src/features -type f -name "*.tsx" -exec sed -i 's|<ErrorState onRetry={refetch} />|<ErrorState message="An error occurred" onRetry={refetch} />|g' {} +
find src/features -type f -name "*.tsx" -exec sed -i 's|<ErrorState onRetry={() => {}} />|<ErrorState message="An error occurred" onRetry={() => {}} />|g' {} +

# Fix ProgressCard props
sed -i 's|size="large"|size="lg"|g' src/features/progress/screens/ProgressScreen.tsx
sed -i 's|progress={progress.quizAccuracy}|value={progress.quizAccuracy} title="Quiz Accuracy"|g' src/features/progress/screens/ProgressScreen.tsx
sed -i 's|size="large"|size="lg"|g' src/features/quiz/screens/QuizResultScreen.tsx
sed -i 's|progress={accuracy}|value={accuracy} title="Accuracy"|g' src/features/quiz/screens/QuizResultScreen.tsx
sed -i 's|progress={|value={|g' src/features/quiz/screens/QuizResultScreen.tsx

# Fix StreakWidget props
sed -i 's|current={progress.studyStreak.current}|currentStreak={progress.studyStreak.current} weeklyData={progress.studyStreak.thisMonth.slice(-7).map(v => v>0)}|g' src/features/progress/screens/ProgressScreen.tsx
