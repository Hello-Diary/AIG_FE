import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl">Page not found</Text>
      <Link href="/home">
        <Text className="text-blue-500 mt-4">Go home</Text>
      </Link>
    </View>
  );
}