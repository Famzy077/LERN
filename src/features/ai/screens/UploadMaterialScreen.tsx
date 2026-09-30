import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { Upload } from 'lucide-react-native';
import { ScreenWrapper } from '@/shared/components/layout/ScreenWrapper';
import { Button } from '@/shared/components/ui/Button';
import { useProcessMaterial, useUploadMaterial } from '../hooks/useUpload';

export default function UploadMaterialScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const courseId = route.params?.courseId;

  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [materialId, setMaterialId] = useState<string | null>(null);

  const uploadMutation = useUploadMaterial();
  const processMutation = useProcessMaterial();

  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;
      
      const file = result.assets[0];
      setSelectedFile(file);
      setProgress(0);
      setUploadComplete(false);
      setMaterialId(null);
      processMutation.reset();
      
      uploadFile(file);
    } catch (err) {
      Alert.alert('Error', 'Failed to pick a document');
    }
  };

  const uploadFile = (file: any) => {
    uploadMutation.mutate({
      data: {
        courseId,
        file: {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
        }
      },
      onProgress: (pct) => setProgress(pct),
    }, {
      onSuccess: (res) => {
        if (res.data?.id) {
          setMaterialId(res.data.id);
          setProgress(100);
          processMutation.mutate(res.data.id, {
            onSuccess: () => setUploadComplete(true),
            onError: (error) => {
              Alert.alert('Summary generation failed', error.message || 'Please try again.');
            },
          });
        } else {
          Alert.alert('Upload Failed', 'The server did not return an ID for the uploaded material.');
        }
      },
      onError: (error) => {
        Alert.alert('Upload Failed', error.message || 'Something went wrong');
        setSelectedFile(null);
        setProgress(0);
      }
    });
  };

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${progress}%`, { duration: 300, easing: Easing.inOut(Easing.ease) })
    };
  });

  return (
    <ScreenWrapper padded={false}>
      <View className="flex-1 p-4 bg-surface dark:bg-slate-900">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Text className="text-primary font-bold">Back</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-slate-900 dark:text-slate-50 ml-4">Upload Material</Text>
        </View>

        {!uploadComplete ? (
          <>
            <TouchableOpacity
              onPress={handleSelectFile}
              disabled={uploadMutation.isPending || processMutation.isPending}
              className={`border-2 border-dashed rounded-3xl p-8 items-center justify-center flex-1 bg-white dark:bg-slate-800 ${
                uploadMutation.isPending || processMutation.isPending ? 'border-slate-300 dark:border-slate-600' : 'border-primary'
              }`}
            >
              <Upload size={48} className="text-primary mb-4" />
              <Text className="text-lg font-semibold text-slate-900 dark:text-slate-50 text-center mb-2">
                Tap to select PDF, DOCX, or image
              </Text>
              {selectedFile && (
                <View className="mt-6 w-full items-center">
                  <Text className="text-slate-500 mb-2 truncate">{selectedFile.name}</Text>
                  <View className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <Animated.View className="h-full bg-primary" style={progressStyle} />
                  </View>
                  <Text className="text-slate-500 mt-2">{progress}%</Text>
                  {processMutation.isPending && (
                    <View className="mt-5 items-center">
                      <View
                        className="h-14 w-14 items-center justify-center rounded-full bg-primary/10"
                        accessibilityRole="progressbar"
                        accessibilityLabel="Generating summary"
                      >
                        <ActivityIndicator size="large" color="#2563EB" />
                      </View>
                      <Text className="text-slate-500 mt-3">Generating your AI summary...</Text>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
            {processMutation.isError && materialId && (
              <Button
                title="Retry summary generation"
                onPress={() => processMutation.mutate(materialId, {
                  onSuccess: () => setUploadComplete(true),
                  onError: (error) => {
                    Alert.alert('Summary generation failed', error.message || 'Please try again.');
                  },
                })}
                loading={processMutation.isPending}
                className="mt-4 w-full bg-primary"
              />
            )}
          </>
        ) : (
          <View className="flex-1 items-center justify-center bg-white dark:bg-slate-800 rounded-3xl p-6">
            <Text className="text-2xl font-bold text-success mb-4 text-green-600">Success!</Text>
            <Text className="text-slate-500 mb-8 text-center">Your material has been uploaded and processed.</Text>
            <Button
              title="View Summary"
              onPress={() => materialId && navigation.navigate('AISummary', { materialId })}
              className="w-full bg-primary"
            />
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}
