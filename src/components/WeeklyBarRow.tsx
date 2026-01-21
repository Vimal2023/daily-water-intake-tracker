import { View, Text } from "react-native";
import { COLORS } from "../constants/theme";

interface Props {
  day: string;
  value: number;
  target: number;
}

export default function WeeklyBarRow({ day, value, target }: Props) {
  const percentage = Math.min(value / target, 1);

  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
      
      {/* Day */}
      <Text style={{ width: 40, color: COLORS.textSecondary }}>
        {day}
      </Text>

      {/* Bar */}
      <View
        style={{
          flex: 1,
          height: 8,
          backgroundColor: COLORS.gray,
          borderRadius: 4,
          marginHorizontal: 12,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${percentage * 100}%`,
            height: "100%",
            backgroundColor:
              value >= target ? COLORS.green : COLORS.darkGray,
          }}
        />
      </View>

      {/* Value */}
      <Text style={{ width: 90, textAlign: "right", fontSize: 12 }}>
        {value} / {target}
      </Text>
    </View>
  );
}
