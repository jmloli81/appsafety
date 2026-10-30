import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../../../components/shared/CustomButton';
import MultiSelect from '../../../../components/shared/MultiSelect';
import { apiUrl } from '../../../config/api';

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

const CardsScreen = () => {
    const [surveyorData, setSurveyorData] = useState<{ label: string; value: string }[]>([]);
    const [subregionData, setSubregionData] = useState<{ label: string; value: string }[]>([]);
    const [iataData, setIataData] = useState<{ label: string; value: string }[]>([]);
    const [vehicleData, setVehicleData] = useState<{ label: string; value: string }[]>([]);
    
    const [selectedRegion, setSelectedRegion] = useState<string[]>([]);
    const [selectedSubregion, setSelectedSubregion] = useState<string[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<string[]>([]);
    const [selectedIata, setSelectedIata] = useState<string[]>([]);

    // const surveyorData = [
    //     { value: "apple", label: "Apple" },
    //     { value: "banana", label: "Banana" },
    //     { value: "cherry", label: "Cherry" },
    //     { value: "grape", label: "Grape" },
    //     { value: "orange", label: "Orange" }
    // ];

    useEffect(() => {
        getRegiones().then(setSurveyorData);
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
                <View className="px-10 mt-5">
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
                <View className="px-10 mt-5">
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
                <View className="px-10 mt-5">
                    <MultiSelect
                        options={iataData}
                        label="Iata"
                        value={selectedIata}
                        onChange={(selectedValues) => {
                            setSelectedIata(selectedValues);
                        }}
                    />
                </View>
                <View className="px-10 mt-5">
                    <MultiSelect
                        options={vehicleData}
                        label="Vehicle"
                        value={selectedVehicle}
                        onChange={(selectedValues) => {
                            setSelectedVehicle(selectedValues);
                        }}
                    />
                </View>

                <View className="px-10 mt-5">
                    <CustomButton
                        children="Apply Filters"
                        color="secondary"
                        onPress={() =>
                            router.push({
                                pathname: '/cards/[detail]',
                                params: {
                                    detail: 'Kpis',
                                    fecha_inicio: "2026-10-01",
                                    fecha_fin: "2026-10-13",
                                    region: selectedRegion.join(','),
                                    subregion: selectedSubregion.join(','),
                                    iata: selectedIata.join(','),
                                    vehicle: selectedVehicle.join(','),
                                },
                            })
                        }
                        onLongPress={() => { }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 30,
    },
});

export default CardsScreen;

