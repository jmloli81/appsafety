import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import type { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";

interface KpiCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  color?: string;
  icon?: ComponentProps<typeof FontAwesome6>["name"];
}

const KpiCard = ({ title, value, subtitle, color = "#4A90E2", icon = "car" }: KpiCardProps) => {
  const numericValue = typeof value === "number" ? value : Number(value);
  const displayValue =
    Number.isFinite(numericValue) && String(value).trim() !== ""
      ? numericValue.toFixed(2)
      : value;

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.header}>
        <FontAwesome6 name={icon} size={24} color={color} />
        <Text style={styles.title}>{title}</Text>
      </View>

      <Text style={[styles.value, { color }]}>{displayValue}</Text>

      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginVertical: 10,
    elevation: 3,
    borderLeftWidth: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 10,
    fontWeight: "600",
    color: "#333",
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 10,
    color: "#666",
    fontWeight: "600",
  },
});

export default KpiCard;
