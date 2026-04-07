import { useAuth } from "@/src/hooks/useAuth";
import { Dimensions, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../ui/ThemedText";
import { ThemedView } from "../ui/ThemedView";

import { UserI } from "@/assets/icons/UserI";

const { width, height } = Dimensions.get("window");

interface HeaderBarProps {
  style?: ViewStyle;
}

export function HeaderBar({ style }: HeaderBarProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth(); // Asumiendo que useAuth devuelve el objeto 'user'

  return (
    <ThemedView
      style={[styles.container, { paddingTop: insets.top + 10 }, style]}
    >
      <View style={styles.content}>
        <View style={styles.leftContainer}>
          <ThemedText type="subtitle" style={styles.appName}>
            Marena App
          </ThemedText>
        </View>

        <View style={styles.rightContainer}>
          {user && (
            <View style={styles.userInfo}>
              <ThemedText style={styles.userName}>{user.name}</ThemedText>
              <ThemedText style={styles.userRole}>{user.role}</ThemedText>
            </View>
          )}

          {/* Placeholder para el icono */}
          <View style={styles.iconPlaceholder}>
            <UserI />
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width * 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(128, 128, 128, 0.2)",
    zIndex: 1, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  leftContainer: {
    flex: 1,
  },
  appName: {
    fontSize: 18,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userInfo: {
    alignItems: "flex-end",
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
  },
  userRole: {
    fontSize: 10,
    opacity: 0.6,
    textTransform: "uppercase",
  },
  iconPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(128, 128, 128, 0.15)",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#888",
    justifyContent: "center",
    alignItems: "center",
  },
});
