/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { toast } from "sonner";

const BuyBtn = ({ isLoggedIn, data }) => {
  const navigate = useNavigate();

  localStorage.setItem(
    "transactionData",
    JSON.stringify({
      coursePrice: data.coursePrice,
      courseTitle: data.courseTitle,
      courseThumbnail: data.courseThumbnail,
    })
  );

  const clickHandler = () => {
    if (!isLoggedIn) {
      navigate("/login");
      toast.error("Please login first");
    } else {
      navigate(`/course-detail/${data._id}/checkout`);
      console.log(data);
    }
  };

  // { img, title, price }

  return (
    <div className="w-full flex flex-col gap-4">
      <Button
        // img={img}
        // title={title}
        // price={price}
        onClick={clickHandler}
      >
        Buy Now
      </Button>
      <div>
        <p className="text-xs text-center mb-[2px]">
          30-Day Money-Back Guarantee
        </p>
        <p className="text-xs text-center">Full Lifetime Access</p>
      </div>
    </div>
  );
};

export default BuyBtn;
