import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit/v2';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../../../components/shared/CustomButton';
import KpiCard from '../../../../components/shared/KpiCard';
import { apiUrl } from '../../../config/api';

import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import MultiSelect from '../../../../components/shared/MultiSelect';

const formatDate = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const getRegiones = async () => {
    try {
        const response = await fetch(apiUrl("regiones"), {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ token: "U1RPRHIyVVFGUHFvMSsyeXNCemdNUElMY21FRDRoMW5PcWZnM215R1VyQT0=" }).toString(),
        });

        const data = await response.json();
        //console.log("Regiones:", data);
        if (!data?.status || !Array.isArray(data.data)) return [];
        return data.data.map((item: { id: string; name: string }) => ({
            value: String(item.id),
            label: item.name,
        }));
    } catch (error) {
        console.log("Error al consumir API:", error);
        return [];
    }
};

const getSubregiones = async (regionIds: string[]) => {
    try {
        const body = new URLSearchParams();
        if (regionIds.length) body.append("region", regionIds.join(","));
        body.append("token", "U1RPRHIyVVFGUHFvMSsyeXNCemdNUElMY21FRDRoMW5PcWZnM215R1VyQT0=");

        const response = await fetch(
            apiUrl("subregiones"),
            {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: body.toString(),
            }
        );

        const data = await response.json();
        //console.log("Subregiones:", data);
        if (!data?.status || !Array.isArray(data.data)) return [];
        return data.data.map((item: { id: string; name: string }) => ({
            value: String(item.id),
            label: item.name,
        }));
    } catch (error) {
        console.log("Error al consumir API:", error);
        return [];
    }
};

const getIata = async (subRegionIds: string[]) => {
    try {
        const body = new URLSearchParams();
        if (subRegionIds.length) body.append("subregion", subRegionIds.join(","));
        body.append("token", "U1RPRHIyVVFGUHFvMSsyeXNCemdNUElMY21FRDRoMW5PcWZnM215R1VyQT0=");

        const response = await fetch(
            apiUrl("iatas"),
            {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: body.toString(),
            }
        );

        const data = await response.json();
        //console.log("Iata:", data);
        if (!data?.status || !Array.isArray(data.data)) return [];
        return data.data.map((item: { id: string; name: string }) => ({
            value: String(item.id),
            label: item.name,
        }));
    } catch (error) {
        console.log("Error al consumir API:", error);
        return [];
    }
};

const getVehicle = async (iataIds: string[]) => {
    try {
        const response = await fetch(
            apiUrl("vehiculos"),
            {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ iata: iataIds.join(","), token: "U1RPRHIyVVFGUHFvMSsyeXNCemdNUElMY21FRDRoMW5PcWZnM215R1VyQT0=" }).toString(),
            }
        );

        const data = await response.json();
        //console.log("Vehicle:", data);
        if (!data?.status || !Array.isArray(data.data)) return [];
        return data.data.map((item: { id: string; name: string }) => ({
            value: String(item.id),
            label: item.name,
        }));
    } catch (error) {
        console.log("Error al consumir API:", error);
        return [];
    }
};



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


type AppliedFilters = {
    fecha_inicio?: string;
    fecha_fin?: string;
    region?: string;
    subregion?: string;
    iata?: string;
    vehicle?: string;
};

const Cards = ({ filters, onOpenFilters }: { filters: AppliedFilters; onOpenFilters: () => void }) => {
    const [startDate] = useState(() => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const [endDate] = useState(() => new Date());

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

    const { fecha_inicio, fecha_fin, region, subregion, iata, vehicle } = filters;

    const { width: screenWidth } = useWindowDimensions();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const formatDate = (date: Date) => {
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    };
    const inicio = fecha_inicio || formatDate(startDate);
    const fin = fecha_fin || formatDate(endDate);

    useEffect(() => {
        getIndicadores({ region, subregion, iata, vehicle, fecha_inicio: inicio, fecha_fin: fin }).then(setIndicadores);
    }, [region, subregion, iata, vehicle, inicio, fin]);

    const totalVehiculos = indicadores?.data?.[0]?.total_vehiculo ?? indicadores?.data?.[0]?.total_vehiculo;
    const totalDetenido = totalVehiculos === undefined
        ? undefined
        : Number(totalVehiculos) - Number(indicadores?.total_activos ?? 0);

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
            {/* Header */}
            <View className='mt-10'>
                <Text className='px-10 text-lg font-black'>KPIS CARDS</Text>
            </View>

            {/* Filtros */}
            <View className='px-10'>
                <Text className='font-bold flex-column'>Dates</Text>
            </View>
            <View className='px-10 mb-4'>
                <Text>{inicio} - {fin}</Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* GRAFICA */}
                <View className="mt-2" style={{ minHeight: 350 }}>
                    {mounted && totalVehiculos !== undefined && <ProgressChart
                        data={{
                            labels: ['En ruta', 'En corralon', 'En taller', 'Sin actividad', 'Sin conexión'],
                            data: [(Number(indicadores?.total_activos ?? 1) / Number(totalVehiculos)),
                            (cardTotales?.wialon_corralon ?? 1) / Number(totalVehiculos),
                            (cardTotales?.wialon_taller ?? 1) / Number(totalVehiculos),
                            (cardTotales?.wialon_sin_operacion ?? 1) / Number(totalVehiculos),
                            (cardTotales?.wialon_inactivo ?? 1) / Number(totalVehiculos)],
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
                    />}
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
                            value={totalDetenido ?? '—'}
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
            <View className="bg-gray-200 mt-4 py-4 items-center justify-center" style={{ backgroundColor: '#fc0' }}>
                <CustomButton
                    children="Filters"
                    onPress={onOpenFilters}
                    color="primary"
                    style={{ marginBottom: 0, paddingHorizontal: 100 }}
                />
            </View>
        </SafeAreaView >
    );
};


const Filters = ({ onApply }: { onApply: (filters: AppliedFilters) => void }) => {
    const [surveyorData, setSurveyorData] = useState<{ label: string; value: string }[]>([]);
    const [subregionData, setSubregionData] = useState<{ label: string; value: string }[]>([]);
    const [iataData, setIataData] = useState<{ label: string; value: string }[]>([]);
    const [vehicleData, setVehicleData] = useState<{ label: string; value: string }[]>([]);

    const [selectedRegion, setSelectedRegion] = useState<string[]>([]);
    const [selectedSubregion, setSelectedSubregion] = useState<string[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<string[]>([]);
    const [selectedIata, setSelectedIata] = useState<string[]>([]);
    const [startDate, setStartDate] = useState(() => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const [endDate, setEndDate] = useState(() => new Date());
    const [picking, setPicking] = useState<'start' | 'end' | null>(null);

    const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
        const target = picking;
        setPicking(null);
        if (event.type !== 'set' || !date || !target) return;
        if (target === 'start') {
            setStartDate(date);
            if (date > endDate) setEndDate(date);
        } else {
            setEndDate(date);
            if (date < startDate) setStartDate(date);
        }
    };

    const clearFilters = () => {
        setSelectedRegion([]);
        setSelectedSubregion([]);
        setSelectedIata([]);
        setSelectedVehicle([]);

        setSubregionData([]);
        setIataData([]);
        setVehicleData([]);

        setStartDate(
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );
        setEndDate(new Date());

        onApply({
            fecha_inicio: "",
            fecha_fin: "",
            region: "",
            subregion: "",
            iata: "",
            vehicle: "",
        });
    };

    useEffect(() => {
        getRegiones().then(setSurveyorData);
        clearFilters();
        // getVehicle().then(setVehicleData);
    }, []);

    useEffect(() => {
        setSelectedSubregion([]);
        let cancelled = false;
        getSubregiones(selectedRegion).then((data) => {
            if (!cancelled) setSubregionData(data);
        });
        return () => {
            cancelled = true;
        };
    }, [selectedRegion]);

    useEffect(() => {
        setSelectedIata([]);
        let cancelled = false;
        getIata(selectedSubregion).then((data) => {
            if (!cancelled) setIataData(data);
        });
        return () => {
            cancelled = true;
        };
    }, [selectedSubregion]);

    useEffect(() => {
        setSelectedVehicle([]);
        let cancelled = false;
        getVehicle(selectedIata).then((data) => {
            if (!cancelled) setVehicleData(data);
        });
        return () => {
            cancelled = true;
        };
    }, [selectedIata]);

    return (
        <SafeAreaView>
            <View>
                <Text className='px-10 text-lg font-bold'>Filters</Text>
                <View className="px-10 mt-5 flex-row justify-between">
                    <Pressable className="flex-1 mr-2 border border-gray-300 rounded-lg p-3" onPress={() => setPicking('start')} style={{ backgroundColor: 'white' }}>
                        <Text className="text-xs text-gray-500">Start date</Text>
                        <Text>{formatDate(startDate)}</Text>
                    </Pressable>
                    <Pressable className="flex-1 ml-2 border border-gray-300 rounded-lg p-3" onPress={() => setPicking('end')} style={{ backgroundColor: 'white' }}>
                        <Text className="text-xs text-gray-500">End date</Text>
                        <Text>{formatDate(endDate)}</Text>
                    </Pressable>
                </View>
                {picking && (
                    <DateTimePicker
                        value={picking === 'start' ? startDate : endDate}
                        mode="date"
                        maximumDate={new Date()}
                        onChange={onDateChange}
                    />
                )}

                <View className="px-10 mt-5" style={styles.container}>
                    <MultiSelect
                        options={surveyorData}
                        label="Select region"
                        value={selectedRegion}
                        onChange={(selectedValues) => {
                            //console.log(selectedValues);
                            setSelectedRegion(selectedValues);
                        }}
                    />
                </View>
                <View className="px-10 mt-5" style={styles.container}>
                    <MultiSelect
                        key={selectedRegion.join(",")}
                        options={subregionData}
                        label="Select subregion"
                        value={selectedSubregion}
                        onChange={(selectedValues) => {
                            //console.log(selectedValues);
                            setSelectedSubregion(selectedValues);
                        }}
                    />
                </View>
                <View className="px-10 mt-5" style={styles.container}>
                    <MultiSelect
                        options={iataData}
                        label="Iata"
                        value={selectedIata}
                        onChange={(selectedValues) => {
                            setSelectedIata(selectedValues);
                        }}
                    />
                </View>
                <View className="px-10 mt-5" style={styles.container}>
                    <MultiSelect
                        options={vehicleData}
                        label="Vehicle"
                        value={selectedVehicle}
                        onChange={(selectedValues) => {
                            setSelectedVehicle(selectedValues);
                        }}
                    />
                </View>


                <View className="px-10 mt-5 flex-row gap-3">
                    <View style={{ flex: 1 }}>
                        <CustomButton
                            children="Apply Filters"
                            color="primary"
                            onPress={() =>
                                onApply({
                                    fecha_inicio: formatDate(startDate),
                                    fecha_fin: formatDate(endDate),
                                    region: selectedRegion.join(','),
                                    subregion: selectedSubregion.join(','),
                                    iata: selectedIata.join(','),
                                    vehicle: selectedVehicle.join(','),
                                })
                            }
                            onLongPress={() => { }}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <CustomButton
                            children="Clear Filters"
                            color="secondary"
                            onPress={clearFilters}
                            onLongPress={() => { }}
                        />
                    </View>

                </View>
            </View>
        </SafeAreaView>
    );
};

const DetailScreen = () => {
    const params = useLocalSearchParams<AppliedFilters>();
    const [filters, setFilters] = useState<AppliedFilters>({
        fecha_inicio: params.fecha_inicio,
        fecha_fin: params.fecha_fin,
        region: params.region,
        subregion: params.subregion,
        iata: params.iata,
        vehicle: params.vehicle,
    });
    const [showFilters, setShowFilters] = useState(false);

    // Ambas vistas siguen montadas para conservar la selección de filtros.
    return (
        <>
            <View style={{ flex: 1, display: showFilters ? 'none' : 'flex' }}>
                <Cards filters={filters} onOpenFilters={() => setShowFilters(true)} />
            </View>
            <View style={{ flex: 1, display: showFilters ? 'flex' : 'none' }}>
                <Filters
                    onApply={(applied) => {
                        setFilters(applied);
                        setShowFilters(false);
                    }}
                />
            </View>
        </>
    );
};

export default DetailScreen;


const styles = StyleSheet.create({
    container: {
        position: "relative",
        zIndex: 1,
        elevation: 999,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#333",
        zIndex: 1
    },
    selectContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        backgroundColor: "#fff",
        zIndex: 1
    },
    selectedValues: {
        fontSize: 14,
        color: "#555",
    },
    dropdown: {
        position: "absolute",
        top: 80, // ajusta según la altura del selector
        left: 0,
        right: 0,

        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,

        maxHeight: 250,

        zIndex: 9999,
        elevation: 10, // Android

        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 4,
        },
    },
    searchInput: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    option: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    optionText: {
        fontSize: 14,
        color: "#333",
    },
    selectedOption: {
        fontWeight: "bold",
        color: "#007bff",
    },
});
