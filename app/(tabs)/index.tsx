import { Link } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import useAuth from "../stores/auth/auth.store";

export default function Index() {
  const { data, callApi } = useAuth();
  useEffect(() => {
    callApi();
  }, [data])
  
  return (
    <View>
      <Text>This is home page !</Text>
      <Link href={'/login'}>Login page</Link>
    </View>
  );
}
