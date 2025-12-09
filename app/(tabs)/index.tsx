import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function Index() {

  return (
    <View>
      <Text>This is home page !</Text>
      <Link href={"/login"}>Login page</Link>
    </View>
  );
}
