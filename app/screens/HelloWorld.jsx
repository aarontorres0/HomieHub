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
import { getFirestore, doc, getDoc } from "firebase/firestore";

const HelloWorld = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const groupId = route.params?.groupId;

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

  useEffect(() => {
    fetchGroupMembers();
  }, [groupId]);

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
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Image
            source={require("../../assets/icons8-settings-96.png")}
            style={{ width: 25, height: 25, marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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
            {groupMembers.map((member, index) => (
              <View key={index} style={styles.roommateItem}>
                <Text style={styles.roommateName}>{member}</Text>
              </View>
            ))}
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
