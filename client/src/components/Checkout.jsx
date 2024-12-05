import { ShoppingCart } from "lucide-react"; // Lucide React for icons
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("formdata", formData);
  };

  const params = useParams();
  const { courseId } = params;

  const priceString = localStorage.getItem("price");
  const price = priceString ? JSON.parse(priceString) : null;
  if (!price) {
    navigate("/payment-failed");
  }

  useEffect(() => {
    console.log("logged");
  }, [price]);

  let data = {
    name: formData.name,
    email: formData.email,
    amount: price || 499,
    phone: formData.phone,
    courseId: courseId,
    MID: "MID" + Date.now(),
    transactionId: "TID" + Date.now(),
  };

  const paymentHandler = async () => {
    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.phone === ""
    ) {
      toast.error("All fields are required");
    } else {
      localStorage.removeItem("price");
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-lg">
        {/* Course Card */}
        <CourseCard
          image="https://via.placeholder.com/150"
          title="React for Beginners"
          price={price}
        />

        {/* Checkout Form */}
        <form
          className="bg-white shadow-md rounded-lg mt-6 p-6"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Enter Your Details
          </h2>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <Label htmlFor="name">
                Name <span className="text-red-600">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">
                Email <span className="text-red-600">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Your email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2"
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">
                Phone <span className="text-red-600">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Your phone number"
                value={formData.phone}
                onChange={handleChange}
                className="mt-2"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="outline"
            className="mt-6 w-full flex items-center justify-center bg-gray-100"
            onClick={paymentHandler}
          >
            <ShoppingCart className="mr-2 h-5 w-5 " />
            Proceed to Pay
          </Button>
        </form>
      </div>
    </div>
  );
};

const CourseCard = ({ image, title, price }) => {
  // { image, title, price }
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
      <img
        src={image}
        alt={title}
        className="w-20 h-20 object-cover rounded-md"
      />
      <div>
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600 mt-1">
          <span className="text-lg secFont mr-[2px]">₹</span>
          {price}
        </p>
      </div>
    </div>
  );
};

export default Checkout;
