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
import EditCourse from "./pages/admin/Course/EditCourse";
import { AuthContext } from "./contexts/AuthContext";
import { useContext } from "react";
import CreateLecture from "./pages/admin/Lectures/createLecture";
import EditLecture from "./pages/admin/Lectures/EditLecture";
import CourseDetails from "./pages/student/courseDetails";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import Checkout from "./components/Checkout";
import CourseProgress from "./pages/student/CourseProgress";
import SearchPage from "./pages/student/SearchPage";
import SearchResult from "./pages/student/SearchResult";

const App = () => {
  const { userDetails } = useContext(AuthContext);

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
          <Route path="/course-detail/:courseId" element={<CourseDetails />} />
          <Route
            path="/course-detail/:courseId/checkout"
            element={<Checkout />}
          />
          <Route
            path="/course-progress/:courseId"
            element={<CourseProgress />}
          />
          <Route path="/course/search" element={<SearchPage />} />
          <Route
            path="/course-progress/:courseId/lecture/:lectureId/views"
            element={<CourseProgress />}
          />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={<Sidebar name={userDetails.fullname} />}
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="course" element={<CourseTable />} />
            <Route path="course/create" element={<AddCourse />} />
            <Route path="course/:courseId" element={<EditCourse />} />
            <Route
              path="course/:courseId/lecture"
              element={<CreateLecture />}
            />
            <Route
              path="course/:courseId/lecture/:lectureId"
              element={<EditLecture />}
            />
          </Route>
        </Routes>
      </main>
    </>
  );
};

export default App;
