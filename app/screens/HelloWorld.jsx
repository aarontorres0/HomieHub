import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import TaskScreen from "./TaskScreen";
import SharedShoppingScreen from "./SharedShoppingScreen";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  collection,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

const HelloWorld = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const groupId = route.params?.groupId;
  const username = route.params?.username;

  const [groupMembers, setGroupMembers] = useState([]);
  const [showTaskScreen, setShowTaskScreen] = useState(false);
  const [showSharedShoppingScreen, setShowSharedShoppingScreen] =
    useState(false);

  const fetchGroupMembers = async () => {
    if (groupId) {
      const db = getFirestore();
      const groupRef = doc(db, "Groups", groupId);

      try {
        const docSnap = await getDoc(groupRef);
        if (docSnap.exists()) {
          const memberIds = docSnap.data().members;
          const members = [];
          for (const memberId of memberIds) {
            const userRef = doc(db, "Users", memberId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              members.push(userSnap.data().name);
            } else {
              console.log(" User not found for id: ", memberId);
            }
          }

          setGroupMembers(members);
        } else {
          Alert.alert("Group not found");
        }
      } catch (error) {
        console.error("Error fetching group members:", error);
      }
    }
  };

  const updateTasksInFirestore = async (taskName, taskBody, date) => {
    const db = getFirestore();

    try {
      const taskData = {
        groupId: groupId,
        name: taskName,
        body: taskBody,
        dueDate: date,
        // TODO: add a createdBy value
      };

      await addDoc(collection(db, "Tasks"), taskData);

      console.log("Task added to Firestore");
      alert("Task successfully added!");
    } catch (error) {
      console.error("Error adding task to Firestore:", error);
      alert("Error adding task. Please try again.");
    }
  };

  const updateShoppingListInFirestore = async (newItem) => {
    const db = getFirestore();

    try {
      const shoppingListRef = doc(db, "ShoppingLists", groupId);
      await updateDoc(shoppingListRef, {
        items: arrayUnion(newItem),
      });

      console.log("Shopping list updated in Firestore");
    } catch (error) {
      console.error("Error updating shopping list in Firestore:", error);
    }
  };

  useEffect(() => {
    fetchGroupMembers();
  }, []);

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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Settings", { groupId, username })}
        >
          <Image
            source={require("../../assets/icons8-settings-96.png")}
            style={{ width: 25, height: 25, marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, groupId]);

  return (
    <View style={styles.container}>
      {showTaskScreen ? (
        <TaskScreen
          onClose={handleCloseTaskScreen}
          updateTasks={updateTasksInFirestore}
        />
      ) : showSharedShoppingScreen ? (
        <SharedShoppingScreen
          onClose={handleCloseSharedShoppingScreen}
          updateShoppingList={updateShoppingListInFirestore}
        />
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <Text style={styles.sectionTitle}>Your Roommates</Text>
            <View style={styles.roommateContainer}>
              {groupMembers.map((member, index) => (
                <View key={index} style={styles.roommateItem}>
                  <Text style={styles.roommateText}>{member}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Tasks</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateTask}
            >
              <Text style={styles.buttonText}>Manage Shared Tasks</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Shopping</Text>
            <TouchableOpacity
              style={styles.sharedItem}
              onPress={handleSharedShopping}
            >
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
    textAlign: "left",
    paddingHorizontal: 1,
    paddingTop: 20,
    paddingBottom: 10,
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
    backgroundColor: "#4a09a5",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  roommateText: {
    color: "#ffffff",
    textAlign: "center",
    flexShrink: 1,
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
  sharedItem: {
    flex: 1,
    padding: 15,
    backgroundColor: "#051094",
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
