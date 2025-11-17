import * as v from "valibot";

export const AddCourseSchema = v.object({
  // Basic Information
  courseName: v.pipe(
    v.string(),
    v.minLength(3, "Course name must be at least 3 characters")
  ),
  courseType: v.pipe(v.string(), v.minLength(1, "Course type is required")),
  minsPerDay: v.pipe(
    v.string(),
    v.regex(/^[0-9]+$/, "Minutes per day must be a valid number")
  ),
  courseDays: v.pipe(
    v.string(),
    v.regex(/^[0-9]+$/, "Course days must be a number")
  ),
  price: v.pipe(
    v.string(),
    v.regex(/^[0-9]+(\.[0-9]+)?$/, "Price must be a valid number")
  ),

  // Course Details
  description: v.pipe(
    v.string(),
    v.minLength(10, "Description must be at least 10 characters")
  ),
  syllabus: v.optional(v.string()),
  requirements: v.optional(v.string()),
});

export type AddCourseForm = v.InferOutput<typeof AddCourseSchema>;
