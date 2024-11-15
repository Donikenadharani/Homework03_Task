import React, { useState, useEffect, useContext, useReducer, useRef, useCallback, useMemo  } from 'react';
import './App.css';


const UserContext = React.createContext();


const UserProvider = ({ children }) => {
  const user = { name: 'Dharani Donikena' }; 
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};


const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};


const taskReducer = (tasks, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return [...tasks, { id: Date.now(), title: action.title, completed: false }];
    case 'TOGGLE_TASK':
      return tasks.map(task =>
        task.id === action.id ? { ...task, completed: !task.completed } : task
      );
    case 'DELETE_TASK':
      return tasks.filter(task => task.id !== action.id);
    default:
      return tasks;
  }
};

const TaskManager = () => {
 
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [storedTasks, setStoredTasks] = useLocalStorage('tasks', []);


  useEffect(() => {
    setStoredTasks(tasks);
  }, [tasks, setStoredTasks]);


  const user = useContext(UserContext);


  const taskInputRef = useRef(null);


  useEffect(() => {
    taskInputRef.current?.focus();
  }, []);


  const addTask = useCallback((title) => {
    dispatch({ type: 'ADD_TASK', title });
  }, []);

  const toggleTask = useCallback((id) => {
    dispatch({ type: 'TOGGLE_TASK', id });
  }, []);

  const deleteTask = useCallback((id) => {
    dispatch({ type: 'DELETE_TASK', id });
  }, []);

  const totalTasks = useMemo(() => tasks.length, [tasks]);
  const completedTasks = useMemo(
    () => tasks.filter(task => task.completed).length,
    [tasks]
  );


  const handleAddTask = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      addTask(e.target.value);
      e.target.value = '';
    }
  };

  return (
    <div className="task-manager">
      <h1>{user.name}'s Task Manager</h1>
      <div>
        <input
          ref={taskInputRef}
          type="text"
          placeholder="Add a new Task"
          onKeyDown={handleAddTask}
        />
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <span onClick={() => toggleTask(task.id)}>
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div className="task-stats">
        <p>Total Tasks: {totalTasks}</p>
        <p>Completed Tasks: {completedTasks}</p>
      </div>
    </div>
  );
};


const App = () => (
  <UserProvider>
    <TaskManager />
  </UserProvider>
);

export default App;
