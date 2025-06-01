import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface VideoControlsProps {
  isGenerating: boolean;
  projectStatus: string;
  onGenerateCaptions: () => void;
  onShowCaptionControls: () => void;
  onShowScriptModal: () => void;
}

export const VideoControls = ({
  isGenerating,
  projectStatus,
  onGenerateCaptions,
  onShowCaptionControls,
  onShowScriptModal,
}: VideoControlsProps) => {
  return (
    <View className="absolute bottom-0 left-0 right-0 py-6 bg-secondary pb-safe">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
        contentContainerClassName="gap-6 px-6"
      >
        <TouchableOpacity
          onPress={onGenerateCaptions}
          disabled={isGenerating || projectStatus === 'processing'}
          className="items-center"
        >
          <MaterialIcons
            name="auto-awesome"
            size={24}
            color={isGenerating || projectStatus === 'processing' ? '#9CA3AF' : 'white'}
          />
          <Text
            className={`text-xs mt-1 ${isGenerating || projectStatus === 'processing' ? 'text-gray-400' : 'text-white'}`}
          >
            Generate
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onShowCaptionControls}
          disabled={isGenerating || projectStatus === 'processing'}
          className="items-center"
        >
          <MaterialIcons
            name="closed-caption"
            size={24}
            color={isGenerating || projectStatus === 'processing' ? '#9CA3AF' : 'white'}
          />
          <Text
            className={`text-xs mt-1 ${isGenerating || projectStatus === 'processing' ? 'text-gray-400' : 'text-white'}`}
          >
            Captions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onShowScriptModal} className="items-center">
          <MaterialIcons name="description" size={24} color="white" />
          <Text className="text-white text-xs mt-1">Scripting</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center">
          <MaterialIcons name="style" size={24} color="white" />
          <Text className="text-white text-xs mt-1">Styling</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center">
          <MaterialIcons name="aspect-ratio" size={24} color="white" />
          <Text className="text-white text-xs mt-1">Aspect Ratio</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center">
          <MaterialIcons name="zoom-in" size={24} color="white" />
          <Text className="text-white text-xs mt-1">Zoom</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center">
          <FontAwesome name="microphone" size={24} color="white" />
          <Text className="text-white text-xs mt-1">AI Dub</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
