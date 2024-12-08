import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };
  return (
    <div className="w-full h-fit my-2 bg-gradient-to-r text-slate-100 dark:from-slate-900 dark:to-slate-700 from-violet-400 to-indigo-600">
      <div className="flex flex-col items-center justify-center md:p-20 p-5">
        <div className="text-center">
          <h1 className="text-3xl font-bold secFont mb-3">
            All the skills you need in one place
          </h1>
          <p className="font-sans text-lg">
            From critical skills to technical topics, Udemy supports your
            professional development.
          </p>
        </div>
        {/* form */}
        <div className="md:my-10 my-8 md:w-8/12 w-full mx-auto">
          <form
            onSubmit={searchHandler}
            action=""
            className="
          flex items-center relative"
          >
            <input
              className="w-full h-10 rounded-full px-4 outline-none text-gray-800"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Courses Here"
            />
            <div className="absolute -right-2">
              <Button
                type="submit "
                className="rounded-r-full h-11 dark:bg-black dark:hover:bg-gray-900 dark:text-slate-100"
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Explore Btn */}
        <div className="mb-6 md:mb-0">
          <Button
            className="rounded-2xl dark:bg-black dark:hover:bg-gray-900 dark:text-slate-100"
            onClick={() => navigate(`/course/search?query`)}
          >
            Explore Courses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
