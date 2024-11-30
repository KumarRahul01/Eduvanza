import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import Sidebar from "./pages/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import CourseTable from "./pages/admin/Course/CourseTable";
import AddCourse from "./pages/admin/Course/AddCourse";

const App = () => {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/my-learning" element={<MyLearning />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Sidebar />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="course" element={<CourseTable />} />
            <Route path="course/create" element={<AddCourse />} />
          </Route>
        </Routes>
      </main>
    </>
  );
};

export default App;
