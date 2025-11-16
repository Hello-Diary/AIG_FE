import c from "@/src/constants/colors";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function PlusButton() {
  const router = useRouter();
  
  const Plus = () => (
    <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <Path
        d="M14 23.3326H24.5"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.25 4.08394C19.7141 3.61981 20.3436 3.35907 21 3.35907C21.325 3.35907 21.6468 3.42308 21.9471 3.54746C22.2474 3.67183 22.5202 3.85413 22.75 4.08394C22.9798 4.31376 23.1621 4.58658 23.2865 4.88685C23.4109 5.18712 23.4749 5.50894 23.4749 5.83394C23.4749 6.15895 23.4109 6.48077 23.2865 6.78104C23.1621 7.0813 22.9798 7.35413 22.75 7.58394L8.16667 22.1673L3.5 23.3339L4.66667 18.6673L19.25 4.08394Z"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  return (
    <TouchableOpacity style={styles.fab} onPress={() => router.push("/diary")}>
      <Plus />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 16,
    bottom: 50,
    backgroundColor: c.primary,
    width: 52,
    height: 52,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
