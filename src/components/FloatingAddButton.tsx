import { TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { COLORS } from '../constants/theme'

export default function FloatingAddButton({ onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: 'absolute',
        bottom: 36,
        right: 28,
        backgroundColor: COLORS.darkGray,
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
      }}
    >
      <Feather name="plus" size={26} color="#FFFFFF" />
    </TouchableOpacity>
  )
}
