"use client";

import { FormProvider, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { onFormError } from "@/utils/methods";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AddCourseForm, AddCourseSchema } from "@/schema/addcourse";
import { TextInput } from "@/components/form/inputfields/textinput";
import { Select } from "@/components/form/inputfields/select";
import { TaxtAreaInput } from "@/components/form/inputfields/textareainput";
import { Button, Card, Modal } from "antd";
import {
  Fa6SolidArrowLeftLong,
  AntDesignPlusCircleOutlined,
} from "@/components/icons";
import { getCookie } from "cookies-next";
import { createCourse } from "@/services/course.api";

const AddCoursePage = () => {
  const router = useRouter();
  const schoolId: number = parseInt(getCookie("school")?.toString() || "0");

  const methods = useForm<AddCourseForm>({
    resolver: valibotResolver(AddCourseSchema),
  });

  const createCourseMutation = useMutation({
    mutationKey: ["createCourse"],
    mutationFn: async (data: AddCourseForm) => {
      if (!schoolId) {
        throw new Error("School ID not found. Please login again.");
      }

      // Generate courseId: CRS-{schoolId}-{timestamp}
      const courseId = `CRS-${schoolId}-${Date.now()}`;

      // Create course
      const courseResponse = await createCourse({
        schoolId: schoolId,
        courseId: courseId,
        courseName: data.courseName,
        courseType: data.courseType as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "REFRESHER",
        hoursPerDay: parseInt(data.hoursPerDay),
        courseDays: parseInt(data.courseDays),
        price: parseFloat(data.price),
        description: data.description,
        syllabus: data.syllabus,
        requirements: data.requirements,
      });

      if (!courseResponse.status) {
        throw new Error(courseResponse.message || "Failed to create course");
      }

      return { course: courseResponse.data };
    },
    onSuccess: (response) => {
      if (response.course?.createCourse) {
        const course = response.course.createCourse;
        Modal.success({
          title: "Course Created Successfully!",
          content: (
            <div className="space-y-2">
              <p><strong>Course Name:</strong> {course.courseName}</p>
              <p><strong>Course Type:</strong> {course.courseType}</p>
              <p><strong>Hours Per Day:</strong> {course.hoursPerDay} min</p>
              <p><strong>Course Days:</strong> {course.courseDays} days</p>
              <p><strong>Price:</strong> ₹{course.price}</p>
            </div>
          ),
          onOk: () => router.push("/mtadmin/course"),
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create course. Please try again.");
    },
  });

  const onSubmit = (data: AddCourseForm) => {
    const hoursPerDay = parseInt(data.hoursPerDay);
    const courseDays = parseInt(data.courseDays);
    const durationInDays = Math.ceil((courseDays * hoursPerDay) / 60);
    
    Modal.confirm({
      title: "Confirm Course Creation",
      content: (
        <div>
          <p><strong>Course Name:</strong> {data.courseName}</p>
          <p><strong>Course Type:</strong> {data.courseType}</p>
          <p><strong>Hours Per Day:</strong> {hoursPerDay} minutes</p>
          <p><strong>Course Days:</strong> {courseDays} days</p>
          <p><strong>Total Duration:</strong> {durationInDays} days</p>
          <p><strong>Price:</strong> ₹{data.price}</p>
          <br />
          <p>Are you sure you want to create this course?</p>
        </div>
      ),
      okText: "Yes, Create Course",
      cancelText: "Cancel",
      onOk: () => {
        createCourseMutation.mutate(data);
      },
      okButtonProps: {
        className: "!bg-green-600",
      },
    });
  };

  const handleReset = () => {
    methods.reset();
    toast.info("Form reset");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={<Fa6SolidArrowLeftLong className="text-lg" />}
              size="large"
              onClick={() => router.push("/mtadmin/course")}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Course</h1>
              <p className="text-gray-600 mt-1 text-sm">
                Fill in the details to create a new course
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 max-w-5xl">
        <Card className="shadow-sm">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit, onFormError)}>
              {/* Basic Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <TextInput<AddCourseForm>
                      name="courseName"
                      title="Course Name"
                      placeholder="Enter course name"
                      required
                    />
                  </div>
                  <div>
                    <Select<AddCourseForm>
                      name="courseType"
                      title="Course Type"
                      placeholder="Select course type"
                      required
                      options={[
                        { label: "Beginner", value: "BEGINNER" },
                        { label: "Intermediate", value: "INTERMEDIATE" },
                        { label: "Advanced", value: "ADVANCED" },
                        { label: "Refresher", value: "REFRESHER" },
                      ]}
                    />
                  </div>
                  <div>
                    <Select<AddCourseForm>
                      name="hoursPerDay"
                      title="Hours Per Day"
                      placeholder="Select hours per day"
                      required
                      options={[
                        { label: "30 minutes", value: "30" },
                        { label: "60 minutes", value: "60" },
                      ]}
                    />
                  </div>
                  <div>
                    <TextInput<AddCourseForm>
                      name="courseDays"
                      title="Course Days"
                      placeholder="e.g., 30"
                      required
                      onlynumber
                    />
                  </div>
                  <div>
                    <TextInput<AddCourseForm>
                      name="price"
                      title="Price (₹)"
                      placeholder="e.g., 5000"
                      required
                      onlynumber
                      numdes
                    />
                  </div>
                </div>
              </div>

              {/* Course Details */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                  Course Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <TaxtAreaInput<AddCourseForm>
                      name="description"
                      title="Description"
                      placeholder="Enter detailed course description"
                      required
                    />
                  </div>
                  <div>
                    <TaxtAreaInput<AddCourseForm>
                      name="syllabus"
                      title="Syllabus (Optional)"
                      placeholder="Enter course syllabus (topics covered, modules, etc.)"
                      required={false}
                    />
                  </div>
                  <div>
                    <TaxtAreaInput<AddCourseForm>
                      name="requirements"
                      title="Requirements (Optional)"
                      placeholder="Enter course requirements (prerequisites, materials needed, etc.)"
                      required={false}
                    />
                  </div>
                </div>
              </div>

            {/* Information Note */}
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <span className="text-lg">ℹ️</span>
                Important Information
              </h4>
              <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
                <li>
                  Course ID will be generated automatically based on your school
                </li>
                <li>
                  The course will be created with ACTIVE status by default
                </li>
                <li>
                  You can edit course details and update status later from the course list
                </li>
              </ul>
            </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                <Button size="large" onClick={handleReset}>
                  Reset
                </Button>
                <Button
                  size="large"
                  onClick={() => router.push("/mtadmin/course")}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={createCourseMutation.isPending}
                  icon={<AntDesignPlusCircleOutlined className="text-lg" />}
                  className="!bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Add Course
                </Button>
              </div>
            </form>
          </FormProvider>
        </Card>
      </div>
    </div>
  );
};

export default AddCoursePage;
