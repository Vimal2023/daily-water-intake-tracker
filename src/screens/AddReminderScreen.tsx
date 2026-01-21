import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { COLORS, SPACING } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import CustomCalendar from "../components/CustomCalendar";
import { getReminders, saveReminders } from "../utils/storage";

const AMOUNTS = [150, 200, 350, 450, 600, 750, 850, 900, 1000];

export default function AddReminderScreen() {
  const navigation = useNavigation<any>();

  const now = new Date();

  const [year, setYear] = useState(now.getFullYear());
  const [monthIndex, setMonthIndex] = useState(now.getMonth());
  const [day, setDay] = useState(now.getDate());
  const [amount, setAmount] = useState(200);

  const [hour, setHour] = useState(
    now.getHours() % 12 === 0 ? 12 : now.getHours() % 12
  );
  const [minute, setMinute] = useState(now.getMinutes());
  const [period, setPeriod] = useState<"AM" | "PM">(
    now.getHours() >= 12 ? "PM" : "AM"
  );

  const format = (v: number) => (v < 10 ? `0${v}` : v.toString());

  const isToday = useMemo(() => {
    const today = new Date();
    return (
      year === today.getFullYear() &&
      monthIndex === today.getMonth() &&
      day === today.getDate()
    );
  }, [year, monthIndex, day]);

  const currentHour24 = now.getHours();
  const currentMinute = now.getMinutes();

  const to24Hour = (h: number, p: "AM" | "PM") =>
    p === "PM" ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h;

  const selectedHour24 = to24Hour(hour, period);

  const isPastTime =
    isToday &&
    (selectedHour24 < currentHour24 ||
      (selectedHour24 === currentHour24 &&
        minute < currentMinute));

  const incHour = () => {
    let next = hour === 12 ? 1 : hour + 1;

    if (isToday) {
      const next24 = to24Hour(next, period);
      if (next24 < currentHour24) return;
    }

    setHour(next);
  };

  const incMinute = () => {
    let next = (minute + 5) % 60;

    if (isToday) {
      if (
        selectedHour24 === currentHour24 &&
        next < currentMinute
      ) {
        return;
      }
    }

    setMinute(next);
  };

  const togglePeriod = () => {
    if (isToday) {
      const toggled24 =
        period === "AM" ? selectedHour24 + 12 : selectedHour24 - 12;

      if (toggled24 < currentHour24) return;
    }

    setPeriod((p) => (p === "AM" ? "PM" : "AM"));
  };

  const onSave = async () => {
    if (isPastTime) return;

    const timeString = `${format(hour)}:${format(minute)} ${period}`;
    const dateString = new Date(year, monthIndex, day).toDateString();

    const newReminder = {
      id: Date.now().toString(),
      date: dateString,
      time: timeString,
      amount,
      status: "upcoming",
    };

    const existing = await getReminders();
    await saveReminders([...existing, newReminder]);

    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add a water reminder</Text>
        </View>

        {/* Calendar */}
        <CustomCalendar
          year={year}
          monthIndex={monthIndex}
          day={day}
          onYearChange={setYear}
          onMonthChange={setMonthIndex}
          onDayChange={setDay}
        />

        {/* Time */}
        <View style={styles.section}>
          <Text style={styles.label}>Time</Text>

          <View style={styles.timeRow}>
            <TouchableOpacity onPress={incHour}>
              <Text style={styles.timeText}>{format(hour)}</Text>
            </TouchableOpacity>

            <Text style={styles.timeText}>:</Text>

            <TouchableOpacity onPress={incMinute}>
              <Text style={styles.timeText}>{format(minute)}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={togglePeriod}>
              <Text style={[styles.timeText, styles.period]}>
                {period}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.underline} />
        </View>

        {/* Quantity */}
        <View style={styles.section}>
          <Text style={styles.label}>Quantity</Text>
          <View style={styles.grid}>
            {AMOUNTS.map((ml) => (
              <TouchableOpacity
                key={ml}
                onPress={() => setAmount(ml)}
                style={[
                  styles.amountBox,
                  ml === amount && styles.activeBox,
                ]}
              >
                <Text
                  style={[
                    styles.amountText,
                    ml === amount && styles.activeText,
                  ]}
                >
                  {ml}ml
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* SAVE */}
      <View style={styles.saveWrapper}>
        <TouchableOpacity
          style={[
            styles.saveBtn,
            isPastTime && { opacity: 0.4 },
          ]}
          disabled={isPastTime}
          onPress={onSave}
        >
          <Text style={styles.saveText}>SAVE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.screen,
    paddingTop: 48,
    paddingBottom: 140,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  close: {
    fontSize: 22,
    color: COLORS.textSecondary,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  section: {
    marginBottom: 28,
  },
  label: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  underline: {
    height: 1,
    backgroundColor: COLORS.gray,
    width: 120,
    marginTop: 6,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  amountBox: {
    width: "30%",
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    marginBottom: 14,
  },
  activeBox: {
    backgroundColor: COLORS.darkGray,
  },
  amountText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  activeText: {
    color: "#fff",
    fontWeight: "600",
  },
  saveWrapper: {
    position: "absolute",
    bottom: 24,
    left: SPACING.screen,
    right: SPACING.screen,
  },
  saveBtn: {
    backgroundColor: COLORS.darkGray,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  period: {
    marginLeft: 12,
    fontWeight: "600",
  },
});
