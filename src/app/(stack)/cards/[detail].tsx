import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit/v2';
import { SafeAreaView } from 'react-native-safe-area-context';
import KpiCard from '../../../../components/shared/KpiCard';
import { apiUrl } from '../../../config/api';

const getIndicadores = async (params: { region?: string; subregion?: string; iata?: string; vehicle?: string; fecha_inicio?: string; fecha_fin?: string }) => {
    try {
        const body = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value) body.append(key, value);
        });

        body.append("token", "U1RPRHIyVVFGUHFvMSsyeXNCemdNUElMY21FRDRoMW5PcWZnM215R1VyQT0=");

        const response = await fetch(apiUrl("dataIndicadores"), {
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


const DetailScreen = () => {
    const [indicadores, setIndicadores] = useState<{
        data?: {
            total_vehiculo?: number | string;
            total_viaje?: number | string;
            total_tiempo?: number | string;
            total_mdvr?: number | string;
            total_km?: number | string;
            total_incidentes?: number | string;
            total_diesel?: number | string;
            total_consumo?: number | string;
        }[];
        getCards?: { id: number; tipo: string; total: number }[];
        total_activos?: number | string;
    } | null>(null);

    const [totalActivos, setTotalActivos] = useState<{
        totalActivos?: number | string;
        
    } | null>(null);

    const { fecha_inicio, fecha_fin, detail, region, subregion, iata, vehicle } = useLocalSearchParams<{
        detail: string;
        region?: string;
        subregion?: string;
        iata?: string;
        vehicle?: string;
        fecha_inicio?: string;
        fecha_fin?: string;
    }>();

    const { width: screenWidth } = useWindowDimensions();

    //console.log({ detail, region, subregion, iata, vehicle });

    useEffect(() => {
        getIndicadores({ region, subregion, iata, vehicle, fecha_inicio, fecha_fin }).then(setIndicadores);
    }, [region, subregion, iata, vehicle, fecha_inicio, fecha_fin]);

    const totalVehiculos = indicadores?.data?.[0]?.total_vehiculo ?? indicadores?.data?.[0]?.total_vehiculo;
    const totalDetenido = Number(totalVehiculos) - Number(indicadores?.total_activos ?? 0);

    const cardTotales = useMemo(
        () => Object.fromEntries((indicadores?.getCards ?? []).map(c => [c.tipo, c.total])) as Record<string, number | undefined>,
        [indicadores]
    );

    useEffect(() => {
        if (indicadores && totalVehiculos === undefined) {
            console.error("La respuesta de dataIndicadores no incluye total_vehiculos ni total_vehiculo:", indicadores);
        }
    }, [indicadores, totalVehiculos]);

    // cardTotales.wialon_inactivo
    // cardTotales.wialon_sin_iata
    // cardTotales.wialon_total_objetos
    // cardTotales.wialon_taller
    // cardTotales.wialon_corralon
    // cardTotales.wialon_sin_actualizar_h1
    // cardTotales.wialon_sin_operacion
    // cardTotales.wialon_flota_sis



    return (
        <SafeAreaView className='flex-1'>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header */}
                <View className='mt-4'>
                    <Text className='px-10 text-lg font-bold'>{detail}</Text>
                    {/* <Text className='px-10'>Region: {region || '-'}</Text>
                <Text className='px-10'>Subregion: {subregion || '-'}</Text>
                <Text className='px-10'>Iata: {iata || '-'}</Text>
                <Text className='px-10'>Vehicle: {vehicle || '-'}</Text> */}
                </View>

                {/* Filtros */}
                <View className='px-10 mt-4 flex-row justify-between'>
                    <Text className='font-bold'>Fecha Inicio</Text>
                    <Text className='ml-2'>{fecha_inicio || '-'}</Text>
                    <Text className='font-bold ml-3'>Fecha Fin</Text>
                    <Text className='ml-2'>{fecha_fin || '-'}</Text>
                </View>

                {/* GRAFICA */}
                <View className="mt-4">
                    <ProgressChart
                        data={{
                            labels: ['En ruta', 'En corralon', 'En taller', 'Sin actividad', 'Sin conexión'],
                            data: [(Number(indicadores?.total_activos ?? 1) / Number(totalVehiculos)), 
                                (cardTotales?.wialon_corralon ?? 1) / Number(totalVehiculos), 
                                (cardTotales?.wialon_taller ?? 1) / Number(totalVehiculos), 
                                (cardTotales?.wialon_sin_operacion ?? 1) / Number(totalVehiculos), 
                                (cardTotales?.wialon_inactivo ?? 1)  / Number(totalVehiculos)],
                            colors: ['blue', 'red', 'gray', 'purple', 'yellow'],

                        }}
                        valueKey="progress"
                        labelKey="metric"
                        width={screenWidth}
                        height={350}
                        // chartConfig={{
                        //     backgroundColor: '#e26a00',
                        //     backgroundGradientFrom: '#fb8c00',
                        //     backgroundGradientTo: '#ffa726',
                        //     decimalPlaces: 2,
                        //     color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        //     // labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        //     propsForLabels: {
                        //         fontSize: 12,
                        //         fill: '#fff'
                        //     }
                        // }}
                        hideLegend={false}
                        // withCustomBarColorFromData={true}
                        centerLabel={({ average }) => `${Math.round(average * 100)}%`}
                    />
                </View>

                {/* KPI CARD */}

                <View className="px-10 mt-4 flex-row flex-wrap justify-between">
                    <View className="w-[48%] mb-4">
                        <KpiCard
                            title="Total Vehículos"
                            value={totalVehiculos ?? '—'}
                            subtitle="Actualizado hoy"
                            color="#76A115"
                            icon="car"
                        />
                    </View>
                    {/* <View className="w-[48%] mb-4">
                        <KpiCard
                            title="Total Viajes"
                            value={indicadores?.data?.[0]?.total_viaje ?? '—'}
                            subtitle="Actualizado hoy"
                            color="#3498db"
                            icon="truck-plane"
                        />
                    </View> */}
                    <View className="w-[48%] mb-4">
                        <KpiCard
                            title="Total dispositivos"
                            value={cardTotales?.wialon_total_objetos ?? '—'}
                            subtitle="Actualizado hoy"
                            color="#76A115"
                            icon="location-pin"
                        />
                    </View>
                    <View className="w-[48%] mb-4">
                        <KpiCard
                            title="Total MDVR"
                            value={indicadores?.data?.[0]?.total_mdvr ?? '—'}
                            subtitle="Actualizado hoy"
                            color="#76A115"
                            icon="camera"
                        />
                    </View>
                    <View className="w-[48%] mb-4">
                        <KpiCard
                            title="Activo"
                            value={indicadores?.total_activos ?? '—'}
                            subtitle="Actualizado hoy"
                            color="#A5D92E"
                            icon="chart-pie"
                        />
                    </View>
                    <View className="w-[48%] mb-4">
                        <KpiCard
                            title="Detenido"
                            value={totalDetenido}
                            subtitle="Actualizado hoy"
                            color="#EDDC6F"
                            icon="stop-circle"
                        />
                    </View>
                    <View className="w-[48%] mb-4">
                        <KpiCard
                            title="Sin operación"
                            value={cardTotales?.wialon_sin_operacion ?? '—'}
                            subtitle="Actualizado hoy"
                            color="#CF4023"
                            icon="stopwatch"
                        /></View>
                    <View className="w-[48%] mb-4">
                        <KpiCard
                            title="Taller"
                            value={cardTotales?.wialon_taller ?? '—'}
                            subtitle="Actualizado hoy"
                            color="#E69525"
                            icon="screwdriver-wrench"
                        />
                    </View>
                    <View className="w-[48%] mb-4">
                        <KpiCard
                            title="Corralón"
                            value={cardTotales?.wialon_corralon ?? '—'}
                            subtitle="Actualizado hoy"
                            color="#E69525"
                            icon="house-crack"
                        />
                    </View>
                    <View className="w-[48%] mb-4">
                        <KpiCard
                            title="Sin reporte"
                            value={cardTotales?.wialon_sin_operacion ?? '—'}
                            subtitle="Actualizado hoy"
                            color="#CF4023"
                            icon="screwdriver-wrench"
                        />
                    </View>
                    <View className="w-[48%] mb-4">
                        <KpiCard
                            title="Sin GPS"
                            value={cardTotales?.wialon_sin_operacion ?? '—'}
                            subtitle="Actualizado hoy"
                            color="#CF4023"
                            icon="house-crack"
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView >
    );
};

export default DetailScreen;
