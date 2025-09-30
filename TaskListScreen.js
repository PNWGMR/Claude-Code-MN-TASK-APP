import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTask } from '../context/TaskContext';
import { useNavigation } from '@react-navigation/native';
import TaskCard from '../components/TaskCard';

export default function TaskListScreen() {
  const navigation = useNavigation();
  const { tasks, loading, fetchTasks } = useTask();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, completed

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    await fetchTasks();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const renderTask = ({ item }) => (
    <TaskCard
      task={item}
      onPress={() => navigation.navigate('TaskDetail', { task
