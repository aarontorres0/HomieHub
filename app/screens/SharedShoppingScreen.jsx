import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

const SharedShoppingScreen = ({ onClose }) => {
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const shoppingCollection = collection(db, "ShoppingLists");
    const q = query(shoppingCollection);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const itemsArray = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setItems(itemsArray);
    });

    return () => unsubscribe();
  }, []);

  const handleAddItem = async () => {
    if (newItem.trim().length > 0) {
      const db = getFirestore();
      await addDoc(collection(db, "ShoppingLists"), { name: newItem });
      setNewItem("");
    }
  };

  const handleDeleteItem = async (id) => {
    const db = getFirestore();
    await deleteDoc(doc(db, "ShoppingLists", id));
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
        <Text style={styles.itemText}>{item.name}</Text>
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
      <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      {items.map(renderItem)}
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
  addButton: {
    backgroundColor: "#4a09a5",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 24,
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

export default SharedShoppingScreen;
