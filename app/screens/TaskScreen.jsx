import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as Notifications from "expo-notifications";
import {
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
import Icon from "react-native-vector-icons/FontAwesome";

const TaskScreen = ({ onClose, updateTasks, groupMembers }) => {
  const sortedGroupMembers = [...groupMembers].sort((a, b) =>
    a.localeCompare(b)
  );
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
      const tasksArray = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

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

      let notificationId = null;
      const currentDate = new Date();
      if (date > currentDate) {
        notificationId = await Notifications.scheduleNotificationAsync({
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
      }

      updateTasks(taskName, taskBody, date, assignedTo, notificationId);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to save the task. Please try again.");
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
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  );

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
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
      <Text style={styles.assignHeader}>Assign To:</Text>
      <Picker
        selectedValue={assignedTo}
        onValueChange={(itemValue) => setAssignedTo(itemValue)}
      >
        <Picker.Item label="Unassigned" value="" />
        {sortedGroupMembers.map((member, index) => (
          <Picker.Item key={index} label={member} value={member} />
        ))}
      </Picker>

      <TouchableOpacity
        onPress={() => setShowDatePicker(!showDatePicker)}
        style={styles.datePickerButton}
      >
        <Text style={styles.buttonText}>Pick Reminder Date & Time</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <View style={styles.dateTimePickerContainer}>
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="datetime"
            is24Hour={true}
            display="default"
            onChange={onChangeDate}
          />
        </View>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.buttonText}>Create Task</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      {tasks.map((task) => (
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
                  <Text style={styles.assignmentLabel}>Assigned By:</Text>
                  {" " + task.createdBy || " N/A"}
                </Text>
              </View>
              <View style={styles.assignmentRow}>
                <Icon
                  name="user-plus"
                  size={16}
                  style={styles.assignmentIcon}
                />
                <Text>
                  <Text style={styles.assignmentLabel}>Assigned To:</Text>
                  {" " + task.assignedTo || " Unassigned"}
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
  assignHeader: {
    fontSize: 16,
    fontWeight: "bold",
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
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  deleteButtonText: {
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
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  dateTimePickerContainer: {
    marginBottom: 25,
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
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
});

export default TaskScreen;
