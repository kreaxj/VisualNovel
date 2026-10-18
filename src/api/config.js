import { Platform } from "react-native";
import Constants from 'expo-constants';

const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return '/data'; 
  }

  if (__DEV__) {
    const hostUri = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
    
    if (hostUri) {
      const ip = hostUri.split(':')[0];
      return `http://${ip}:8081/data`; 
    }
  }

  return 'https://kreaxj.github.io/VisualNovel/data';
};

export const BASE = process.env.EXPO_PUBLIC_STORY_BASE || getBaseUrl();