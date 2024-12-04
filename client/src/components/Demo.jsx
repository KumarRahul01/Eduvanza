import axios from "axios";
import { Button } from "./ui/button";
// import { toast } from "sonner";

const Demo = () => {
  let data = {
    name: "Rahul",
    amount: 100,
    number: "1234567890",
    MID: "MID" + Date.now(),
    transactionId: "TID" + Date.now(),
  };

  const paymentHandler = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/payment/order",
        data,
        {
          withCredentials: true,
        }
      );
      console.log(res);

      if (res.data.success === true) {
        window.location.href =
          res.data.data.instrumentResponse.redirectInfo.url;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return <Button onClick={paymentHandler}>Pay Now</Button>;
};

export default Demo;
