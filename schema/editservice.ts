import * as v from "valibot";

export const ServiceCategoryEnum = v.picklist(['NEW_LICENSE', 'I_HOLD_LICENSE', 'TRANSPORT', 'IDP']);
export const ServiceStatusEnum = v.picklist(['ACTIVE', 'INACTIVE', 'UPCOMING', 'DISCONTINUED']);

export const EditServiceSchema = v.object({
  // Basic Information
  serviceId: v.string(),
  serviceName: v.pipe(
    v.string(),
    v.minLength(3, "Service name must be at least 3 characters")
  ),
  category: v.pipe(
    ServiceCategoryEnum,
    v.nonEmpty("Category is required")
  ),
  duration: v.pipe(
    v.string(),
    v.regex(/^[0-9]+$/, "Duration must be a number")
  ),
  status: ServiceStatusEnum,

  // Service Details
  description: v.pipe(
    v.string(),
    v.minLength(10, "Description must be at least 10 characters")
  ),
  features: v.optional(v.array(v.string())),
  includedServices: v.optional(v.array(v.string())),
  requirements: v.optional(v.string()),
  termsAndConditions: v.optional(v.string()),
});

export type EditServiceForm = v.InferOutput<typeof EditServiceSchema>;
