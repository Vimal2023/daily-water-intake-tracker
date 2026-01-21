import AsyncStorage from '@react-native-async-storage/async-storage'

const KEY = 'REMINDERS'

export const getReminders = async () => {
  const data = await AsyncStorage.getItem(KEY)
  return data ? JSON.parse(data) : []
}

export const saveReminders = async (data: any) => {
  await AsyncStorage.setItem(KEY, JSON.stringify(data))
}
