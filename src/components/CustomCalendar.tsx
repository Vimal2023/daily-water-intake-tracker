import React, { useMemo, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native'
import { COLORS } from '../constants/theme'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface Props {
  year: number
  monthIndex: number
  day: number
  onYearChange: (y: number) => void
  onMonthChange: (m: number) => void
  onDayChange: (d: number) => void
}

export default function CustomCalendar({
  year,
  monthIndex,
  day,
  onYearChange,
  onMonthChange,
  onDayChange,
}: Props) {
  const monthRef = useRef<FlatList<string>>(null)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const firstDayIndex = new Date(year, monthIndex, 1).getDay()
  const totalDays = new Date(year, monthIndex + 1, 0).getDate()

  const calendarDays = useMemo(() => {
    const result: (number | null)[] = []

    for (let i = 0; i < firstDayIndex; i++) {
      result.push(null)
    }

    for (let d = 1; d <= totalDays; d++) {
      result.push(d)
    }

    return result
  }, [firstDayIndex, totalDays])

  return (
    <View>
      {/* Year */}
      <View style={styles.yearRow}>
        <Text style={styles.yearText}>{year}</Text>
        <Text style={styles.arrow}>▼</Text>
      </View>

      {/* Months */}
      <FlatList
        ref={monthRef}
        horizontal
        data={MONTHS}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 20 }}
        renderItem={({ item, index }) => {
          const active = index === monthIndex
          return (
            <Text
              style={[
                styles.monthText,
                active && styles.activeMonth,
              ]}
              onPress={() => {
                onMonthChange(index)
                monthRef.current?.scrollToIndex({
                  index,
                  animated: true,
                })
              }}
            >
              {item}
            </Text>
          )
        }}
      />

      {/* Week Days */}
      <View style={styles.weekRow}>
        {WEEK_DAYS.map((d, index) => (
          <Text key={`${d}-${index}`} style={styles.weekText}>
            {d}
          </Text>
        ))}
      </View>

      {/* Days Grid */}
      <View style={styles.daysGrid}>
        {calendarDays.map((d, index) => {
          if (d === null) {
            return (
              <View key={`empty-${index}`} style={styles.emptyCell} />
            )
          }

          const currentDate = new Date(year, monthIndex, d)
          currentDate.setHours(0, 0, 0, 0)

          const isPast = currentDate < today
          const selected = d === day && !isPast

          return (
            <TouchableOpacity
              key={`day-${d}`}
              disabled={isPast}
              onPress={() => onDayChange(d)}
              style={[
                styles.dayCell,
                selected && styles.activeDay,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  selected && styles.activeDayText,
                  isPast && styles.disabledText,
                ]}
              >
                {d}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  yearText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 6,
  },
  arrow: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },

  monthText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  activeMonth: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },

  weekRow: {
    flexDirection: 'row',
    marginVertical: 12,
  },
  weekText: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 28,
  },
  emptyCell: {
    width: '14.28%',
    height: 36,
  },
  dayCell: {
    width: '14.28%',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDay: {
    backgroundColor: COLORS.darkGray,
    borderRadius: 18,
  },
  dayText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  activeDayText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  disabledText: {
    color: COLORS.gray, 
  },
})
