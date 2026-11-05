import { Stack } from 'expo-router';

const StackLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerShadowVisible: false,
                contentStyle: {
                    backgroundColor: '#fc0',
                }
            }}>
            <Stack.Screen name="home/index" options={{ title: "Home" }} />
            <Stack.Screen name="cards/index" options={{ title: "Cards" }} />
            <Stack.Screen name="graph/index" options={{ title: "Graph" }} />
            {/* <Stack.Screen name="cards/[detail]" options={{ title: "Detail" }} /> */}
        </Stack>
    );
};

export default StackLayout;