import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import AddReminderScreen from "../screens/AddReminderScreen";
import WeeklyStatsScreen from "../screens/WeeklyStatsScreen";

export type RootStackParamList = {
  Home: undefined;
  AddReminder: undefined;
  WeeklyStats: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator id="root-stack" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddReminder" component={AddReminderScreen} />
      <Stack.Screen name="WeeklyStats" component={WeeklyStatsScreen} />
    </Stack.Navigator>
  );
}
