"use client";

import { FormProvider, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { onFormError } from "@/utils/methods";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { EditDriverForm, EditDriverSchema } from "@/schema/editdriver";
import { TextInput } from "@/components/form/inputfields/textinput";
import { DateInput } from "@/components/form/inputfields/dateinput";
import { Select } from "@/components/form/inputfields/select";
import { TaxtAreaInput } from "@/components/form/inputfields/textareainput";
import { Button, Card, Modal, Spin } from "antd";
import { IcBaselineArrowBack, AntDesignCheckOutlined } from "@/components/icons";
import { getDriverById, updateDriver } from "@/services/driver.api";
import { use, useEffect } from "react";
import dayjs from "dayjs";

const EditDriverPage = ({ params }: { params: Promise<{ driverId: string }> }) => {
  const router = useRouter();
  const { driverId } = use(params);
  const numericDriverId = parseInt(driverId);

  const methods = useForm<EditDriverForm>({
    resolver: valibotResolver(EditDriverSchema),
  });

  // Fetch existing driver data
  const { data: driverData, isLoading } = useQuery({
    queryKey: ["driver", numericDriverId],
    queryFn: async () => {
      const response = await getDriverById(numericDriverId);
      if (!response.status || !response.data.getDriverById) {
        throw new Error(response.message || "Failed to fetch driver");
      }
      return response.data.getDriverById;
    },
  });

  // Pre-fill form when data is loaded
  useEffect(() => {
    if (driverData) {
      methods.reset({
        name: driverData.name || "",
        email: driverData.email || "",
        mobile: driverData.mobile || "",
        alternatePhone: driverData.alternatePhone || "",
        dateOfBirth: driverData.dateOfBirth
          ? dayjs(driverData.dateOfBirth).format("YYYY-MM-DD")
          : "",
        bloodGroup: driverData.bloodGroup || "",
        gender: driverData.gender || "",
        address: driverData.address || "",
        licenseNumber: driverData.licenseNumber || "",
        licenseType: driverData.licenseType || "",
        licenseIssueDate: driverData.licenseIssueDate
          ? dayjs(driverData.licenseIssueDate).format("YYYY-MM-DD")
          : "",
        licenseExpiryDate: driverData.licenseExpiryDate
          ? dayjs(driverData.licenseExpiryDate).format("YYYY-MM-DD")
          : "",
        experience: driverData.experience?.toString() || "",
        joiningDate: driverData.joiningDate
          ? dayjs(driverData.joiningDate).format("YYYY-MM-DD")
          : "",
        salary: driverData.salary?.toString() || "",
        status: driverData.status || "ACTIVE",
        emergencyContactName: driverData.emergencyContactName || "",
        emergencyContactNumber: driverData.emergencyContactNumber || "",
        emergencyContactRelation: driverData.emergencyContactRelation || "",
      });
    }
  }, [driverData, methods]);

  const updateDriverMutation = useMutation({
    mutationKey: ["updateDriver", numericDriverId],
    mutationFn: async (data: EditDriverForm) => {
      const response = await updateDriver({
        id: numericDriverId,
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        alternatePhone: data.alternatePhone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        bloodGroup: data.bloodGroup,
        gender: data.gender,
        address: data.address,
        licenseNumber: data.licenseNumber,
        licenseType: data.licenseType,
        licenseIssueDate: data.licenseIssueDate ? new Date(data.licenseIssueDate) : undefined,
        licenseExpiryDate: data.licenseExpiryDate
          ? new Date(data.licenseExpiryDate)
          : undefined,
        experience: data.experience ? parseInt(data.experience) : undefined,
        joiningDate: data.joiningDate ? new Date(data.joiningDate) : undefined,
        salary: data.salary ? parseFloat(data.salary) : undefined,
        status: data.status as "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "SUSPENDED",
        emergencyContactName: data.emergencyContactName,
        emergencyContactNumber: data.emergencyContactNumber,
        emergencyContactRelation: data.emergencyContactRelation,
      });

      if (!response.status) {
        throw new Error(response.message || "Failed to update driver");
      }

      return response.data;
    },
    onSuccess: () => {
      toast.success("Driver updated successfully!");
      router.push(`/mtadmin/driver/${driverId}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update driver. Please try again.");
    },
  });

  const onSubmit = (data: EditDriverForm) => {
    Modal.confirm({
      title: "Confirm Driver Update",
      content: (
        <div>
          <p>
            <strong>Driver Name:</strong> {data.name}
          </p>
          <p>
            <strong>Email:</strong> {data.email}
          </p>
          <p>
            <strong>Mobile:</strong> {data.mobile}
          </p>
          <p>
            <strong>Status:</strong> {data.status}
          </p>
          <br />
          <p>Are you sure you want to update this driver?</p>
        </div>
      ),
      okText: "Yes, Update Driver",
      cancelText: "Cancel",
      onOk: () => {
        updateDriverMutation.mutate(data);
      },
      okButtonProps: {
        className: "!bg-green-600",
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4 mb-2">
            <Button
              icon={<IcBaselineArrowBack className="text-lg" />}
              onClick={() => router.push(`/mtadmin/driver/${driverId}`)}
              size="large"
            >
              Back to Driver Profile
            </Button>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Driver</h1>
            <p className="text-gray-600 mt-1 text-sm">
              Update driver information - ID: {driverId}
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 max-w-5xl">
        <Card className="shadow-sm">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit, onFormError)}>
              {/* Personal Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <TextInput<EditDriverForm>
                      name="name"
                      title="Full Name"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <TextInput<EditDriverForm>
                      name="email"
                      title="Email"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div>
                    <TextInput<EditDriverForm>
                      name="mobile"
                      title="Mobile Number"
                      placeholder="Enter 10-digit mobile number"
                      required
                      onlynumber
                      maxlength={10}
                    />
                  </div>
                  <div>
                    <TextInput<EditDriverForm>
                      name="alternatePhone"
                      title="Alternate Phone (Optional)"
                      placeholder="Enter 10-digit alternate number"
                      required={false}
                      onlynumber
                      maxlength={10}
                    />
                  </div>
                  <div>
                    <DateInput<EditDriverForm>
                      name="dateOfBirth"
                      title="Date of Birth"
                      placeholder="Select date of birth"
                      required
                    />
                  </div>
                  <div>
                    <Select<EditDriverForm>
                      name="bloodGroup"
                      title="Blood Group (Optional)"
                      placeholder="Select blood group"
                      required={false}
                      options={[
                        { label: "A+", value: "A+" },
                        { label: "A-", value: "A-" },
                        { label: "B+", value: "B+" },
                        { label: "B-", value: "B-" },
                        { label: "AB+", value: "AB+" },
                        { label: "AB-", value: "AB-" },
                        { label: "O+", value: "O+" },
                        { label: "O-", value: "O-" },
                      ]}
                    />
                  </div>
                  <div>
                    <Select<EditDriverForm>
                      name="gender"
                      title="Gender"
                      placeholder="Select gender"
                      required
                      options={[
                        { label: "Male", value: "Male" },
                        { label: "Female", value: "Female" },
                        { label: "Other", value: "Other" },
                      ]}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <TaxtAreaInput<EditDriverForm>
                      name="address"
                      title="Address"
                      placeholder="Enter complete address"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* License Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                  License Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <TextInput<EditDriverForm>
                      name="licenseNumber"
                      title="License Number"
                      placeholder="e.g., DL-0320190012345"
                      required
                    />
                  </div>
                  <div>
                    <Select<EditDriverForm>
                      name="licenseType"
                      title="License Type"
                      placeholder="Select license type"
                      required
                      options={[
                        { label: "LMV (Light Motor Vehicle)", value: "LMV" },
                        { label: "MCWG (Motorcycle with Gear)", value: "MCWG" },
                        { label: "MCWOG (Motorcycle without Gear)", value: "MCWOG" },
                        { label: "HMV (Heavy Motor Vehicle)", value: "HMV" },
                      ]}
                    />
                  </div>
                  <div>
                    <DateInput<EditDriverForm>
                      name="licenseIssueDate"
                      title="License Issue Date"
                      placeholder="Select issue date"
                      required
                    />
                  </div>
                  <div>
                    <DateInput<EditDriverForm>
                      name="licenseExpiryDate"
                      title="License Expiry Date"
                      placeholder="Select expiry date"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                  Professional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <TextInput<EditDriverForm>
                      name="experience"
                      title="Years of Experience (Optional)"
                      placeholder="e.g., 5"
                      required={false}
                      onlynumber
                    />
                  </div>
                  <div>
                    <DateInput<EditDriverForm>
                      name="joiningDate"
                      title="Joining Date (Optional)"
                      placeholder="Select joining date"
                      required={false}
                    />
                  </div>
                  <div>
                    <TextInput<EditDriverForm>
                      name="salary"
                      title="Salary (Optional)"
                      placeholder="e.g., 25000"
                      required={false}
                      onlynumber
                      numdes
                    />
                  </div>
                  <div>
                    <Select<EditDriverForm>
                      name="status"
                      title="Status"
                      placeholder="Select status"
                      required
                      options={[
                        { label: "Active", value: "ACTIVE" },
                        { label: "Inactive", value: "INACTIVE" },
                        { label: "On Leave", value: "ON_LEAVE" },
                        { label: "Suspended", value: "SUSPENDED" },
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                  Emergency Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <TextInput<EditDriverForm>
                      name="emergencyContactName"
                      title="Contact Name (Optional)"
                      placeholder="Enter contact name"
                      required={false}
                    />
                  </div>
                  <div>
                    <TextInput<EditDriverForm>
                      name="emergencyContactNumber"
                      title="Contact Number (Optional)"
                      placeholder="Enter 10-digit number"
                      required={false}
                      onlynumber
                      maxlength={10}
                    />
                  </div>
                  <div>
                    <Select<EditDriverForm>
                      name="emergencyContactRelation"
                      title="Relationship (Optional)"
                      placeholder="Select relationship"
                      required={false}
                      options={[
                        { label: "Father", value: "Father" },
                        { label: "Mother", value: "Mother" },
                        { label: "Spouse", value: "Spouse" },
                        { label: "Sibling", value: "Sibling" },
                        { label: "Friend", value: "Friend" },
                        { label: "Other", value: "Other" },
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                <Button
                  size="large"
                  onClick={() => router.push(`/mtadmin/driver/${driverId}`)}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={updateDriverMutation.isPending}
                  icon={<AntDesignCheckOutlined className="text-lg" />}
                  className="!bg-gradient-to-r from-green-600 to-teal-600"
                >
                  Update Driver
                </Button>
              </div>
            </form>
          </FormProvider>
        </Card>
      </div>
    </div>
  );
};

export default EditDriverPage;
