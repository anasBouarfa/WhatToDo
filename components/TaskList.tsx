import React, {useState} from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Checkbox,
  IconButton,
  Input,
  Button,
  useToast,
} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const toast = useToast();

  const addTask = () => {
    if (newTask.trim() === '') {
      toast.show({
        description: 'Please enter a task',
        variant: 'warning',
      });
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
    };

    setTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? {...task, completed: !task.completed} : task,
      ),
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <Box>
      <VStack space={4}>
        <HStack space={2}>
          <Input
            flex={1}
            placeholder="Add a new task"
            value={newTask}
            onChangeText={setNewTask}
          />
          <Button onPress={addTask}>Add</Button>
        </HStack>

        <VStack space={2}>
          {tasks.map(task => (
            <HStack
              key={task.id}
              space={2}
              alignItems="center"
              bg="white"
              p={2}
              rounded="md"
              shadow={1}>
              <Checkbox
                isChecked={task.completed}
                onChange={() => toggleTask(task.id)}
                value={task.id}
              />
              <Text
                flex={1}
                strikeThrough={task.completed}
                color={task.completed ? 'gray.400' : 'black'}>
                {task.title}
              </Text>
              <IconButton
                icon={<Icon name="delete" size={24} color="red" />}
                onPress={() => deleteTask(task.id)}
              />
            </HStack>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default TaskList; 