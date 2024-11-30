import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="flex items-center justify-normal gap-10">
      <Card className="w-60 h-20 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="-my-2">Total Sales</CardTitle>
        </CardHeader>
        <CardContent className="-my-4">
          <p className="md:text-lg py-2 font-bold text-blue-600">totalSales</p>
        </CardContent>
      </Card>

      <Card className="w-60 h-20 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="-my-2">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent className="-my-4">
          <p className="md:text-lg py-2 font-bold text-blue-600">
            totalRevenue
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
