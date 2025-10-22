import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [userID, setUserID] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    // 요청대로 간단한 문자열 확인
    if (userID && pw) {
      setError("");
      // TODO: 실제 앱에서는 여기서 토큰을 받고 저장해야 합니다.
      // 이 예제에서는 바로 홈으로 이동합니다.
      router.replace("/(tabs)/home");
    } else {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
    }
  };

  // 온보딩 완료 상태 초기화
  const handleResetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem("@hasSeenOnboarding");
      alert("온보딩 상태가 초기화되었습니다.");
      // app/index.tsx가 다시 판단하도록 루트로 보냅니다.
      router.replace("/");
    } catch (e) {
      console.error("Failed to remove onboarding status", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.innerContainer}
      >
        <Text style={styles.title}>로그인</Text>

        <TextInput
          style={styles.input}
          placeholder="UserID"
          value={userID}
          onChangeText={setUserID}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={pw}
          onChangeText={setPw}
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetButton} // 임시 스타일
          onPress={handleResetOnboarding}
        >
          <Text style={styles.resetButtonText}>
            {" "}
            (테스트용) 온보딩 다시보기{" "}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ffc107", // 눈에 띄는 색
    borderRadius: 5,
  },
  resetButtonText: {
    color: "#000",
    textAlign: "center",
  },
});
