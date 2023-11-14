import React, { useEffect, useState } from "react";
import Clipboard from "@react-native-community/clipboard";
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
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");

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
  const copyToClipboard = (groupId) => {
    Clipboard.setString(groupId);
    Alert.alert(
      "Copied!",
      `Group ID: ${groupId} has been copied to clipboard.`
    );
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
      setGroupId(groupId);

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
    const groupRef = doc(db, "Groups", groupId);

    try {
      const docSnap = await getDoc(groupRef);
      if (docSnap.exists()) {
        await updateDoc(groupRef, {
          members: arrayUnion(userId),
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
      console.error("Error joining group: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome {username}!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => console.log("TODO: put join group fn here")}
      >
        <Text style={styles.buttonText}>Join Group</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleGroupName}>
        <Text style={styles.buttonText}>Create Group</Text>
      </TouchableOpacity>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
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

              <TouchableOpacity
                style={styles.button}
                onPress={() => copyToClipboard(groupId)}
              >
                <Text style={styles.buttonText}>Copy Group ID</Text>
              </TouchableOpacity>
              <Text>Your Group ID: {groupId}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => copyToClipboard(groupId)}
              >
                <Text style={styles.buttonText}>Copy Group ID</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </TouchableWithoutFeedback>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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

    width: "90%",
    maxWidth: 300,
  },
});

export default WelcomeScreen;
