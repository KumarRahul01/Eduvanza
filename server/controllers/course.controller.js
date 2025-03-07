import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const handleCreateCourse = async (req, res) => {
  const userId = req.userId;
  try {
    const { courseTitle, category } = req.body;

    if (!courseTitle || !category) {
      return res.status(400).json({
        message: "Course title and category is required."
      })
    }
    const course = await Course.create({
      courseTitle,
      category,
      creator: userId
    });

    return res.status(201).json({
      course,
      message: "Course created."
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create course"
    })
  }
}

// export const handleSearchCourse = async (req, res) => {
//   try {
//     const { query = "", selectedCategories = [], sortByPrice = "" } = req.query;
//     console.log(query, selectedCategories, sortByPrice);

//     // create search query
//     const searchCriteria = {
//       isPublished: true,
//       $or: [
//         { courseTitle: { $regex: query, $options: "i" } },
//         { subTitle: { $regex: query, $options: "i" } },
//         { category: { $regex: query, $options: "i" } },
//       ]
//     }

//     // if categories selected
//     if (selectedCategories.length > 0) {
//       searchCriteria.category = { $in: selectedCategories };
//     }

//     // define sorting order
//     const sortOptions = {};
//     if (sortByPrice === "low") {
//       sortOptions.coursePrice = 1;//sort by price in ascending
//     } else if (sortByPrice === "high") {
//       sortOptions.coursePrice = -1; // descending
//     }

//     let courses = await Course.find(searchCriteria).populate({ path: "creator", select: "name photoUrl" }).sort(sortOptions);

//     return res.status(200).json({
//       success: true,
//       courses: courses || []
//     });

//   } catch (error) {
//     console.log(error);

//   }
// }


export const handleSearchCourse = async (req, res) => {
  try {
    // Extract and parse query parameters
    const {
      query = "",
      selectedCategories = "",
      sortByPrice = "",
    } = req.query;

    // Decode and parse selectedCategories into an array
    const categoriesArray =
      selectedCategories && typeof selectedCategories === "string"
        ? decodeURIComponent(selectedCategories).split(",")
        : [];

    // console.log("Search Query:", query);
    // console.log("Selected Categories:", categoriesArray);
    // console.log("Sort By Price:", sortByPrice);

    // Build search criteria
    const searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
      ],
    };

    // Add category filter if categories are selected
    if (categoriesArray.length > 0) {
      searchCriteria.category = { $in: categoriesArray };
    }

    // Define sorting options
    const sortOptions =
      sortByPrice === "low"
        ? { coursePrice: 1 } // Ascending
        : sortByPrice === "high"
          ? { coursePrice: -1 } // Descending
          : {};

    // Fetch courses from the database
    const courses = await Course.find(searchCriteria)
      .populate({ path: "creator", select: "name photoUrl" })
      .sort(sortOptions);

    // Respond with the fetched courses
    return res.status(200).json({
      success: true,
      courses: courses || [],
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching courses.",
    });
  }
};


export const handleGetPublishedCourse = async (_, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({ path: "creator", select: "fullname photoUrl" });
    if (!courses) {
      return res.status(404).json({
        message: "Course not found"
      })
    }
    return res.status(200).json({
      courses,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get published courses"
    })
  }
}

export const handleGetCreatorCourses = async (req, res) => {
  try {
    const userId = req.userId;

    const courses = await Course.find({ creator: userId });
    if (!courses || courses.length === 0) {
      return res.status(404).json({
        courses: [],
        message: "Course not found"
      })
    };
    return res.status(200).json({
      message: `Courses created by ${userId}`,
      courses,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get creator course"
    })
  }
}

export const handleGetCourseByCourseId = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    // console.log("MY courseID", courseId);


    let course = await Course.findById(courseId).populate({ path: "lectures" }).populate({ path: "creator" });

    if (!course) {
      return res.status(404).json({
        message: "Course not found!"
      })
    }

    return res.status(200).json({ course, message: "Course Get successfully.", coursePurchased: false })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch course"
    })
  }
}

export const handleEditCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
    const thumbnail = req.file;

    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found!"
      })
    }
    let courseThumbnail;
    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId); // delete old image
      }
      // upload a thumbnail on clourdinary
      courseThumbnail = await uploadMedia(thumbnail.path);
    }


    const updateData = { courseTitle, subTitle, description, category, courseLevel, coursePrice, courseThumbnail: courseThumbnail?.secure_url };

    course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

    return res.status(200).json({
      course,
      message: "Course updated successfully."
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create course",
    })
  }
}

export const handleRemoveCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findByIdAndDelete(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // cb function to delete associated lectures
    const deleteLectures = async (lectureId) => {
      const lecture = await Lecture.findByIdAndDelete(lectureId);

      if (!lecture) {
        console.log(`Lecture not found: ${lectureId}`);
        return;
      }

      // delete the lecture from couldinary as well
      if (lecture.publicId) {
        await deleteVideoFromCloudinary(lecture.publicId);
      }
    }

    if (course.lectures.length > 0) {
      for (const lectureId of course.lectures) {
        await deleteLectures(lectureId);
      }
    }

    // Final response
    return res.status(200).json({
      message: "Course and associated lectures deleted successfully!",
      course
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to remove course" })
  }
}

export const handleRemoveLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!"
      });
    }
    // delete the lecture from couldinary as well
    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }

    // Remove the lecture reference from the associated course
    await Course.updateOne(
      { lectures: lectureId }, // find the course that contains the lecture
      { $pull: { lectures: lectureId } } // Remove the lectures id from the lectures array
    );

    return res.status(200).json({
      message: "Lecture removed successfully."
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to remove lecture"
    })
  }
}

export const handleGetLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!"
      });
    }
    return res.status(200).json({
      lecture
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get lecture by id"
    })
  }
}

export const handleCreateLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;


    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        message: "Lecture title is required"
      })
    };


    // create lecture
    const lecture = await Lecture.create({ lectureTitle });

    const course = await Course.findById(courseId);
    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res.status(201).json({
      lecture,
      message: "Lecture created successfully."
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create lecture"
    })
  }
}

export const handleGetCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      })
    }
    return res.status(200).json({
      lectures: course.lectures
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get lectures"
    })
  }
}

export const handleEditLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;

    const { courseId, lectureId } = req.params;
    // console.log("courseId", courseId);
    // console.log("LectId", lectureId);

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!"
      })
    }

    // update lecture
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    // Ensure the course still has the lecture id if it was not aleardy added;
    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    };
    return res.status(200).json({
      lecture,
      message: "Lecture updated successfully."
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to edit lectures"
    })
  }
}


// publish unpublish course logic

export const handleTogglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query; // true, false


    // Find the course by ID
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }

    // Update publish status based on the query parameter
    course.isPublished = publish === "true"; // Convert to boolean
    const updatedCourse = await course.save();

    const statusMessage = course.isPublished ? "Published" : "Unpublished";
    return res.status(200).json({
      message: `Course is ${statusMessage}`,
      course: updatedCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to update status",
    });
  }
};
