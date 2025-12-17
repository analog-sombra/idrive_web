import * as v from "valibot";

export const EditCourseSchema = v.object({
  // Course ID (read-only, for display)
  courseId: v.optional(v.string()),

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
  automaticPrice: v.optional(
    v.pipe(
      v.string(),
      v.regex(/^[0-9]+(\.[0-9]+)?$/, "Automatic price must be a valid number")
    )
  ),

  // Enrollment
  enrolledStudents: v.optional(
    v.pipe(
      v.string(),
      v.regex(/^[0-9]+$/, "Enrolled students must be a number")
    )
  ),

  // Course Details
  description: v.pipe(
    v.string(),
    v.minLength(10, "Description must be at least 10 characters")
  ),
  syllabus: v.optional(v.string()),
  requirements: v.optional(v.string()),

  // Performance Metrics
  sessionsCompleted: v.optional(
    v.pipe(
      v.string(),
      v.regex(/^[0-9]+$/, "Sessions completed must be a number")
    )
  ),
  totalRevenue: v.optional(
    v.pipe(
      v.string(),
      v.regex(/^[0-9]+(\.[0-9]+)?$/, "Total revenue must be a valid number")
    )
  ),

  // Status
  status: v.optional(
    v.picklist(["ACTIVE", "INACTIVE", "UPCOMING", "ARCHIVED"])
  ),
});

export type EditCourseForm = v.InferOutput<typeof EditCourseSchema>;
