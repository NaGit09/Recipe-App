import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {
  type FontAwesomeName = React.ComponentProps<typeof FontAwesome>["name"];
  type MaterialCommunityName = React.ComponentProps<
    typeof MaterialCommunityIcons
  >["name"];

  type ScreenConfig =
    | {
        name: "index" | "search" | "notification" | "profile";
        title: string;
        lib: "fa";
        iconComponent: typeof FontAwesome;
        icon: FontAwesomeName;
      }
    | {
        name: "recipe";
        title: string;
        lib: "mci";
        iconComponent: typeof MaterialCommunityIcons;
        icon: MaterialCommunityName;
      };

  const screens: ScreenConfig[] = [
    {
      name: "index",
      title: "Home",
      lib: "fa",
      icon: "home",
      iconComponent: FontAwesome,
    },
    {
      name: "search",
      title: "Search",
      lib: "fa",
      icon: "search",
      iconComponent: FontAwesome,
    },
    {
      name: "recipe",
      title: "Recipe",
      lib: "mci",
      icon: "chef-hat",
      iconComponent: MaterialCommunityIcons,
    },
    {
      name: "notification",
      title: "Notification",
      lib: "fa",
      icon: "bell",
      iconComponent: FontAwesome,
    },
    {
      name: "profile",
      title: "Profile",
      lib: "fa",
      icon: "user",
      iconComponent: FontAwesome,
    },
  ];
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      {screens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
            tabBarIcon: ({ color }) => {
              if (screen.lib === "fa") {
                const Icon = FontAwesome;
                return (
                  <Icon
                    name={screen.icon as FontAwesomeName}
                    size={24}
                    color={color}
                  />
                );
              } else {
                const Icon = MaterialCommunityIcons;
                return (
                  <Icon
                    name={screen.icon as MaterialCommunityName}
                    size={24}
                    color={color}
                  />
                );
              }
            },
          }}
        />
      ))}
    </Tabs>
  );
}
