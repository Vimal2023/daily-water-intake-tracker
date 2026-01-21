import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { COLORS, SPACING } from "../constants/theme";
import { getReminders } from "../utils/storage";
import WeeklyBarRow from "../components/WeeklyBarRow";

const TARGET = 2000;

export default function WeeklyStatsScreen() {
  const navigation = useNavigation<any>();
  const [data, setData] = useState<any[]>([]);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    loadWeeklyData();
  }, []);

  const loadWeeklyData = async () => {
    const reminders = await getReminders();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [...Array(7)].map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return d;
    });

    const weekly = days.map((date) => {
      const label = date.toLocaleDateString("en-US", {
        weekday: "short",
      });

      const total = reminders
        .filter((r: any) => {
          const rDate = new Date(r.date);
          rDate.setHours(0, 0, 0, 0);
          return rDate.getTime() === date.getTime() &&
                 r.status === "completed";
        })
        .reduce((sum: number, r: any) => sum + r.amount, 0);

      return { day: label, value: total };
    });

    setData(weekly);

    const avg =
      weekly.reduce((s, d) => s + d.value, 0) / weekly.length;
    setAverage(Math.round(avg));
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.bg,
        paddingHorizontal: SPACING.screen,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 48,
          marginBottom: 24,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 18 }}>←</Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            marginLeft: 16,
          }}
        >
          Weekly Stats
        </Text>
      </View>

      {/* Summary Card */}
      <View
        style={{
          backgroundColor: "#F4F4F4",
          borderRadius: 18,
          padding: 20,
          marginBottom: 28,
        }}
      >
        <Text style={{ color: COLORS.textSecondary }}>This Week</Text>

        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            marginVertical: 6,
          }}
        >
          {average} ml / day
        </Text>

        <Text style={{ color: COLORS.textSecondary }}>
          Target: {TARGET} ml / day
        </Text>
      </View>

      {/* History */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.day}
        renderItem={({ item }) => (
          <WeeklyBarRow
            day={item.day}
            value={item.value}
            target={TARGET}
          />
        )}
      />
    </View>
  );
}
