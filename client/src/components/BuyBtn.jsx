import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const BuyBtn = ({ courseId }) => {
  const buyCourseId = courseId;
  console.log(buyCourseId);

  // { img, title, price }
  const navigate = useNavigate();

  return (
    <>
      <Button
        // img={img}
        // title={title}
        // price={price}
        onClick={() => navigate(`/course-detail/${buyCourseId}/checkout`)}
      >
        Buy Now
      </Button>
    </>
  );
};

export default BuyBtn;
