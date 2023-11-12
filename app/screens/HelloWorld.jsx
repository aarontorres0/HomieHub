import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import TaskScreen from "./TaskScreen";
import SharedShoppingScreen from "./SharedShoppingScreen";

const HelloWorld = () => {
  const [showTaskScreen, setShowTaskScreen] = useState(false);
  const [showSharedShoppingScreen, setShowSharedShoppingScreen] =
    useState(false);

  // Dummy data for roommates
  const roommates = [{ name: "John" }, { name: "Emma" }, { name: "David" }];

  const handleCreateTask = () => {
    setShowTaskScreen(true);
    setShowSharedShoppingScreen(false);
  };

  const handleCloseTaskScreen = () => {
    setShowTaskScreen(false);
  };

  const handleSharedShopping = () => {
    setShowSharedShoppingScreen(true);
    setShowTaskScreen(false);
  };

  const handleCloseSharedShoppingScreen = () => {
    setShowSharedShoppingScreen(false);
  };

  return (
    <View style={styles.container}>
      {showTaskScreen ? (
        <TaskScreen onClose={handleCloseTaskScreen} />
      ) : showSharedShoppingScreen ? (
        <SharedShoppingScreen onClose={handleCloseSharedShoppingScreen} />
      ) : (
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>Welcome to HomieHub</Text>
          <Text style={styles.subtitle}>Stay organized and connected</Text>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Your Roommates</Text>
            {roommates.map((roommate, index) => (
              <View key={index} style={styles.roommateItem}>
                <Text style={styles.roommateName}>{roommate.name}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Add a Task</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateTask}
            >
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Today's Events</Text>
            <TouchableOpacity style={styles.eventItem}>
              <Text style={styles.eventText}>Roommate Meeting</Text>
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          <View style={styles.sharedSectionContainer}>
            <TouchableOpacity
              style={styles.sharedItem}
              onPress={handleSharedShopping}
            >
              <Text style={styles.sharedText}>Shared Shopping</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  scrollView: {
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "grey",
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  roommateItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  roommateName: {
    marginLeft: 10,
    fontSize: 18,
  },
  addButton: {
    alignSelf: "flex-start",
    padding: 10,
  },
  addButtonText: {
    fontSize: 24,
    color: "#000",
  },
  createButton: {
    backgroundColor: "#4a09a5",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#f6f6f6",
    borderRadius: 5,
  },
  eventText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
  },
  joinButton: {
    backgroundColor: "#e1e1e1",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  joinButtonText: {
    fontSize: 16,
    color: "#000",
  },
  sharedSectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sharedItem: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f6f6f6",
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  sharedText: {
    marginTop: 10,
    fontSize: 18,
  },
});

export default HelloWorld;
