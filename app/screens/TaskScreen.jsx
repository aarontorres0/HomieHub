import React, { useState, useEffect } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";

import { Picker } from '@react-native-picker/picker';



const TaskScreen = ({ onClose, updateTasks, groupMembers , assigner}) => {
  const [taskName, setTaskName] = useState("");
  const [taskBody, setTaskBody] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");


  useEffect(() => {
    const db = getFirestore();
    const tasksCollection = collection(db, "Tasks");
    const q = query(tasksCollection);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksArray);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const registerForNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission for notifications was denied");
      } else {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          }),
        });
      }
    };
    registerForNotifications();
  }, []);

  const handleSaveChanges = async () => {
    try {
      if (taskName.trim().length === 0) {
        alert("Please enter a task name.");
        return;
      }

      const currentDate = new Date();
      if (date <= currentDate) {
        alert("Please pick a future date for the reminder.");
        return;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: taskName,
          body: taskBody,
        },
        trigger: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
          hour: date.getHours(),
          minute: date.getMinutes(),
          second: 0,
          repeats: false,
        },
      });

      console.log(`Notification scheduled with ID: ${notificationId}`);
      alert("Task reminder set!");

      updateTasks(taskName, taskBody, date, assignedTo);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to schedule the notification. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    const db = getFirestore();
    await deleteDoc(doc(db, "Tasks", taskId));
  };

  const renderRightActions = (taskId) => (
    <TouchableOpacity
      onPress={() => handleDeleteTask(taskId)}
      style={styles.deleteTaskButton}
    >
      <Text style={styles.buttonText}>Delete</Text>
    </TouchableOpacity>
  );

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Task Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Task name"
        value={taskName}
        onChangeText={setTaskName}
      />
      <Text style={styles.header}>Task Body:</Text>
      <TextInput
        style={[styles.input, styles.inputLarge]}
        placeholder="Task body"
        value={taskBody}
        onChangeText={setTaskBody}
      />
       <Text style={styles.header}>Assign To:</Text>
    <Picker
    
      selectedValue={assignedTo}
      onValueChange={(itemValue, itemIndex) => setAssignedTo(itemValue)}
      style={styles.picker}>
      <Picker.Item label="Unassigned" value="" />
      {groupMembers.map((member, index) => (
        <Picker.Item key={index} label={member} value={member} />
      ))}
    </Picker>

      <TouchableOpacity
        onPress={showDatepicker}
        style={styles.datePickerButton}
      >
    
        <Text style={styles.datePickerButtonText}>
          Pick Reminder Date & Time
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={onChangeDate}
        />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDeleteTask}
        >
          <Text style={styles.buttonText}>Delete Task</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSaveChanges}
        >
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
      {tasks.map((task, index) => (
  <Swipeable
    renderRightActions={() => renderRightActions(task.id)}
    key={task.id}
  >
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{task.name}</Text>
      <Text>{task.body}</Text>

      <View style={styles.assignmentInfo}>
        <View style={styles.assignmentRow}>
          <Icon name="user" size={16} style={styles.assignmentIcon} />
          <Text>
            <Text style={styles.assignmentLabel}>Assigned By:</Text> {assigner || "N/A"}
          </Text>
        </View>
        <View style={styles.assignmentRow}>
          <Icon name="user-plus" size={16} style={styles.assignmentIcon} />
          <Text>
            <Text style={styles.assignmentLabel}>Assigned To:</Text> {assignedTo || "Unassigned"}
          </Text>
        </View>
      </View>
    </View>
  </Swipeable>
))}
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
    marginBottom: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#000",
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  inputLarge: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 15,
    borderRadius: 5,
    flexGrow: 1,
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  datePickerButton: {
    backgroundColor: "#4a09a5",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  datePickerButtonText: {
    color: "white",
    fontSize: 18,
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
  deleteTaskButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
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
    marginBottom: 5, // Adds space between the rows
  },
  assignmentIcon: {
    color: "#4CAF50",
    marginRight: 5,
  },
  assignmentText: {
    color: "#333",
    fontSize: 14,
  },
  assignmentLabel: {
    fontWeight: "bold",
    color: "#4a09a5",
  },
});

export default TaskScreen;
