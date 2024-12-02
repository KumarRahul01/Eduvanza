import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";

const Sidebar = ({ name }) => {
  return (
    <div className="flex">
      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700  p-5 sticky top-0  h-screen">
        <div className="space-y-4 ">
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              isActive
                ? "shadow-sm p-2 bg-slate-50 font-semibold border flex items-center gap-2 rounded-md transition-all duration-300 w-full"
                : "flex items-center gap-2 p-2"
            }
          >
            <ChartNoAxesColumn size={22} />
            <h1>Dashboard</h1>
          </NavLink>
          <NavLink
            to="course"
            className={({ isActive }) =>
              isActive
                ? "shadow-sm p-2 bg-slate-50 font-semibold border flex items-center gap-2 rounded-md transition-all duration-300 w-full"
                : "flex items-center gap-2 p-2"
            }
          >
            <SquareLibrary size={22} />
            <h1>Courses</h1>
          </NavLink>
        </div>
      </div>
      <div className="flex-1 p-10 ">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
