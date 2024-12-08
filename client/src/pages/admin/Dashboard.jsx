import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    revenue: 0,
    sales: 0,
    courseData: [],
  });

  let totalRevenue;
  let totalSales;

  const getDashboardData = async () => {
    setIsLoading(true);
    const myData = await axios.get(
      `http://localhost:3000/api/payment/dashboard`,
      {
        withCredentials: true,
      }
    );
    setIsLoading(false);

    console.log(myData.data.purchasedCourse);
    const { purchasedCourse } = myData.data || [];
    console.log("pc", purchasedCourse);

    const courseData = purchasedCourse.map((course) => ({
      name: course.courseId.courseTitle,
      price: course.courseId.coursePrice,
    }));

    totalRevenue = purchasedCourse.reduce(
      (acc, element) => acc + (element.amount || 0),
      0
    );

    totalSales = purchasedCourse.length;

    setDashboardData({
      revenue: totalRevenue,
      sales: totalSales,
      courseData,
    });
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center my-40 justify-center">
        <Loader2 className="w-12 h-12 animate-spin" /> Laoding...
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">
            {dashboardData.sales || 1}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">
            {dashboardData.revenue || 199}
          </p>
        </CardContent>
      </Card>

      {/* Course Prices Card */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 ">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Course Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dashboardData.courseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                angle={-30} // Rotated labels for better visibility
                textAnchor="end"
                interval={0} // Display all labels
              />
              <YAxis stroke="#6b7280" />
              <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#4a90e2" // Changed color to a different shade of blue
                strokeWidth={3}
                dot={{ stroke: "#4a90e2", strokeWidth: 2 }} // Same color for the dot
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
