import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  addDoc,
  collection,
} from "firebase/firestore";

const WelcomeScreen = ({ route, navigation }) => {
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

  const { username, uid } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [inputGroupId, setInputGroupId] = useState("");

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

      navigation.navigate("HelloWorld", { groupId: groupId });
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
          routes: [{ name: "HelloWorld", params: { groupId: groupId } }],
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
        style={styles.button}
        onPress={() => setJoinModalVisible(true)}
      >
        <Text style={styles.buttonText}>Join Group</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleGroupName}>
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
                placeholder="Group Name"
                value={groupName}
                onChangeText={setGroupName}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleCreateGroupSubmit}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
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
                value={inputGroupId}
                onChangeText={setInputGroupId}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleJoinGroupSubmit}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
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
    backgroundColor: "#f7f7f7",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#8A2BE2",
    padding: 15,
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
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
    width: "80%",
  },
});

export default WelcomeScreen;
