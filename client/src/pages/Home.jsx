import Courses from "./student/Courses";
import Hero from "./student/Hero";

const Home = () => {
  return (
    <div className="w-10/12 mx-auto">
      <Hero />
      <Courses />
    </div>
  );
};

export default Home;
