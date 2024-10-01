import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native"

export default function MediaCard ({ image, title, description, onPress }: { image: any, title: any, description: any, onPress: () => void }) {
    
    
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.popularMod}>
                <Image source={image} style={styles.modImage} />
                <View style={styles.modInfo}>
                    <Text style={styles.modTitle}>{title}</Text>
                    <Text style={styles.modDescription}>{description}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    popularModsContainer: {
      padding: 16,
    },
    popularMod: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 8,
      marginBottom: 16,
      overflow: 'hidden',
    },
    modImage: {
      width: 100,
      height: 100,
    },
    modInfo: {
      flex: 1,
      padding: 12,
    },
    modTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    modDescription: {
      fontSize: 14,
      color: '#666',
    },
  })