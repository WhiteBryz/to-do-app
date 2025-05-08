import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { AppBar, FAB, HStack, IconButton } from "@react-native-material/core";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  return (
    <>
    <SafeAreaView>
        <AppBar
        title="Home"
        tintColor="white"
        centerTitle={false}
        leading={props => (
          <IconButton icon={props => <Icon name="menu" {...props} />} {...props} />
        )}
        trailing={props => (
          <HStack>
            <IconButton
              icon={props => <Icon name="account" {...props} />}
              {...props}
            />
          </HStack>
        )}
       />
    </SafeAreaView>
      <AppBar
        variant="bottom"
        leading={props => (
          <HStack style={styles.container}>
            <IconButton icon={props => <Icon name="home" {...props} />} {...props} />
            <IconButton icon={props => <Icon name="trophy" {...props} />} {...props} />
          </HStack>
        )}
        trailing={props => (
          <HStack style={styles.container}>
            <IconButton
              icon={props => <Icon name="chart-pie" {...props} />}
              {...props}
            />
            <IconButton
              icon={props => <Icon name="cog" {...props} />}
              {...props}
            />
          </HStack>
        )}
        style={{ position: "absolute", start: 0, end: 0, bottom: 0, display: "flex", justifyContent: "space-between", paddingHorizontal: 20}}
      >
        <FAB
          icon={props => <Icon name="plus" {...props} />}
          style={{ position: "absolute", top: -28, alignSelf: "center" }}
        />
      </AppBar>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "50%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    },
});