import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import PrivateRoute from './routes/PrivateRoute';
import Dashboard from './pages/Admin/Dashboard';
import ManageTasks from './pages/Admin/ManageTasks';
import CreateTask from './pages/Admin/CreateTask';
import ManageUsers from './pages/Admin/ManageUsers';
import UserDashboard from './pages/User/UserDashboard';
import MyTasks from './pages/User/MyTasks';
import ViewTaskDetails from './pages/User/ViewTaskDetails';
import UserProvider, { UserContext } from './context/userContext';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Welcome from './components/Welcome';

const App = () => {
  return (
    <ThemeProvider>
    <UserProvider>
    <div>
     
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Welcome />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signUp' element={<SignUp />} />

          {/* Admin Protected Routes */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path='/admin/dashboard' element={<Dashboard />} />
            <Route path='/admin/tasks' element={<ManageTasks />} />
            <Route path='/admin/create-task' element={<CreateTask />} />
            <Route path='/admin/users' element={<ManageUsers />} />
          </Route>

          {/* User Protected Routes */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path='/user/dashboard' element={<UserDashboard />} />
            <Route path='/user/tasks' element={<MyTasks />} />
            <Route path='/user/task-details/:id' element={<ViewTaskDetails />} />
          </Route>

          {/* Default Rout  */}
          <Route path='/' element={<Root />}/>
        </Routes>
      </BrowserRouter>
    </div>

    <Toaster
    taostOptions={{
      className:"",
      style:{
        fontSize:"13px",
      },
    }}
     />
    </UserProvider>
    </ThemeProvider>
  );
};

export default App;

const Root = () => {
  const {user,loading} = useContext(UserContext);

  if(loading) return <Outlet/>

  if(!user){
    return <Navigate to="/login" />;
  }

  return user.role === "admin" ?  <Navigate to="/admin/dashboard" /> : <Navigate to="/user/dashboard" />; 

};
