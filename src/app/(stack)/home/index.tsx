import { router } from 'expo-router';
import { Text, useWindowDimensions, View } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit/v2';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../../../components/shared/CustomButton';

const HomeScreen = () => {
    const { width: screenWidth } = useWindowDimensions();

    return (
        <SafeAreaView>
            <View className="mt-10 mb-10">
                <Text className="text-lg text-center font-bold mb-10">Progress Chart</Text>
                <ProgressChart
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
                />
            </View>
            <View className="px-10 mt-10">
                {/* <Text className="mb-5">Home</Text> */}
                {/* <Link className='mb-5' href="./cards" asChild><CustomButton color="primary" children="Go to Cards" >cads</CustomButton></Link>
                <Link className='mb-5' href="./graph" asChild><CustomButton color="secondary" children="Go to Graph" >graph</CustomButton></Link> */}
                <CustomButton
                    children="Calculator cards"
                    onPress={() => router.push('./cards')}
                />
                {/* <CustomButton
                    children="Go to Graph"
                    color="secondary"
                    onPress={() => router.push('./graph')}
                    onLongPress={() => {}}
                /> */}
                {/* <Link className='mb-5' href="./cards">Go to Cards</Link>
                <Link className='mb-5' href="./graph">Go to Graph</Link> */}
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;