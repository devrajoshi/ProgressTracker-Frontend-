import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Switch } from "@headlessui/react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = {
  green: "#34C759",
  yellow: "#FFCC00",
  red: "#FF3B30",
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const History = () => {
  const [view, setView] = useState("monthly"); // 'weekly' or 'monthly'
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get completion status text
  const getCompletionStatus = (percentage) => {
    if (percentage === 0) return "Not Started";
    if (percentage === 50) return "In Progress";
    if (percentage === 100) return "Completed";
    return "Not Started";
  };

  // Helper function to normalize completion percentage to nearest valid step
  const normalizePercentage = (percentage) => {
    if (percentage === 0) return 0;
    if (percentage <= 50) return 50;
    return 100;
  };

  // Fetch history data from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/tasks/history");

        // Process the history data to get individual task completion data
        const processedData =
          response.data?.data?.map((record) => {
            const normalizedPercentage = normalizePercentage(
              record.completionPercentage || 0
            );
            const taskName = record.task_id?.name || "Unnamed Task";
            const date = new Date(record.date).toLocaleDateString();

            return {
              id: record._id || `${date}-${taskName}`, // Ensure unique ID for key prop
              taskName,
              completionPercentage: normalizedPercentage,
              status: getCompletionStatus(normalizedPercentage),
              date,
              totalTasks: 1,
              averageCompletion: normalizedPercentage,
            };
          }) || [];

        setHistoryData(processedData);
      } catch (error) {
        console.error("Error fetching history:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch history data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredData =
    view === "weekly"
      ? historyData.filter((item) => {
          const itemDate = new Date(item.date);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return itemDate >= weekAgo;
        })
      : historyData;

  const getFillColor = (percentage) => {
    if (percentage >= 80) return COLORS.green;
    if (percentage >= 50) return COLORS.yellow;
    return COLORS.red;
  };

  const averageCompletionRate =
    filteredData.length > 0
      ? filteredData.reduce((sum, item) => sum + item.completionPercentage, 0) /
        filteredData.length
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-12 h-12 border-4 border-indigo-600 rounded-full border-t-transparent"
        />
      </div>
    );
  }

  if (historyData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6"
      >
        <img
          src="https://illustrations.popsy.co/purple/taking-notes.svg"
          alt="No data"
          className="w-64 h-64 mb-6 opacity-80"
        />
        <p className="text-xl text-gray-600 font-medium">
          No history data available
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 0.5 }}
          className="hidden lg:block absolute top-0 left-0 w-64 h-64"
          style={{
            backgroundImage:
              "url('https://illustrations.popsy.co/purple/data-visualization.svg')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Productivity Dashboard
          </h1>
          <Switch.Group>
            <motion.div
              variants={itemVariants}
              className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md"
            >
              <Switch.Label className="mr-2 text-gray-700 cursor-pointer">
                Weekly
              </Switch.Label>
              <Switch
                checked={view === "weekly"}
                onChange={() =>
                  setView(view === "weekly" ? "monthly" : "weekly")
                }
                className={`${
                  view === "weekly" ? "bg-indigo-600" : "bg-gray-300"
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out`}
              >
                <span
                  className={`${
                    view === "weekly" ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out`}
                />
              </Switch>
              <Switch.Label className="ml-2 text-gray-700 cursor-pointer">
                Monthly
              </Switch.Label>
            </motion.div>
          </Switch.Group>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Daily Completion Trends
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredData}>
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis domain={[0, 100]} stroke="#6B7280" />
                <Tooltip
                  content={({ payload }) => {
                    if (!payload || payload.length === 0) return null;
                    const { date, totalTasks, averageCompletion } =
                      payload[0].payload;
                    return (
                      <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-100">
                        <p className="font-semibold text-gray-800">{date}</p>
                        <p className="text-gray-600">
                          Total Tasks: {totalTasks}
                        </p>
                        <p className="text-gray-600">
                          Average Completion: {averageCompletion.toFixed(1)}%
                        </p>
                      </div>
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="completionPercentage"
                  stroke="#6366F1"
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, value } = props;
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={6}
                        fill={getFillColor(value)}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    );
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Task Completion Percentages
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={filteredData}
                margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
              >
                <XAxis
                  dataKey="taskName"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                  stroke="#6B7280"
                />
                <YAxis domain={[0, 100]} stroke="#6B7280" />
                <Tooltip
                  content={({ payload }) => {
                    if (!payload || payload.length === 0) return null;
                    const { taskName, completionPercentage, date } =
                      payload[0].payload;
                    return (
                      <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-100">
                        <p className="font-semibold text-gray-800">
                          {taskName}
                        </p>
                        <p className="text-gray-600">Date: {date}</p>
                        <p className="text-gray-600">
                          Completion: {completionPercentage.toFixed(1)}%
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar
                  dataKey="completionPercentage"
                  fill="#6366F1"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Summary Donut Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Summary
            </h2>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Completed", value: averageCompletionRate },
                      { name: "Pending", value: 100 - averageCompletionRate },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[{ fill: COLORS.green }, { fill: COLORS.red }].map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill}
                          name={index === 0 ? "Completed" : "Pending"}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload || payload.length === 0) return null;
                      const { name, value } = payload[0].payload;
                      return (
                        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-100">
                          <p className="font-semibold text-gray-800">{name}</p>
                          <p className="text-gray-600">{value.toFixed(1)}%</p>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg font-medium text-gray-700 mt-4"
              >
                Average Completion Rate:{" "}
                <span className="text-indigo-600 font-semibold">
                  {averageCompletionRate.toFixed(1)}%
                </span>
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default History;
