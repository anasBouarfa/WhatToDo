/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

function App() {
  const today = new Date();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [selectedDate, setSelectedDate] = React.useState<Date>(today);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  
  // Get the start of the current week (Sunday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  // Generate array of dates for the current week
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  const handleDatePress = (date: Date) => {
    setSelectedDate(date);
    console.log('Selected date:', date.toDateString());
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const todoTasks = tasks.filter(task => !task.completed);
  const doneTasks = tasks.filter(task => task.completed);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
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
            todoTasks.map(task => (
              <View key={task.id} style={styles.taskItem}>
                <Text style={styles.taskText}>{task.text}</Text>
              </View>
            ))
          )}
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Done</Text>
          {doneTasks.length === 0 ? (
            <Text style={styles.emptyText}>No completed tasks</Text>
          ) : (
            doneTasks.map(task => (
              <View key={task.id} style={styles.taskItem}>
                <Text style={[styles.taskText, styles.completedTaskText]}>{task.text}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
    backgroundColor: '#6B4EFF20', // Light purple background
  },
  date: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  selectedText: {
    color: '#6B4EFF', // Purple color
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
  },
  taskText: {
    fontSize: 16,
    color: '#000000',
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
});

export default App;
