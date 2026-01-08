import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOut,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface AnimatedViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  direction?: "up" | "down";
}

export const FadeInView = ({
  children,
  delay = 0,
  duration = 500,
  style,
  direction = "down",
}: AnimatedViewProps) => {
  const EnteringAnimation =
    direction === "down"
      ? FadeInDown.delay(delay).duration(duration).springify()
      : FadeInUp.delay(delay).duration(duration).springify();

  return (
    <Animated.View
      entering={EnteringAnimation}
      exiting={FadeOut}
      layout={Layout.springify()}
      style={style}
    >
      {children}
    </Animated.View>
  );
};

export const ScalePress = ({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
};
