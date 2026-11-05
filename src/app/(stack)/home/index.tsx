import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiUrl } from '../../../config/api';

const authenticate = async (params: { usuario?: string; passwd?: string }) => {
    try {
        const body = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value) body.append(key, value);
        });

        body.append("token", "U1RPRHIyVVFGUHFvMSsyeXNCemdNUElMY21FRDRoMW5PcWZnM215R1VyQT0=");

        const response = await fetch(apiUrl("singin"), {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body.toString(),
        });

        const text = await response.text();
        if (!text) {
            console.log("Respuesta vacía del servidor, status:", response.status);
            return null;
        }

        try {
            return JSON.parse(text);
        } catch {
            console.log("Respuesta no es JSON:", response.status, text);
            return null;
        }
    } catch (error) {
        console.log("Error al consumir API:", error);
        return null;
    }
};

const HomeScreen = () => {
    const { width: screenWidth } = useWindowDimensions();
    const [mounted, setMounted] = useState(false);
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => setMounted(true), []);

    const login = async () => {
        if (!usuario || !password) {
            Alert.alert('Error', 'Completa todos los campos');
            return;
        }

        const data = await authenticate({ usuario, passwd: password });
        console.log('Respuesta de autenticación:', data);
        if (data?.status) {
            Alert.alert('Login', 'Inicio de sesión correcto');
            router.push({ pathname: './cards' });
        } else {
            Alert.alert('Error', 'Usuario o contraseña incorrectos');
        }

    };


    return (
        <SafeAreaView style={{ backgroundColor: '#fc0' }}>
            <View style={styles.container}>
                <Image
                    source={require('../../../../assets/images/dhl.png')}
                    style={styles.logo}
                    resizeMode="contain"
                    className="mt-40"
                />

                <Text style={styles.title}>Iniciar Sesión</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={usuario}
                    onChangeText={setUsuario}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.button} onPress={login}>
                    <Text style={styles.buttonText}>Sign in</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        // <SafeAreaView>
        //     <View className="mt-10 mb-10" style={{ minHeight: 400 }}>
        //         <Text className="text-lg text-center font-bold mb-10">Progress Chart</Text>
        //         {mounted && <ProgressChart
        //             data={{
        //                 labels: ['En ruta', 'En corralon', 'En taller', 'Sin actividad', 'Sin conexión'],
        //                 data: [0.2, 0.4, 0.2, 0.8, 0.9],
        //                 colors: ['blue', 'red', 'gray', 'purple', 'yellow'],

        //             }}
        //             valueKey="progress"
        //             labelKey="metric"
        //             width={screenWidth}
        //             height={350}
        //             hideLegend={false}
        //             centerLabel={({ average }) => `${Math.round(average * 100)}%`}
        //         />}
        //     </View>
        //     <View className="px-10 mt-10">
        //         <CustomButton
        //             children="Calculator cards"
        //             onPress={() => router.push('./cards/[detail]')}
        //         />
        //     </View>
        // </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 25,
        backgroundColor: '#fc0',
        minHeight: 400,
    },
    logo: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
        color: '#d40511',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#d40511',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    link: {
        textAlign: 'center',
        color: '#d40511',
        marginTop: 20,
        display: 'none', // Oculta el enlace de "¿Olvidaste tu contraseña?"
    },
});

export default HomeScreen;