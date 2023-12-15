import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const GroupSetupScreen = ({ route, navigation }) => {
  const { username, uid } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [inputGroupId, setInputGroupId] = useState("");

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Icon
            name="cog"
            size={25}
            color="black"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleGroupName = () => {
    setModalVisible(true);
  };

  const handleCreateGroupSubmit = () => {
    if (groupName.trim() === "") {
      Alert.alert("Error", "Please enter a group name.");
    } else {
      createGroup(groupName.trim(), uid, navigation);
      setGroupName("");
      setModalVisible(false);
    }
  };

  const handleJoinGroupSubmit = () => {
    if (inputGroupId.trim() === "") {
      Alert.alert("Error", "Please enter a group ID.");
    } else {
      joinGroup(inputGroupId.trim(), uid);
      setInputGroupId("");
      setJoinModalVisible(false);
    }
  };

  const createGroup = async (groupName, userId, navigation) => {
    const db = getFirestore();

    if (typeof groupName !== "string") {
      console.error("Invalid groupName type:", typeof groupName);
      throw new Error("groupName must be a string");
    }

    try {
      const groupRef = await addDoc(collection(db, "Groups"), {
        groupName,
        members: [userId],
        shoppingList: [],
        chores: [],
      });

      const groupId = groupRef.id;

      Alert.alert("Success", `Your Group ID is: ${groupId}`);

      const userRef = doc(db, "Users", userId);
      await updateDoc(userRef, {
        roommateGroupID: groupId,
      });

      navigation.navigate("Home", {
        groupId,
        username,
      });
    } catch (error) {
      console.error("Error creating group:", error);
      Alert.alert("Error", "Unable to create group. Please try again.");
    }
  };

  const joinGroup = async (groupId, userId) => {
    const db = getFirestore();
    const userRef = doc(db, "Users", userId);
    const groupRef = doc(db, "Groups", groupId);

    try {
      const docSnap = await getDoc(groupRef);
      if (docSnap.exists()) {
        await updateDoc(groupRef, {
          members: arrayUnion(userId),
        });

        await updateDoc(userRef, {
          roommateGroupID: groupId,
        });

        navigation.reset({
          index: 0,
          routes: [{ name: "Home", params: { groupId, username } }],
        });
      } else {
        Alert.alert(
          "Group not found",
          "Please check the Group ID and try again."
        );
      }
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome {username}!</Text>

      <TouchableOpacity
        style={[styles.baseButton, styles.button]}
        onPress={() => setJoinModalVisible(true)}
      >
        <Icon
          name="user-plus"
          size={20}
          color="white"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.buttonText}>Join Group</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.baseButton, styles.button]}
        onPress={handleGroupName}
      >
        <Icon
          name="plus-square"
          size={20}
          color="white"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.buttonText}>Create Group</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.input}
                placeholder="Enter Group Name"
                placeholderTextColor="#808080"
                value={groupName}
                onChangeText={setGroupName}
              />
              <TouchableOpacity
                style={[styles.baseButton, styles.modalActionButton]}
                onPress={handleCreateGroupSubmit}
              >
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.baseButton, styles.modalCancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={joinModalVisible}
        onRequestClose={() => setJoinModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.input}
                placeholder="Enter Group ID"
                placeholderTextColor="#808080"
                value={inputGroupId}
                onChangeText={setInputGroupId}
              />

              <TouchableOpacity
                style={[styles.baseButton, styles.modalActionButton]}
                onPress={handleJoinGroupSubmit}
              >
                <Text style={styles.buttonText}>Join</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.baseButton, styles.modalCancelButton]}
                onPress={() => setJoinModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  baseButton: {
    padding: 15,
    borderRadius: 5,
    width: "100%",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#4a09a5",
  },
  modalActionButton: {
    backgroundColor: "#4CAF50",
    width: "75%",
    marginBottom: 20,
  },
  modalCancelButton: {
    backgroundColor: "#f44336",
    width: "75%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "80%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "100%",
  },
});

export default GroupSetupScreen;
