import React, { useContext, useEffect, useState } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import { UserContext } from '../../context/userContext';
import DashboardLauout from '../../components/layouts/DashboardLauout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import moment from 'moment';
import { addThousandsSeparator } from '../../utils/helper';
import InfoCard from '../../components/Cards/InfoCard';
import { LuArrowRight } from 'react-icons/lu';
import TaskListTable from '../../components/TaskListTable';
import CustomPieChart from '../../components/Charts/CustomPieChart';
import CustomBarChart from '../../components/Charts/CustomBarChart';

const COLORS = ['#8D51FF', '#00B8D8', '#7BCE00'];

const Dashboard = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || {};
    const taskPriorityLevels = data?.taskPriorityLevels || {};

    // Debug: Log taskDistribution to inspect API data
    console.log('taskDistribution:', taskDistribution);

    if (!taskDistribution || !taskPriorityLevels) {
      console.warn('Invalid chart data:', data);
      return;
    }

    const taskDistributionData = [
      { status: 'Pending', count: taskDistribution.Pending || 0 },
      { status: 'In Progress', count: taskDistribution['InProgress'] || taskDistribution['In Progress'] || 0 },
      { status: 'Completed', count: taskDistribution.Completed || 0 },
    ];

    const priorityLevelData = [
      { priority: 'Low', count: taskPriorityLevels.Low || 0 },
      { priority: 'Medium', count: taskPriorityLevels.Medium || 0 },
      { priority: 'High', count: taskPriorityLevels.High || 0 },
    ];
    

    setPieChartData(taskDistributionData);
    setBarChartData(priorityLevelData);
  };

  const getDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
      console.log('API Response:', response.data);
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || {});
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  useEffect(() => {
    console.log('pieChartData:', pieChartData);
    console.log('barChartData:', barChartData);
  }, [pieChartData, barChartData]);

  const onSeeMore = () => {
    navigate('/admin/tasks');
  };

  // Calculate total tasks as a fallback if 'All' is not provided
  const calculateTotalTasks = (taskDistribution) => {
    if (taskDistribution?.All) return taskDistribution.All;
    const total =
      (taskDistribution?.Pending || 0) +
      (taskDistribution?.InProgress || taskDistribution?.['In Progress'] || 0) +
      (taskDistribution?.Completed || 0);
    return total;
  };

  return (
    <DashboardLauout activeMenu="Dashboard">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <span className="text-gray-500">Loading...</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64 text-red-500 flex-col gap-4">
          <span>{error}</span>
          <button className="card-btn" onClick={getDashboardData}>
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="card my-5">
            <div className="col-span-3">
              <h2 className="text-xl md:text-2xl">
                Good Morning, {user?.name || 'User'}!
              </h2>
              <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
                {moment().format('dddd Do MMM YYYY')}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
              <InfoCard
                label="Total Tasks"
                value={addThousandsSeparator(
                  calculateTotalTasks(dashboardData?.charts?.taskDistribution) || 0
                )}
                color="bg-primary"
              />
              <InfoCard
                label="Pending Tasks"
                value={addThousandsSeparator(
                  dashboardData?.charts?.taskDistribution?.Pending || 0
                )}
                color="bg-violet-500"
              />
              <InfoCard
                label="In Progress Tasks"
                value={addThousandsSeparator(
                  dashboardData?.charts?.taskDistribution?.InProgress ||
                    dashboardData?.charts?.taskDistribution?.['In Progress'] ||
                    0
                )}
                color="bg-cyan-500"
              />
              <InfoCard
                label="Completed Tasks"
                value={addThousandsSeparator(
                  dashboardData?.charts?.taskDistribution?.Completed || 0
                )}
                color="bg-lime-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
            <div className="card" style={{ minHeight: '350px' }}>
              <div className="flex items-center justify-between">
                <h5 className="text-lg">Task Distribution</h5>
              </div>
              <CustomPieChart data={pieChartData} colors={COLORS} />
            </div>
            <div className="card" style={{ minHeight: '350px' }}>
              <div className="flex items-center justify-between">
                <h5 className="text-lg">Task Priority Levels</h5>
              </div>
              <CustomBarChart data={barChartData} />
            </div>
            <div className="md:col-span-2">
              <div className="card">
                <div className="flex items-center justify-between">
                  <h5 className="text-lg">Recent Tasks</h5>
                  <button
                    className="card-btn"
                    onClick={onSeeMore}
                    aria-label="View all tasks"
                  >
                    See All <LuArrowRight className="text-base" />
                  </button>
                </div>
                <TaskListTable tableData={dashboardData?.recentTasks || []} />
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLauout>
  );
};

export default Dashboard;