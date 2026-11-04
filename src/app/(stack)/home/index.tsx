import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit/v2';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../../../components/shared/CustomButton';

const HomeScreen = () => {
    const { width: screenWidth } = useWindowDimensions();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <SafeAreaView>
            <View className="mt-10 mb-10" style={{ minHeight: 400 }}>
                <Text className="text-lg text-center font-bold mb-10">Progress Chart</Text>
                {mounted && <ProgressChart
                    data={{
                        labels: ['En ruta', 'En corralon', 'En taller', 'Sin actividad', 'Sin conexión'],
                        data: [0.2, 0.4, 0.2, 0.8, 0.9],
                        colors: ['blue', 'red', 'gray', 'purple', 'yellow'],

                    }}
                    valueKey="progress"
                    labelKey="metric"
                    width={screenWidth}
                    height={350}
                    hideLegend={false}
                    centerLabel={({ average }) => `${Math.round(average * 100)}%`}
                />}
            </View>
            <View className="px-10 mt-10">
                <CustomButton
                    children="Calculator cards"
                    onPress={() => router.push('./cards/[detail]')}
                />
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;