import { useRouter } from "expo-router";
import React, { useState } from "react";
import { 
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View,
    SafeAreaView,
    Platform,
    Alert,
    ActivityIndicator,
} from "react-native";
import BackArrow from "../../assets/icons/BackBtn.svg";
import { postRegisterApi } from "../../src/api/authApi"; 
import { RegisterRequest } from "../../src/types/auth";
import { AxiosError } from "axios"; 

export default function RegisterScreen() {
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const router = useRouter();

  const handleRegistration = async () => {
    // 1. 입력 유효성 검사
    if (!name || !email || !password) {
      setError("모든 필드를 입력해 주세요.");
      return;
    }
    
    // API 호출 중복 방지 및 사용자 피드백을 위한 로딩 상태 설정
    setIsLoading(true);
    setError(""); 

    const registerData: RegisterRequest = {
        name,
        email,
        password,
    };

    try {
        // 2. API 호출
        await postRegisterApi(registerData);

        // 3. 성공 시 처리
        console.log("회원가입 성공:", { name, email });
        Alert.alert("성공", "회원가입이 완료되었습니다!", [
            { text: "확인", onPress: () => router.replace("/login") }
        ]);

    } catch (err) {
        // 4. 실패 시 에러 처리
        console.error("회원가입 실패:", err);
        
        // AxiosError 타입 체크 및 서버 응답 에러 메시지 추출
        if (err instanceof AxiosError && err.response && err.response.data) {
            // 서버에서 보낸 구체적인 에러 메시지가 있다면 표시
            const serverError = err.response.data.message || "서버 오류로 회원가입에 실패했습니다.";
            setError(serverError);
        } else {
            // 네트워크 오류 등 일반적인 에러
            setError("회원가입 중 알 수 없는 오류가 발생했습니다.");
        }
        
    } finally {
        // 5. 로딩 상태 해제
        setIsLoading(false);
    }
  };
  
  const goToLogin = () => {
    router.back(); 
  }

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 상단 헤더: 뒤로 가기 버튼과 제목 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToLogin} style={styles.backButton}>
          <BackArrow 
            width={18} 
            height={18}
          />
        </TouchableOpacity>
        <Text style={styles.title}>회원가입</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.inputContainer}>
        {/* 이름 레이블 */}
        <Text style={styles.contentLabel}>
          <Text style={styles.requiredStar}>*</Text> 이름 (사용자 닉네임)
        </Text>
        <TextInput
          style={styles.input}
          placeholder="닉네임을 입력하세요"
          placeholderTextColor="#A2A2A2"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          editable={!isLoading} // 로딩 중 입력 비활성화
        />
        
        {/* 이메일 레이블 */}
        <Text style={styles.contentLabel}>
          <Text style={styles.requiredStar}>*</Text> 이메일
        </Text>
        <TextInput
          style={styles.input}
          placeholder="로그인 시 사용할 이메일을 입력하세요"
          placeholderTextColor="#A2A2A2"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading} // 로딩 중 입력 비활성화
        />

        {/* 비밀번호 레이블 */}
        <Text style={styles.contentLabel}>
          <Text style={styles.requiredStar}>*</Text> 비밀번호
        </Text>
        <TextInput
          style={styles.input}
          placeholder="로그인 시 사용할 비밀번호를 입력하세요"
          placeholderTextColor="#A2A2A2"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading} // 로딩 중 입력 비활성화
        />
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleRegistration}
            disabled={isLoading} // 로딩 중 버튼 비활성화
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" /> // 로딩 중 인디케이터 표시
          ) : (
            <Text style={styles.buttonText}>회원가입</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.loginLink} onPress={goToLogin} disabled={isLoading}>
          <Text style={styles.loginLinkText}>이미 계정이 있으신가요? 로그인하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ------------------------------------------------------------------
// 스타일 시트
// ------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FBFF",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? 40 : 30, 
    paddingBottom: 20,
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#626262",
    textAlign: 'center',
  },
  inputContainer: {
    // TextInput과 Button을 중앙 정렬합니다.
    alignItems: "center",
    padding: 20,
    paddingTop: 40, 
  },
  contentLabel: {
    // 이 레이블만 왼쪽 정렬합니다.
    alignSelf: 'flex-start',
    // TextInput의 paddingHorizontal: 15에 맞추기 위한 여백입니다.
    marginLeft: 15, 
    width: 320, // TextInput과 너비를 동일하게 설정
    
    color: "#000000",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
  },
  
  requiredStar: {
    // 별표를 빨간색으로 표시합니다.
    color: "red",
    fontSize: 15,
    fontWeight: "bold",
  },
  input: {
    width: 320, // 중앙 정렬을 위해 고정 너비 유지
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
  buttonDisabled: {
    backgroundColor: "#AAB3F4", // 로딩 중일 때 버튼 색상 변경
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  loginLink: {
    marginTop: 20,
    padding: 5,
  },
  loginLinkText: {
    color: "#4052E2",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: 'center',
  }
});