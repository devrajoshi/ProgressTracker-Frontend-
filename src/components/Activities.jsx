import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "./Modal";
import AddTaskForm from "./AddTaskForm";
import axiosInstance from "../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

const COLORS = {
  green: "#34C759",
  yellow: "#FFCC00",
  red: "#FF3B30",
};

// Helper function to format time consistently
const formatTime = (timeStr) => {
  if (!timeStr) return "Invalid Time";
  try {
    // If it's a full ISO datetime string, extract just the time part
    if (timeStr.includes("T")) {
      const date = new Date(timeStr);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    // If it's just a time string (HH:mm), convert to 12-hour format
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Invalid Time";
  }
};

// Helper function to get completion status text and percentage
const getCompletionStatus = (completionPercentage) => {
  if (completionPercentage === 0) return { text: "Not Started", percentage: 0 };
  if (completionPercentage === 25)
    return { text: "Just Started", percentage: 25 };
  if (completionPercentage === 50)
    return { text: "In Progress", percentage: 50 };
  if (completionPercentage === 75)
    return { text: "Almost Done", percentage: 75 };
  if (completionPercentage === 100)
    return { text: "Completed", percentage: 100 };
  return { text: "Not Started", percentage: 0 }; // Default case
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const taskVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

const TaskItem = ({ task, onEdit, onDelete, onTaskCompletion }) => {
  const completionStatus = getCompletionStatus(task.completionPercentage || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-sm border ${
        task.completionPercentage === 0
          ? "border-red-100"
          : task.completionPercentage <= 50
          ? "border-yellow-100"
          : "border-green-100"
      } overflow-hidden`}
    >
      <div className="p-3 sm:p-4">
        {/* Header Row: Name and Actions */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base sm:text-lg font-medium text-gray-800">
            {task.name}
          </h3>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 sm:p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              title="Edit Task"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(task._id, task.name)}
              className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete Task"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Time and Status Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">
              {formatTime(task.start_time)} - {formatTime(task.end_time)}
            </span>
          </div>
          <span
            className={`text-xs sm:text-sm font-medium px-2.5 py-1 rounded-full ${
              completionStatus.percentage === 100
                ? "bg-green-100 text-green-800"
                : completionStatus.percentage >= 75
                ? "bg-emerald-100 text-emerald-800"
                : completionStatus.percentage >= 50
                ? "bg-yellow-100 text-yellow-800"
                : completionStatus.percentage >= 25
                ? "bg-orange-100 text-orange-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {completionStatus.text}
          </span>
        </div>

        {/* Progress Bar Row */}
        <div className="relative">
          <div className="flex items-center gap-1 sm:gap-2">
            {[0, 25, 50, 75, 100].map((percentage) => (
              <button
                key={percentage}
                onClick={() => onTaskCompletion(task._id, percentage)}
                className={`flex-1 h-7 sm:h-8 md:h-9 rounded flex items-center justify-center transition-all ${
                  task.completionPercentage >= percentage
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                disabled={task.completionPercentage === 100}
              >
                <span className="text-xs sm:text-sm">{percentage}%</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Activities = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Helper function to format time for edit form (24-hour format)
  const formatTimeForEdit = (timeStr) => {
    if (!timeStr) return "";
    try {
      // If it's a full ISO datetime string, extract just the time part
      if (timeStr.includes("T")) {
        const date = new Date(timeStr);
        return `${String(date.getHours()).padStart(2, "0")}:${String(
          date.getMinutes()
        ).padStart(2, "0")}`;
      }

      // If it's already in HH:mm format, return it
      if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr)) {
        return timeStr;
      }

      return timeStr;
    } catch (error) {
      console.error("Error formatting time for edit:", error);
      return "";
    }
  };

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      // Use axiosInstance with withCredentials to include cookies in the request
      const response = await axiosInstance.get(`${API_URL}/api/tasks`);

      // Check if response has the expected structure
      const tasksData = response.data?.data || [];

      // Process the tasks to include completion history and ensure completionPercentage is set
      const processedTasks = tasksData.map((task) => {
        // Get the latest completion record if it exists
        const latestCompletion = task.completionHistory?.[0];
        const today = new Date().toISOString().split("T")[0];

        // Use the latest completion percentage if it's from today
        const completionPercentage =
          latestCompletion?.date === today
            ? latestCompletion.completionPercentage
            : task.completionPercentage || 0;

        return {
          ...task,
          completionPercentage,
          completionHistory: task.completionHistory || [],
        };
      });

      setTasks(processedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);

      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Failed to fetch tasks");
      }
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, []);

  // Helper function for priority-based colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 border-red-300";
      case "Medium":
        return "bg-orange-100 border-orange-300";
      case "Low":
        return "bg-green-100 border-green-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  // Handle task completion with percentage
  const handleTaskCompletion = async (taskId, currentPercentage) => {
    try {
      const today = new Date().toISOString().split("T")[0];

      // Use the exact percentage that was clicked
      const newPercentage = currentPercentage;

      // Update the task completion status
      const response = await axiosInstance.post(
        `${API_URL}/api/tasks/${taskId}/complete`,
        {
          date: today,
          completionPercentage: newPercentage,
        }
      );

      // Get the completion record from the response
      const completionRecord = response.data?.data;

      if (!completionRecord) {
        throw new Error("No completion record returned from server");
      }

      // Get the status text for the new percentage
      const newStatus = getCompletionStatus(newPercentage);
      toast.success(`Task progress updated to ${newStatus.text}!`);

      // Update the local state with the new completion record
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task._id === taskId) {
            return {
              ...task,
              completionPercentage: newPercentage,
              completionHistory: [
                {
                  date: today,
                  completionPercentage: newPercentage,
                  completed_at: new Date().toISOString(),
                  ...(completionRecord || {}),
                },
                ...(task.completionHistory || []),
              ],
            };
          }
          return task;
        })
      );

      // Fetch tasks again to ensure we have the latest data
      await fetchTasks();
    } catch (error) {
      console.error("Error marking task as completed:", error);
      if (error.response?.status === 400) {
        toast.error(
          error.response.data?.message || "Task is already completed for today"
        );
      } else {
        toast.error("Failed to update task status");
      }
      // Fetch tasks again to ensure we're in sync with the server
      await fetchTasks();
    }
  };

  // Open the modal for adding a new task
  const openAddModal = () => {
    setSelectedTask(null); // No task selected means "add new task"
    setIsModalOpen(true);
  };

  // Open the modal for editing an existing task
  const openEditModal = (task) => {
    if (!task || !task._id) {
      console.error("Invalid task object:", task);
      return toast.error("Failed to load task details");
    }

    // Format the task data to match AddTaskForm expectations
    const formattedTask = {
      ...task,
      start_time: formatTimeForEdit(task.start_time),
      end_time: formatTimeForEdit(task.end_time),
    };

    console.log("Formatted task for editing:", formattedTask); // Debug log
    setSelectedTask(formattedTask);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setSelectedTask(null); // Reset selected task
    setIsModalOpen(false);
  };

  // Handle task deletion with custom-styled confirmation toast
  const handleDelete = (taskId, taskName) => {
    toast(
      <div className="max-w-[90vw] sm:max-w-md w-full p-4 sm:p-6 bg-white bg-opacity-95 backdrop-blur-md text-black rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Delete '{taskName}'?</h3>
        <p className="mb-4 text-sm text-gray-600">
          Are you sure you want to delete this task?
        </p>
        <div className="flex justify-end gap-2 sm:gap-3">
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              try {
                await axiosInstance.delete(`/api/tasks/${taskId}`);
                toast.dismiss();
                toast.success("Task deleted successfully!");
                fetchTasks(); // Refresh the task list
              } catch (error) {
                console.error("Error deleting task:", error);
                toast.dismiss();
                toast.error(
                  error.response?.data?.message || "Failed to delete task"
                );
              }
            }}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeButton: false,
        style: {
          maxWidth: "90vw",
          width: "auto",
          padding: 0,
        },
        className: "!w-auto",
        toastId: `delete-${taskId}`, // Prevent duplicate toasts
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Your Tasks
          </h1>
          <p className="text-gray-600">
            Track and manage your daily activities
          </p>
        </motion.div>

        {/* Task List with reduced width on larger screens */}
        <div className="max-w-3xl mx-auto space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onTaskCompletion={handleTaskCompletion}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12 bg-white rounded-lg shadow-sm"
            >
              <p className="text-gray-500 text-lg mb-4">No tasks found</p>
              <p className="text-gray-400">
                Click the + button to add your first task!
              </p>
            </motion.div>
          )}
        </div>

        {/* Floating Action Button - Larger on bigger screens */}
        <motion.button
          onClick={openAddModal}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-8 right-8 w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-colors duration-300 ease-in-out"
        >
          <span className="text-2xl sm:text-3xl md:text-4xl">+</span>
        </motion.button>

        {/* Modal */}
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div>
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                {selectedTask ? "Edit Task" : "Create a New Task"}
              </h2>
              <AddTaskForm
                onClose={closeModal}
                onTaskAdded={fetchTasks}
                task={selectedTask}
              />
            </div>
          </Modal>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Activities;
