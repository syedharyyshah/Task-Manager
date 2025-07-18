import React, { useEffect, useState } from 'react'
import DashboardLauout from '../../components/layouts/DashboardLauout'
import { useLocation, useNavigate } from 'react-router-dom'
import { LuTrash2 } from 'react-icons/lu';
import { PRIORITY_DATA } from '../../utils/data';
import SelectDropdown from '../../components/Inputs/SelectDropdown';
import SelectUsers from '../../components/Inputs/SelectUsers ';
import TodoListInput from '../../components/Inputs/TodoListInput';
import AddAttachmentsInput from '../../components/Inputs/AddAttachmentsInput'
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import Modal from '../../components/Modal';
import DeleteAlert from '../../components/DeleteAlert';

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    dueDate: '',
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [error, setError] = useState('');

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: '',
      description: '',
      priority: 'Low',
      dueDate: '',
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  const createTask = async () => {
    setLoading(true);
    try {
      const todoList = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,
      });

      toast.success("Task Created Successfully");
      clearData();
      navigate('/admin/tasks');
    } catch (err) {
      console.error("Error creating task:", err);
      toast.error(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    setLoading(true);
    try {
      const todoList = taskData.todoChecklist?.map((item) => {
        const existingItem = currentTask?.todoChecklist?.find(
          (todo) => todo.text === item
        );
        
        return {
          text: item,
          completed: existingItem ? existingItem.completed : false,
        };
      });

      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK(taskId),
        {
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          dueDate: new Date(taskData.dueDate).toISOString(),
          assignedTo: taskData.assignedTo,
          todoChecklist: todoList,
          attachments: taskData.attachments,
        }
      );
      
      toast.success("Task Updated Successfully");
      navigate('/admin/tasks');
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error(error.response?.data?.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      setOpenDeleteAlert(false);
      toast.success("Task deleted successfully");
      navigate('/admin/tasks');
    } catch (error) {
      console.error("Error deleting task:", error.response?.data?.message || error.message);
      toast.error("Failed to delete task");
    }
  };

  const handleSubmit = () => {
    setError('');

    if (!taskData.title.trim()) {
      setError('Task title is required.');
      return;
    }
    if (!taskData.dueDate) {
      setError('Due date is required.');
      return;
    }
    if (taskData.assignedTo.length === 0) {
      setError('Task must be assigned to at least one member.');
      return;
    }
    if (taskData.todoChecklist.length === 0) {
      setError('Add at least one todo task.');
      return;
    }

    if (taskId) {
      updateTask();
    } else {
      createTask();
    }
  };

  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );

      if (response.data) {
        const taskInfo = response.data;
        setCurrentTask(taskInfo);

        setTaskData({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : '',
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          todoChecklist: taskInfo?.todoChecklist?.map((item) => item.text) || [],
          attachments: taskInfo?.attachments || [],
        });
      }
    } catch (error) {
      console.error("Error fetching task details", error);
      toast.error("Failed to load task details");
    }
  };

  

  useEffect(() => {
    if (taskId) {
      getTaskDetailsByID();
    }
  }, [taskId]);

  return (
    <DashboardLauout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? 'Update Task' : 'Create Task'}
              </h2>

              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>

            {/* Task Title */}
            <div className="mt-4">
              <label className="text-xs dark:text-gray-50 font-medium text-slate-600">
                Task Title
              </label>
              <input
                placeholder="Create App UI"
                className="form-input"
                value={taskData.title}
                onChange={({ target }) => handleValueChange('title', target.value)}
              />
            </div>

            {/* Description */}
            <div className="mt-3">
              <label className="text-xs font-medium dark:text-gray-50 text-slate-600">
                Description
              </label>
              <textarea
                placeholder="Describe Task"
                className="form-input"
                rows={4}
                value={taskData.description}
                onChange={({ target }) => handleValueChange('description', target.value)}
              />
            </div>

            {/* Task Details */}
            <div className="grid grid-cols-12 gap-4 mt-2">
              {/* Priority */}
              <div className="col-span-6 md:col-span-4 ">
                <label className="text-xs font-medium dark:text-gray-50 text-slate-600">
                  Priority
                </label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange('priority', value)}
                  placeholder="Select Priority"
                />
              </div>

              {/* Due Date */}
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium dark:text-gray-50 text-slate-600">
                  Due Date
                </label>
                <input
                  value={taskData.dueDate || ''}
                  onChange={({ target }) => handleValueChange('dueDate', target.value)}
                  type="date"
                  className="form-input dark:[color-scheme:light] dark:bg-gray-800 dark:text-gray-200 dark:[&::-webkit-calendar-picker-indicator]:invert dark:[&::-webkit-calendar-picker-indicator]:brightness-200"
                />
              </div>

              {/* Assign To */}
              <div className="col-span-12 md:col-span-4">
                <label className="text-xs font-medium dark:text-gray-50 text-slate-600">
                  Assign To
                </label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) => handleValueChange('assignedTo', value)}
                />
              </div>
            </div>

            {/* TODO Checklist */}
            <div className="mt-3">
              <label className="text-xs font-medium dark:text-gray-50 text-slate-600">
                TO DO Checklist
              </label>
              <TodoListInput
                todoList={taskData.todoChecklist}
                setTodoList={(value) => handleValueChange('todoChecklist', value)}
              />
            </div>

            {/* Attachments */}
            <div className="mt-3">
              <label className="text-xs dark:text-gray-50 font-medium text-slate-600">
                Add Attachments
              </label>
              <AddAttachmentsInput
                attachments={taskData.attachments}
                setAttachments={(value) => handleValueChange('attachments', value)}
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            <div className="flex justify-end mt-7">
              <button
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading
                  ? 'Saving...'
                  : taskId
                  ? 'UPDATE TASK'
                  : 'CREATE TASK'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert 
          content="Are you sure you want to delete this task?"
          onDelete={deleteTask}
          onCancel={() => setOpenDeleteAlert(false)}
        />
      </Modal>
    </DashboardLauout>
  );
};

export default CreateTask;