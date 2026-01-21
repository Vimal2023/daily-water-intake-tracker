import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useState, useCallback } from "react";
import CircularProgress from "../components/CircularProgress";
import ReminderCard from "../components/ReminderCard";
import FloatingAddButton from "../components/FloatingAddButton";
import { getReminders, saveReminders } from "../utils/storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { COLORS, SPACING } from "../constants/theme";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ReminderStatus = "upcoming" | "completed" | "skipped";

export interface Reminder {
  id: string;
  date: string;
  time: string;
  amount: number;
  status: ReminderStatus;
}

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const [target] = useState(6000);
  const [consumed, setConsumed] = useState(0);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [dayReset, setDayReset] = useState(false);

  const todayString = new Date().toDateString();
  const RESET_KEY = `DAY_RESET_${todayString}`;

  const parseDateTime = (date: string, time: string) =>
    new Date(`${date} ${time}`).getTime();

  const loadData = async () => {
    const data: Reminder[] = await getReminders();

    const sorted = [...data].sort(
      (a, b) =>
        parseDateTime(b.date, b.time) -
        parseDateTime(a.date, a.time)
    );

    setReminders(sorted);

    const wasReset = await AsyncStorage.getItem(RESET_KEY);

    if (wasReset) {
      setDayReset(true);
      setConsumed(0);
      return;
    }

    setDayReset(false);

    const done = sorted
      .filter(
        (r) =>
          r.status === "completed" &&
          r.date === todayString
      )
      .reduce((sum, r) => sum + r.amount, 0);

    setConsumed(done);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const updateStatus = async (id: string, status: ReminderStatus) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, status } : r
    );

    setReminders(updated);
    await saveReminders(updated);

    if (!dayReset && status === "completed") {
      const amt = reminders.find((r) => r.id === id)?.amount ?? 0;
      setConsumed((prev) => prev + amt);
    }
  };

  const onResetDay = async () => {
    await AsyncStorage.setItem(RESET_KEY, "true");
    setDayReset(true);
    setConsumed(0);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.bg,
        paddingHorizontal: SPACING.screen,
      }}
    >
      <View
        style={{
          marginTop: 48,
          marginBottom: 12,
          position: "relative",
        }}
      >
        <Text style={{ fontSize: 16, color: COLORS.textSecondary }}>
          Good morning,
        </Text>

        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: COLORS.textPrimary,
          }}
        >
          Stark
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("WeeklyStats")}
          style={{
            position: "absolute",
            right: 0,
            top: 6,
            padding: 8,
          }}
        >
          <Feather
            name="bar-chart-2"
            size={25}
            color={COLORS.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: "center", marginVertical: 24 }}>
        <CircularProgress value={consumed} total={target} />
      </View>

      <FlatList
        data={
          dayReset
            ? []
            : reminders.filter((r) => r.date === todayString)
        }
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
        renderItem={({ item }) => (
          <ReminderCard
            reminder={item}
            onDone={() => updateStatus(item.id, "completed")}
            onSkip={() => updateStatus(item.id, "skipped")}
          />
        )}
      />

      {consumed >= target && !dayReset && (
        <TouchableOpacity
          onPress={onResetDay}
          style={{
            position: "absolute",
            bottom: 32,
            left: SPACING.screen,
            backgroundColor: COLORS.gray,
            paddingHorizontal: 18,
            paddingVertical: 14,
            borderRadius: 24,
          }}
        >
          <Text
            style={{
              color: COLORS.textPrimary,
              fontWeight: "600",
            }}
          >
            Reset
          </Text>
        </TouchableOpacity>
      )}

      <FloatingAddButton
        onPress={() => navigation.navigate("AddReminder")}
      />
    </View>
  );
}
