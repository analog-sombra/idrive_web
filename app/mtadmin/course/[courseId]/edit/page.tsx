"use client";

import { use, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { onFormError } from "@/utils/methods";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { EditCourseForm, EditCourseSchema } from "@/schema/editcourse";
import { TextInput } from "@/components/form/inputfields/textinput";
import { MultiSelect } from "@/components/form/inputfields/multiselect";
import { TaxtAreaInput } from "@/components/form/inputfields/textareainput";
import { Button, Card, Modal, Spin } from "antd";
import {
  Fa6SolidArrowLeftLong,
  AntDesignCheckOutlined,
} from "@/components/icons";
import { updateCourse, getCourseById } from "@/services/course.api";

const EditCoursePage = ({ params }: { params: Promise<{ courseId: string }> }) => {
  const router = useRouter();
  const { courseId: courseIdStr } = use(params);
  const courseId = parseInt(courseIdStr);

  const methods = useForm<EditCourseForm>({
    resolver: valibotResolver(EditCourseSchema),
  });

  const { data: courseResponse, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId,
  });

  const courseData = courseResponse?.data?.getCourseById;

  useEffect(() => {
    if (courseData) {
      methods.reset({
        courseId: courseData.courseId,
        courseName: courseData.courseName,
        courseType: courseData.courseType,
        minsPerDay: courseData.minsPerDay.toString(),
        courseDays: courseData.courseDays.toString(),
        price: courseData.price.toString(),
        description: courseData.description,
        syllabus: courseData.syllabus || "",
        requirements: courseData.requirements || "",
        enrolledStudents: courseData.enrolledStudents?.toString() || "",
        sessionsCompleted: courseData.sessionsCompleted?.toString() || "",
        totalRevenue: courseData.totalRevenue?.toString() || "",
        status: courseData.status,
      });
    }
  }, [courseData, methods]);

  const updateCourseMutation = useMutation({
    mutationKey: ["updateCourse"],
    mutationFn: async (data: EditCourseForm) => {
      const courseResponse = await updateCourse({
        id: courseId,
        courseName: data.courseName,
        courseType: data.courseType as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "REFRESHER",
        minsPerDay: parseInt(data.minsPerDay),
        courseDays: parseInt(data.courseDays),
        price: parseFloat(data.price),
        description: data.description,
        syllabus: data.syllabus,
        requirements: data.requirements,
        enrolledStudents: data.enrolledStudents ? parseInt(data.enrolledStudents) : undefined,
        sessionsCompleted: data.sessionsCompleted ? parseInt(data.sessionsCompleted) : undefined,
        totalRevenue: data.totalRevenue ? parseFloat(data.totalRevenue) : undefined,
        status: data.status as "ACTIVE" | "INACTIVE" | "UPCOMING" | "ARCHIVED",
      });

      if (!courseResponse.status) {
        throw new Error(courseResponse.message || "Failed to update course");
      }

      return { course: courseResponse.data };
    },
    onSuccess: (response) => {
      if (response.course?.updateCourse) {
        const course = response.course.updateCourse;
        Modal.success({
          title: "Course Updated Successfully!",
          content: (
            <div className="space-y-2">
              <p><strong>Course Name:</strong> {course.courseName}</p>
              <p><strong>Status:</strong> {course.status}</p>
            </div>
          ),
          onOk: () => router.push(`/mtadmin/course/${courseId}`),
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update course. Please try again.");
    },
  });

  const onSubmit = (data: EditCourseForm) => {
    Modal.confirm({
      title: "Confirm Course Update",
      content: (
        <div>
          <p><strong>Course Name:</strong> {data.courseName}</p>
          <p><strong>Course Type:</strong> {data.courseType}</p>
          <p><strong>Status:</strong> {data.status}</p>
          <br />
          <p>Are you sure you want to update this course?</p>
        </div>
      ),
      okText: "Yes, Update Course",
      cancelText: "Cancel",
      onOk: () => {
        updateCourseMutation.mutate(data);
      },
      okButtonProps: {
        className: "!bg-blue-600",
      },
    });
  };

  const handleReset = () => {
    if (courseData) {
      methods.reset({
        courseId: courseData.courseId,
        courseName: courseData.courseName,
        courseType: courseData.courseType,
        minsPerDay: courseData.minsPerDay.toString(),
        courseDays: courseData.courseDays.toString(),
        price: courseData.price.toString(),
        description: courseData.description,
        syllabus: courseData.syllabus || "",
        requirements: courseData.requirements || "",
        enrolledStudents: courseData.enrolledStudents?.toString() || "",
        sessionsCompleted: courseData.sessionsCompleted?.toString() || "",
        totalRevenue: courseData.totalRevenue?.toString() || "",
        status: courseData.status,
      });
    }
    toast.info("Form reset to original values");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center">
          <h2 className="text-xl text-gray-600">Course not found</h2>
          <Button 
            type="primary" 
            className="mt-4"
            onClick={() => router.push("/mtadmin/course")}
          >
            Back to Courses
          </Button>
        </Card>
      </div>
    );
  }

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
              onClick={() => router.push(`/mtadmin/course/${courseId}`)}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
              <p className="text-gray-600 mt-1 text-sm">
                Update course details - {courseData?.courseId}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <TextInput<EditCourseForm>
                      name="courseId"
                      title="Course ID (Auto-generated)"
                      placeholder="Course ID"
                      required={false}
                      disable
                    />
                  </div>
                  <div>
                    <TextInput<EditCourseForm>
                      name="courseName"
                      title="Course Name"
                      placeholder="Enter course name"
                      required
                    />
                  </div>
                  <div>
                    <MultiSelect<EditCourseForm>
                      name="courseType"
                      title="Course Type"
                      placeholder="Select course type"
                      required={true}
                      options={[
                        { label: "Beginner", value: "BEGINNER" },
                        { label: "Intermediate", value: "INTERMEDIATE" },
                        { label: "Advanced", value: "ADVANCED" },
                        { label: "Refresher", value: "REFRESHER" },
                      ]}
                    />
                  </div>
                  <div>
                    <MultiSelect<EditCourseForm>
                      name="status"
                      title="Status"
                      placeholder="Select status"
                      required={false}
                      options={[
                        { label: "Active", value: "ACTIVE" },
                        { label: "Inactive", value: "INACTIVE" },
                        { label: "Upcoming", value: "UPCOMING" },
                        { label: "Archived", value: "ARCHIVED" },
                      ]}
                    />
                  </div>
                  <div>
                    <MultiSelect<EditCourseForm>
                      name="minsPerDay"
                      title="Hours Per Day"
                      placeholder="Select hours per day"
                      required={true}
                      options={[
                        { label: "30 minutes", value: "30" },
                        { label: "60 minutes", value: "60" },
                      ]}
                    />
                  </div>
                  <div>
                    <TextInput<EditCourseForm>
                      name="courseDays"
                      title="Course Days"
                      placeholder="e.g., 30"
                      required
                      onlynumber
                    />
                  </div>
                  <div>
                    <TextInput<EditCourseForm>
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

              {/* Progress Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                  Progress Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <TextInput<EditCourseForm>
                      name="enrolledStudents"
                      title="Enrolled Students"
                      placeholder="e.g., 25"
                      required={false}
                      onlynumber
                    />
                  </div>
                  <div>
                    <TextInput<EditCourseForm>
                      name="sessionsCompleted"
                      title="Sessions Completed"
                      placeholder="e.g., 10"
                      required={false}
                      onlynumber
                    />
                  </div>
                  <div>
                    <TextInput<EditCourseForm>
                      name="totalRevenue"
                      title="Total Revenue (₹)"
                      placeholder="e.g., 125000"
                      required={false}
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
                    <TaxtAreaInput<EditCourseForm>
                      name="description"
                      title="Description"
                      placeholder="Enter detailed course description"
                      required
                    />
                  </div>
                  <div>
                    <TaxtAreaInput<EditCourseForm>
                      name="syllabus"
                      title="Syllabus (Optional)"
                      placeholder="Enter course syllabus (topics covered, modules, etc.)"
                      required={false}
                    />
                  </div>
                  <div>
                    <TaxtAreaInput<EditCourseForm>
                      name="requirements"
                      title="Requirements (Optional)"
                      placeholder="Enter course requirements (prerequisites, materials needed, etc.)"
                      required={false}
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                <Button size="large" onClick={handleReset}>
                  Reset
                </Button>
                <Button
                  size="large"
                  onClick={() => router.push(`/mtadmin/course/${courseId}`)}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={updateCourseMutation.isPending}
                  icon={<AntDesignCheckOutlined />}
                  className="!bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Update Course
                </Button>
              </div>
            </form>
          </FormProvider>
        </Card>
      </div>
    </div>
  );
};

export default EditCoursePage;
