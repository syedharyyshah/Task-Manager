import React, { useEffect, useState, useCallback, useMemo } from 'react';
import DashboardLauout from '../../components/layouts/DashboardLauout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskStatusTabs from '../../components/TaskStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';
import { toast } from 'react-hot-toast';

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [statusSummary, setStatusSummary] = useState({
    all: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
  });
  const [filterStatus, setFilterStatus] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const tabs = useMemo(
    () => [
      { label: 'All', count: statusSummary.all },
      { label: 'Pending', count: statusSummary.pending },
      { label: 'In Progress', count: statusSummary.in_progress },
      { label: 'Completed', count: statusSummary.completed },
    ],
    [statusSummary]
  );

  const getAllTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === 'All' ? '' : filterStatus, // Send filterStatus as-is to match task.status
        },
      });

      // Debug: Log full API response
      console.log('Tasks API Response:', response.data);

      const apiTasks = response.data?.tasks || [];
      const apiStatusSummary = response.data?.statusSummary || {};

      // Debug: Log tasks with their status
      console.log(
        'Tasks with Status:',
        apiTasks.map((task) => ({ id: task._id, status: task.status }))
      );

      // Compute in_progress count from tasks as a fallback
      const computedInProgressCount = apiTasks.filter(
        (task) =>
          task.status === 'In Progress' ||
          task.status === 'in_progress' ||
          task.status === 'InProgress'
      ).length;

      // Normalize statusSummary keys
      const normalizedStatusSummary = {
        all: apiStatusSummary.all || apiTasks.length || 0,
        pending: apiStatusSummary.pending || apiStatusSummary.Pending || 0,
        in_progress:
          apiStatusSummary.in_progress ||
          apiStatusSummary['In Progress'] ||
          apiStatusSummary.InProgress ||
          apiStatusSummary.inProgress ||
          computedInProgressCount || // Fallback to computed count
          0,
        completed: apiStatusSummary.completed || apiStatusSummary.Completed || 0,
      };

      // Debug: Log computed and normalized values
      console.log('Computed In Progress Count:', computedInProgressCount);
      console.log('Normalized statusSummary:', normalizedStatusSummary);

      setAllTasks(apiTasks);
      setStatusSummary(normalizedStatusSummary);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    getAllTasks();
  }, [getAllTasks]);

  const handleClick = useCallback(
    (taskId) => {
      navigate(`/user/task-details/${taskId}`);
    },
    [navigate]
  );

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'task_details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Task report downloaded successfully.');
    } catch (error) {
      console.error('Error downloading task report:', error);
      toast.error('Failed to download task report. Please try again.');
    }
  };

  return (
    <DashboardLauout activeMenu="My Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-xl font-medium">Manage Tasks</h2>
           
          </div>

          {allTasks.length > 0 && (
            <div className="flex items-center gap-3">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
             
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading tasks...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {allTasks.length > 0 ? (
              allTasks.map((item) => (
                <TaskCard
                  key={item._id}
                  title={item.title}
                  description={item.description}
                  priority={item.priority}
                  status={item.status}
                  progress={item.progress}
                  createdAt={item.createdAt}
                  dueDate={item.dueDate}
                  assignedTo={item.assignedTo?.map((i) => i.profileImageUrl) || []}
                  attachmentCount={item.attachments?.length || 0}
                  completedTodoCount={item.completedTodoCount || 0}
                  todoChecklist={item.todoChecklist || []}
                  onClick={() => handleClick(item._id)}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-10 text-gray-500">
                No tasks found
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLauout>
  );
};

export default React.memo(MyTasks);