import { useNavigation, useRoute } from "@react-navigation/native";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import ShoppingScreen from "./ShoppingScreen";
import TaskScreen from "./TaskScreen";

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const groupId = route.params?.groupId;
  const username = route.params?.username;

  const [groupMembers, setGroupMembers] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [showTaskScreen, setShowTaskScreen] = useState(false);
  const [showSharedShoppingScreen, setShowSharedShoppingScreen] =
    useState(false);
  const [isLoadingRoommates, setIsLoadingRoommates] = useState(true);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);

  useEffect(() => {
    let unsubscribe;

    if (groupId) {
      unsubscribe = fetchGroupMembers();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [groupId]);

  useEffect(() => {
    let unsubscribe;

    if (groupId) {
      unsubscribe = fetchTasks();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [groupId, username]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Settings", { groupId, username })}
        >
          <Icon
            name="cog"
            size={25}
            color="black"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, groupId]);

  const fetchGroupMembers = () => {
    if (groupId) {
      const db = getFirestore();
      const groupRef = doc(db, "Groups", groupId);

      return onSnapshot(groupRef, async (docSnap) => {
        if (docSnap.exists()) {
          const memberIds = docSnap.data().members;
          const members = [];

          for (const memberId of memberIds) {
            const userRef = doc(db, "Users", memberId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              members.push(userSnap.data().username);
            } else {
              console.log("User not found for id:", memberId);
            }
          }

          setGroupMembers(members);
          setIsLoadingRoommates(false);
        } else {
          Alert.alert("Group not found");
          setIsLoadingRoommates(false);
        }
      });
    } else {
      setIsLoadingRoommates(false);
    }
  };

  const fetchTasks = () => {
    if (groupId && username) {
      setIsLoadingTasks(true);
      const db = getFirestore();
      const groupRef = doc(db, "Groups", groupId);
      const tasksCollection = collection(groupRef, "GroupTasks");
      const q = query(tasksCollection, where("assignedTo", "==", username));

      return onSnapshot(q, (querySnapshot) => {
        const tasksArray = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => a.taskName.localeCompare(b.taskName));

        setUserTasks(tasksArray);
        setIsLoadingTasks(false);
      });
    } else {
      setIsLoadingTasks(false);
    }
  };

  return (
    <View style={styles.container}>
      {showTaskScreen ? (
        <TaskScreen
          groupId={groupId}
          onClose={() => setShowTaskScreen(false)}
          groupMembers={groupMembers}
          username={username}
        />
      ) : showSharedShoppingScreen ? (
        <ShoppingScreen
          groupId={groupId}
          onClose={() => setShowSharedShoppingScreen(false)}
        />
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Roommates</Text>
            <View style={styles.roommateContainer}>
              {isLoadingRoommates ? (
                <ActivityIndicator
                  size="small"
                  color="#4a09a5"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
              ) : (
                groupMembers.map((member, index) => (
                  <View key={index} style={styles.roommateItem}>
                    <Text style={styles.roommateText}>{member}</Text>
                  </View>
                ))
              )}
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Your Tasks</Text>
            {isLoadingTasks ? (
              <ActivityIndicator
                size="small"
                color="#4a09a5"
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            ) : userTasks.length > 0 ? (
              userTasks.map((task, index) => (
                <View key={index} style={styles.taskItem}>
                  <Text style={styles.taskTitle}>{task.taskName}</Text>
                  <Text>{task.taskBody}</Text>

                  {task.createdBy !== task.assignedTo && (
                    <View style={styles.assignmentInfo}>
                      <View style={styles.assignmentRow}>
                        <Icon
                          name="user"
                          size={16}
                          style={styles.assignmentIcon}
                        />
                        <Text>
                          <Text style={styles.assignmentLabel}>
                            Assigned By:
                          </Text>
                          {" " + task.createdBy}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.noTasksText}>You have no tasks.</Text>
            )}
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Tasks</Text>
            <TouchableOpacity
              style={[styles.baseButton, styles.tasksButton]}
              onPress={() => setShowTaskScreen(true)}
            >
              <Icon
                name="tasks"
                size={20}
                color="white"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.buttonText}>Manage Shared Tasks</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Shopping</Text>
            <TouchableOpacity
              style={[styles.baseButton, styles.shoppingButton]}
              onPress={() => setShowSharedShoppingScreen(true)}
            >
              <Icon
                name="shopping-cart"
                size={20}
                color="white"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.buttonText}>Manage Shared Shopping List</Text>
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
    padding: 10,
    backgroundColor: "#fff",
  },
  scrollView: {
    width: "100%",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    paddingHorizontal: 1,
    paddingVertical: 10,
  },
  taskItem: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  taskTitle: {
    fontWeight: "bold",
  },
  assignmentInfo: {
    marginTop: 5,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  assignmentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  assignmentIcon: {
    color: "#4CAF50",
    marginRight: 5,
  },
  assignmentLabel: {
    fontWeight: "bold",
    color: "#4a09a5",
  },
  roommateContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  roommateItem: {
    width: "30%",
    margin: "1%",
    backgroundColor: "#f7f7f7",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  roommateText: {
    color: "#000",
    textAlign: "center",
    flexShrink: 1,
  },
  baseButton: {
    padding: 15,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tasksButton: {
    backgroundColor: "#4a09a5",
  },
  shoppingButton: {
    backgroundColor: "#051094",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  noTasksText: {
    textAlign: "center",
    color: "black",
    marginTop: 20,
  },
});

export default HomeScreen;
