import { TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";

interface MoreButtonProps {
  toggleMenu: () => void;
}

export default function MoreButton({ toggleMenu }: MoreButtonProps) {
  return (
    <TouchableOpacity style={{ padding: 8 }} onPress={toggleMenu}>
      <Svg width="25" height="25" viewBox="0 0 17 17" fill="none">
        <Path
          d="M8.89209 9.28748C9.26525 9.28748 9.56775 8.98497 9.56775 8.61182C9.56775 8.23866 9.26525 7.93616 8.89209 7.93616C8.51893 7.93616 8.21643 8.23866 8.21643 8.61182C8.21643 8.98497 8.51893 9.28748 8.89209 9.28748Z"
          stroke="#626262"
          strokeWidth="1.35132"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M13.6217 9.28748C13.9949 9.28748 14.2974 8.98497 14.2974 8.61182C14.2974 8.23866 13.9949 7.93616 13.6217 7.93616C13.2485 7.93616 12.946 8.23866 12.946 8.61182C12.946 8.98497 13.2485 9.28748 13.6217 9.28748Z"
          stroke="#626262"
          strokeWidth="1.35132"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M4.16248 9.28748C4.53563 9.28748 4.83813 8.98497 4.83813 8.61182C4.83813 8.23866 4.53563 7.93616 4.16248 7.93616C3.78932 7.93616 3.48682 8.23866 3.48682 8.61182C3.48682 8.98497 3.78932 9.28748 4.16248 9.28748Z"
          stroke="#626262"
          strokeWidth="1.35132"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
}
