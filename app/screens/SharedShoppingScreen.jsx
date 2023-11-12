import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

const SharedShoppingScreen = ({ onClose }) => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    if (newItem.trim().length > 0) {
      setItems((prevItems) => [...prevItems, newItem]);
      setNewItem("");
    }
  };

  const handleDeleteItem = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const renderRightActions = (index) => {
    return (
      <TouchableOpacity
        onPress={() => handleDeleteItem(index)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item, index }) => (
    <Swipeable renderRightActions={() => renderRightActions(index)}>
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item}</Text>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
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
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
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
    marginBottom: 20,
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
    height: "100%",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default SharedShoppingScreen;
