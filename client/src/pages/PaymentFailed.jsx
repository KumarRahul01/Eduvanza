import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react"; // Lucide React for icons

const PaymentFailed = () => {
  return (
    <div className=" flex flex-col items-center justify-center translate-y-[50%]">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-lg w-full">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
        <h1 className="text-2xl font-bold mt-4 text-gray-800">
          Payment Failed
        </h1>
        <p className="text-gray-600 mt-2">
          Oops! Something went wrong while processing your payment. Please try
          again later or contact support.
        </p>
        <div className="mt-6">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              window.location.href = "/checkout";
            }}
          >
            Retry Payment
          </Button>
        </div>
        <div className="mt-4">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              window.location.href = "/contact-support";
            }}
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
