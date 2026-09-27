import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useTheme } from '@/shared/hooks/useTheme';
import { clsx } from 'clsx';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search...',
  className,
}: SearchBarProps) {
  const { colors } = useTheme();

  return (
    <View
      className={clsx(
        'flex-row items-center rounded-2xl bg-slate-100 px-4 dark:bg-slate-800',
        className,
      )}
    >
      <Search size={20} color={colors.textSecondary} />
      <TextInput
        className="ml-3 flex-1 py-3 text-base font-inter-regular text-slate-900 dark:text-slate-50"
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} hitSlop={8}>
          <X size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}
