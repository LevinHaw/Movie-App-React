import { NavigationContainer } from "@react-navigation/native"
import BottomTabNavigation from './src/navigation/BottomTabNavigation';
import { createNativeStackNavigator } from "@react-navigation/native-stack"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <BottomTabNavigation/>
    </NavigationContainer>
  );
}

