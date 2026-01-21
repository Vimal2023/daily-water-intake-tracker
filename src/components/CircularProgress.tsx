import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { COLORS } from "../constants/theme";
import { Feather } from "@expo/vector-icons";

export default function CircularProgress({ value, total }: any) {
  const radius = 120;
  const stroke = 14;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / total) * circumference;

  return (
    <View style={{ alignItems: "center", marginVertical: 32 }}>
      <Svg width={280} height={280}>
        <Circle
          cx="140"
          cy="140"
          r={radius}
          stroke={COLORS.gray}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx="140"
          cy="140"
          r={radius}
          stroke={COLORS.textPrimary}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </Svg>

      <View
        style={{
          position: "absolute",
          top: 150,
          left: 160,
          transform: [
            { translateX: -50 },
            { translateY: -40 },
          ],
          alignItems: "center",
        }}
      >
        <Feather name="droplet" size={32} color={COLORS.textPrimary} />
        <Text style={{ fontSize: 28, fontWeight: "700", marginTop: 6 }}>
          {value} ml
        </Text>
        <Text style={{ color: COLORS.textSecondary }}>of {total} ml</Text>
      </View>
    </View>
  );
}
