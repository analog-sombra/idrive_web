import * as v from "valibot";

export const EditSchoolServiceSchema = v.object({
  serviceId: v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((val) => String(val)),
    v.nonEmpty("Service is required")
  ),
  licensePrice: v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((val) => String(val)),
    v.regex(/^\d+(\.\d+)?$/, "License price must be a valid number")
  ),
  addonPrice: v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((val) => String(val)),
    v.regex(/^\d+(\.\d+)?$/, "Addon price must be a valid number")
  ),
  status: v.pipe(v.string(), v.minLength(1, "Status is required")),
});

export type EditSchoolServiceForm = v.InferInput<
  typeof EditSchoolServiceSchema
>;
