import React, { createContext, useState, useContext, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask, assignTask } from '../services/api';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks(filters);
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      setError(null);
      const newTask = await createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      return { success: true, task: newTask };
    } catch (err) {
      setError(err.message || 'Failed to create task');
      return { success: false, error: err.message };
    }
  };

  const editTask = async (taskId, updates) => {
    try {
      setError(null);
      const updatedTask = await updateTask(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      return { success: true, task: updatedTask };
    } catch (err) {
      setError(err.message || 'Failed to update task');
      return { success: false, error: err.message };
    }
  };

  const removeTask = async (taskId) => {
    try {
      setError(null);
      await deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to delete task');
      return { success: false, error: err.message };
    }
  };

  const assignTaskToMember = async (taskId, memberId) => {
    try {
      setError(null);
      const updatedTask = await assignTask(taskId, memberId);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      return { success: true, task: updatedTask };
    } catch (err) {
      setError(err.message || 'Failed to assign task');
      return { success: false, error: err.message };
    }
  };

  const getTaskById = (taskId) => {
    return tasks.find(task => task.id === taskId);
  };

  const value = {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
    assignTaskToMember,
    getTaskById,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
