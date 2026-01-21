import { View, Text, TouchableOpacity } from "react-native";
import { COLORS, SPACING } from "../constants/theme";

export default function ReminderCard({ reminder, onDone, onSkip }: any) {
  const item = reminder;
  if (!item) return null;

  const statusLabel =
    item.status === "upcoming"
      ? "Upcoming"
      : item.status === "completed"
      ? "Completed"
      : "Skipped";

  return (
    <View
      style={{
        backgroundColor: "#F8F8F8",
        borderRadius: 18,
        padding: SPACING.card,
        marginBottom: 14,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: COLORS.textPrimary,
        }}
      >
        Drink {item.amount}ml of water
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 13,
          color: COLORS.textSecondary,
        }}
      >
        {statusLabel} • {item.date} • {item.time}
      </Text>

      {item.status === "upcoming" && (
        <View
          style={{
            flexDirection: "row",
            marginTop: 14,
          }}
        >
          <TouchableOpacity onPress={onSkip}>
            <Text
              style={{
                color: COLORS.textSecondary,
                marginRight: 28,
              }}
            >
              Skip
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onDone}>
            <Text
              style={{
                color: COLORS.textPrimary,
                fontWeight: "600",
              }}
            >
              Done
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
