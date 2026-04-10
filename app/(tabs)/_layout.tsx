import { Tabs } from "expo-router";
import React from "react";

import { TabBar } from "@/src/components/layout/TabBar"; 

export default function TabLayout() {

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />} 
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Inicio",
          tabBarLabel: "Inicio",
        }} 
      />
      <Tabs.Screen 
        name="Registro" 
        options={{ 
          title: "Registro",
          tabBarLabel: "Registro",
        }} 
      />
    </Tabs>
  );
}