import * as v from "valibot";

export const EditSyllabusSchema = v.object({
  dayNumber: v.pipe(
    v.string(),
    v.nonEmpty("Day number is required"),
    v.regex(/^\d+$/, "Day number must be a valid number")
  ),
  title: v.pipe(
    v.string(),
    v.nonEmpty("Title is required"),
    v.minLength(3, "Title must be at least 3 characters")
  ),
  topics: v.pipe(
    v.string(),
    v.nonEmpty("Topics are required"),
    v.minLength(10, "Topics must be at least 10 characters")
  ),
  objectives: v.string(),
  practicalActivities: v.string(),
  assessmentCriteria: v.string(),
  notes: v.string(),
});

export type EditSyllabusForm = v.InferOutput<typeof EditSyllabusSchema>;
