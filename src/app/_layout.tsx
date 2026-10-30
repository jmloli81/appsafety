import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import "./global.css";


const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    'work-black': require('../../assets/fonts/WorkSans-Black.ttf'),
    'work-light': require('../../assets/fonts/WorkSans-Light.ttf'),
    'work-medium': require('../../assets/fonts/WorkSans-Medium.ttf'),
  });

  useEffect(() => {
    if (error) {
      throw error;
    }

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
      <Slot />
  )
}

export default RootLayout