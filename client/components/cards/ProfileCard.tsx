import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';


interface ProfileCardProps {
    image: string;
    title: string;
    func: () => void;
    isSelected: boolean;
}

export default function ProfileCard ({image, title, func, isSelected}: ProfileCardProps) {

    const router = useRouter()

    // const handleProfileRoute = () => {
    //     router.push(link as any)
    //   }

    return (
    <TouchableOpacity onPress={func}>
    <View style={[styles.carProfile, isSelected && styles.selectedCarProfile]}>
      <Image
        source={{ uri: image }}
        style={styles.carImage}
      />
      <Text style={styles.carText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f0f0f0',
    },
    carProfile: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      margin: 16,
      padding: 16,
      borderRadius: 8,
    },
    selectedCarProfile: {
      borderWidth: 2,
      borderColor: '#DE2020',
    },
    carImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
    },
    carText: {
      marginLeft: 16,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });