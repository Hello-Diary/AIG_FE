// app/login/index.tsx (최종 수정 코드)

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator, 
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View, 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AxiosError } from "axios"; 

import { postLoginApi } from "../../src/api/authApi"; 
// LoginResponse 타입은 useAuthStore에서 정의한 UserProfile과 구조가 같아야 합니다.
import { LoginRequest, LoginResponse } from "../../src/types/auth"; 
import { useAuthStore } from "../../src/stores/useUserStore"; 


export default function LoginScreen() {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false); 
    const router = useRouter();
    
    // 💡 Zustand 스토어에서 signIn 액션 함수를 가져옵니다.
    const { signIn: zustandSignIn } = useAuthStore(); 

    const handleLogin = async () => {
        if (!email || !password) {
            setError("이메일과 비밀번호를 모두 입력해주세요.");
            return;
        }
        
        setError("");
        setIsLoading(true);

        try {
            const loginData: LoginRequest = { email, password };
            
            // 🚨 postLoginApi 호출 및 응답 획득
            const res: LoginResponse = await postLoginApi("dummy_user_id", loginData); 

            console.log("Login Successful:", res);
            
            if (!res.userId) { 
                throw new Error("서버 응답에 사용자 ID가 포함되어 있지 않습니다.");
            }
            
            // 💡 1. Zustand 스토어 업데이트 (모든 사용자 정보를 저장)
            zustandSignIn(res); 
            
            // 💡 2. 리다이렉트 (가장 확실한 해결책)
            router.replace('/(tabs)/home');

            // 💡 3. 로딩 상태 해제
            setIsLoading(false); 

        } catch (e) {
            // 🚨 로그인 실패 및 오류 처리 로직
            if (e instanceof AxiosError) {
                
                const status = e.response?.status;
                const message = e.response?.data?.message || e.message;
                
                if (status) {
                    console.error(`🚨 [API Error] Status: ${status} (${status >= 500 ? 'Server Error' : 'Client Error'})`);
                } else {
                    console.error(`🚨 [API Error] Network Error or Timeout`);
                }
                console.error("  - Server Response Data:", e.response?.data);
                console.error("  - Axios Message:", e.message);

                if (status && status >= 400 && status < 500) {
                    setError(message || "아이디 또는 비밀번호를 확인해주세요.");
                } else if (status && status >= 500) {
                    setError("서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
                } else {
                    setError("네트워크 연결을 확인하거나 서버 상태를 점검해주세요.");
                }
                
            } else if (e instanceof Error) {
                console.error("🚨 [App Logic Error]:", e.message);
                setError(e.message);
            } else {
                console.error("🚨 [Unknown Error]:", e);
                setError("로그인 중 알 수 없는 오류가 발생했습니다.");
            }
            // 💡 오류가 발생해도 로딩 상태는 해제
            setIsLoading(false); 
        }
    };
    
    const handleResetOnboarding = async () => {
        try {
            await AsyncStorage.removeItem("@hasSeenOnboarding");
            alert("온보딩 상태가 초기화되었습니다.");
            router.replace("/");
        } catch (e) {
            console.error("Failed to remove onboarding status", e);
        }
    };
    
    const handleRegister = () => {
        router.push("/register");
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.innerContainer}
            >
                <Text style={styles.title}>HELLO{"\n"}DIARY</Text>

                <TextInput
                    style={styles.input}
                    placeholder="이메일"
                    placeholderTextColor="#A2A2A2"
                    value={email} 
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address" 
                />

                <TextInput
                    style={styles.input}
                    placeholder="패스워드"
                    placeholderTextColor="#A2A2A2"
                    value={password} 
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>로그인</Text>
                    )}
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>
                        회원 가입하기
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.resetButton}
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
        backgroundColor: "#F9FBFF",
    },
    innerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 45,
        fontWeight: "bold",
        marginBottom: 40,
        color: "#4052E2",
        textAlign: "center",
        lineHeight: 54,
    },
    input: {
        width: 320,
        height: 53,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#4052E2",
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 15,
        marginBottom: 15,
    },
    button: {
        width: 320,
        height: 62,
        backgroundColor: "#4052E2",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    registerButton: {
        marginTop: 15,
        padding: 5,
    },
    registerButtonText: {
        color: "#4052E2",
        fontSize: 14,
        textDecorationLine: "underline",
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
    resetButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#ffc107",
        borderRadius: 5,
    },
    resetButtonText: {
        color: "#000",
        textAlign: "center",
    },
});