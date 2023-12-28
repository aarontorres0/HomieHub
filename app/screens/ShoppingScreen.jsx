import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";

const ShoppingScreen = ({ groupId, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!groupId) return;

    const db = getFirestore();
    const groupRef = doc(db, "Groups", groupId);
    const groupShoppingListRef = collection(groupRef, "GroupShoppingList");

    setIsLoading(true);

    const unsubscribe = onSnapshot(groupShoppingListRef, (querySnapshot) => {
      const itemsArray = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => a.itemName.localeCompare(b.itemName));

      setItems(itemsArray);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [groupId]);

  const handleAddItem = async () => {
    if (newItem.trim().length > 0) {
      const db = getFirestore();
      const groupRef = doc(db, "Groups", groupId);
      const groupShoppingListRef = collection(groupRef, "GroupShoppingList");

      await addDoc(groupShoppingListRef, { itemName: newItem });
      setNewItem("");
    }
  };

  const handleDeleteItem = async (id) => {
    const db = getFirestore();
    const itemRef = doc(db, "Groups", groupId, "GroupShoppingList", id);
    await deleteDoc(itemRef);
  };

  const renderRightActions = (id) => (
    <TouchableOpacity
      onPress={() => handleDeleteItem(id)}
      style={styles.deleteButton}
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderItem = (item) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.id)}
      key={item.id}
    >
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item.itemName}</Text>
      </View>
    </Swipeable>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Add a new item"
        value={newItem}
        onChangeText={setNewItem}
        onSubmitEditing={handleAddItem}
      />
      <TouchableOpacity
        style={[styles.baseButton, styles.addButton]}
        onPress={handleAddItem}
      >
        <Icon name="plus" size={20} color="white" />
      </TouchableOpacity>
      <View style={styles.divider} />
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color="#4a09a5"
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        />
      ) : (
        items.map(renderItem)
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 8,
    marginBottom: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  baseButton: {
    padding: 15,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: "#4a09a5",
  },
  itemContainer: {
    backgroundColor: "#f6f6f6",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    height: 50,
  },
  itemText: {
    fontSize: 18,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    height: 50,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
});

export default ShoppingScreen;
