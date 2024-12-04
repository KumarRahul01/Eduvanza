import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const courseId = "674ed29ac8cfab4b0c5d517b";

  return (
    <div className="flex flex-col items-center justify-center translate-y-[50%]">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-lg w-full">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold mt-4 text-gray-800">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mt-2">
          Your payment has been processed successfully. Thank you for your
          purchase!
        </p>
        <div className="mt-6">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => navigate(`/course-detail/${courseId}`)}
          >
            Continue Course
          </Button>
        </div>
        <div className="mt-4">
          {/* <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              window.location.href = "/orders";
            }}
          >
            View My Orders
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
