/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { Task, TaskOccurrence } from './Models/Task';

function App() {
  const today = new Date();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [selectedDate, setSelectedDate] = React.useState<Date>(today);
  const [currentWeekStart, setCurrentWeekStart] = React.useState<Date>(() => {
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay());
    return start;
  });
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [newTaskTitle, setNewTaskTitle] = React.useState('');
  const [newTaskDescription, setNewTaskDescription] = React.useState('');
  const [newTaskOccurrence, setNewTaskOccurrence] = React.useState<TaskOccurrence>('once');
  
  const occurrences: TaskOccurrence[] = ['once', 'daily', 'weekly', 'monthly', 'yearly'];
  
  const handlePreviousWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(today);
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay());
    setCurrentWeekStart(start);
  };

  // Generate array of dates for the current week
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + i);
    return date;
  });

  const handleDatePress = (date: Date) => {
    setSelectedDate(date);
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const todoTasks = tasks.filter((task: Task) => !task.completed && task.date.toDateString() === selectedDate.toDateString());
  const doneTasks = tasks.filter((task: Task) => task.completed && task.date.toDateString() === selectedDate.toDateString());

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = new Task(newTaskTitle, newTaskDescription, selectedDate, newTaskOccurrence);
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskOccurrence('once');
      setIsModalVisible(false);
    }
  };

  const isCurrentWeek = () => {
    const today = new Date();
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - today.getDay());
    return startOfCurrentWeek.toDateString() === currentWeekStart.toDateString();
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task: Task) => task.id !== taskId));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
      </View>
      <View style={styles.weekNavigation}>
        <TouchableOpacity
          style={styles.weekNavButton}
          onPress={handlePreviousWeek}
          activeOpacity={0.7}
        >
          <Text style={styles.weekNavButtonText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.todayButton,
            isCurrentWeek() && styles.todayButtonInactive
          ]}
          onPress={handleToday}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.todayButtonText,
            isCurrentWeek() && styles.todayButtonTextInactive
          ]}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.weekNavButton}
          onPress={handleNextWeek}
          activeOpacity={0.7}
        >
          <Text style={styles.weekNavButtonText}>→</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.weekContainer}>
        {weekDates.map((date, index) => {
          const selected = isSelected(date);
          return (
            <View key={index} style={styles.dayContainer}>
              <Text style={[
                styles.dayName,
                selected && styles.selectedText
              ]}>
                {daysOfWeek[date.getDay()]}
              </Text>
              <TouchableOpacity
                style={[
                  styles.dateContainer,
                  selected && styles.selectedContainer
                ]}
                onPress={() => handleDatePress(date)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.date,
                  selected && styles.selectedText
                ]}>
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      <ScrollView style={styles.tasksContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>To Do</Text>
          {todoTasks.length === 0 ? (
            <Text style={styles.emptyText}>No tasks for today</Text>
          ) : (
            todoTasks.map((task: Task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskItem}
                onPress={() => toggleTaskCompletion(task.id)}
                activeOpacity={0.7}
              >
                <View style={styles.taskContent}>
                  <Text style={styles.taskText}>{task.title}</Text>
                  {task.description && (
                    <Text style={styles.taskDescription}>{task.description}</Text>
                  )}
                  <Text style={styles.taskOccurrence}>{task.occurrence}</Text>
                </View>
                <View style={styles.taskActions}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteTask(task.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                  <View style={styles.checkbox}>
                    <Text style={styles.checkboxText}>✓</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Done</Text>
          {doneTasks.length === 0 ? (
            <Text style={styles.emptyText}>No completed tasks</Text>
          ) : (
            doneTasks.map((task: Task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskItem}
                onPress={() => toggleTaskCompletion(task.id)}
                activeOpacity={0.7}
              >
                <View style={styles.taskContent}>
                  <Text style={[styles.taskText, styles.completedTaskText]}>{task.title}</Text>
                  {task.description && (
                    <Text style={[styles.taskDescription, styles.completedTaskText]}>{task.description}</Text>
                  )}
                  <Text style={[styles.taskOccurrence, styles.completedTaskText]}>{task.occurrence}</Text>
                </View>
                <View style={[styles.checkbox, styles.checkboxChecked]}>
                  <Text style={[styles.checkboxText, styles.checkboxTextChecked]}>✓</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Task</Text>
            <TextInput
              style={styles.input}
              placeholder="Task Title"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Description (optional)"
              value={newTaskDescription}
              onChangeText={setNewTaskDescription}
              multiline
            />
            <View style={styles.occurrenceContainer}>
              <Text style={styles.occurrenceLabel}>Occurrence:</Text>
              <View style={styles.occurrenceButtons}>
                {occurrences.map((occurrence) => (
                  <TouchableOpacity
                    key={occurrence}
                    style={[
                      styles.occurrenceButton,
                      newTaskOccurrence === occurrence && styles.selectedOccurrenceButton
                    ]}
                    onPress={() => setNewTaskOccurrence(occurrence)}
                  >
                    <Text style={[
                      styles.occurrenceButtonText,
                      newTaskOccurrence === occurrence && styles.selectedOccurrenceText
                    ]}>
                      {occurrence.charAt(0).toUpperCase() + occurrence.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsModalVisible(false);
                  setNewTaskTitle('');
                  setNewTaskDescription('');
                  setNewTaskOccurrence('once');
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddTask}
              >
                <Text style={[styles.buttonText, styles.addButtonText]}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const dayWidth = width / 7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 15,
  },
  weekNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  weekNavButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  todayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#6B4EFF',
  },
  todayButtonInactive: {
    backgroundColor: '#F5F5F5',
  },
  todayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  todayButtonTextInactive: {
    color: '#888888',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 15,
  },
  dayContainer: {
    width: dayWidth,
    alignItems: 'center',
  },
  dayName: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 8,
  },
  dateContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedContainer: {
    backgroundColor: '#6B4EFF20',
  },
  date: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  selectedText: {
    color: '#6B4EFF',
    fontWeight: 'bold',
  },
  tasksContainer: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  taskItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#000000',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  taskOccurrence: {
    fontSize: 12,
    color: '#6B4EFF',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#888888',
  },
  emptyText: {
    fontSize: 14,
    color: '#888888',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 10,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6B4EFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  occurrenceContainer: {
    marginBottom: 15,
  },
  occurrenceLabel: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
  },
  occurrenceButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  occurrenceButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  selectedOccurrenceButton: {
    backgroundColor: '#6B4EFF20',
    borderColor: '#6B4EFF',
  },
  occurrenceButtonText: {
    fontSize: 14,
    color: '#000000',
  },
  selectedOccurrenceText: {
    color: '#6B4EFF',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  addButton: {
    backgroundColor: '#6B4EFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  addButtonText: {
    color: '#FFFFFF',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6B4EFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkboxChecked: {
    backgroundColor: '#6B4EFF',
  },
  checkboxText: {
    color: '#6B4EFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxTextChecked: {
    color: '#FFFFFF',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF4B4B20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FF4B4B',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
});

export default App;
