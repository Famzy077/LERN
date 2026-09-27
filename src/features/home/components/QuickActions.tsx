import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Upload, BrainCircuit, FileText, Layers } from 'lucide-react-native';

const iconMap: any = {
  upload: Upload,
  quiz: BrainCircuit,
  summary: FileText,
  flashcards: Layers,
};

interface Action {
  id: string;
  label: string;
  icon: string;
  route: string;
}

interface Props {
  actions: Action[];
}

const QuickActions = ({ actions }: Props) => {
  const navigation = useNavigation<any>();

  return (
    <View className="px-6 mb-8">
      <View className="flex-row flex-wrap justify-between gap-y-4">
        {actions.map((action) => {
          const Icon = iconMap[action.icon] || Layers;
          return (
            <TouchableOpacity
              key={action.id}
              onPress={() => navigation.navigate(action.route)}
              className="w-[48%] bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm items-center justify-center aspect-square"
            >
              <View className="bg-primary/10 p-4 rounded-2xl mb-3">
                <Icon size={32} className="text-primary" />
              </View>
              <Text className="text-slate-900 dark:text-slate-50 font-medium text-center">
                {action.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default QuickActions;
