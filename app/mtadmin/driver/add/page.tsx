"use client";

import { useState } from "react";
import { Card, Form, Input, Button, Select, DatePicker, Upload, message, InputNumber } from "antd";
import {
  IcBaselineArrowBack,
  AntDesignCheckOutlined,
  AntDesignPlusCircleOutlined,
} from "@/components/icons";
import { useRouter } from "next/navigation";
import type { UploadFile } from "antd";
import type { Dayjs } from "dayjs";

const { TextArea } = Input;

interface DriverFormValues {
  name: string;
  email: string;
  mobile: string;
  dateOfBirth: Dayjs;
  bloodGroup: string;
  gender: string;
  address: string;
  licenseNumber: string;
  licenseIssueDate: Dayjs;
  licenseExpiryDate: Dayjs;
  licenseType: string;
  experience: number;
  joiningDate: Dayjs;
  salary: number;
  status: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyContactRelation: string;
}

const AddDriverPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<UploadFile[]>([]);
  const [licenseImage, setLicenseImage] = useState<UploadFile[]>([]);

  const handleSubmit = async (values: DriverFormValues) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form values:", values);
      message.success("Driver added successfully!");
      router.push("/mtadmin/driver");
    } catch {
      message.error("Failed to add driver. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4 mb-2">
            <Button
              icon={<IcBaselineArrowBack className="text-lg" />}
              onClick={() => router.push("/mtadmin/driver")}
              size="large"
            >
              Back to Drivers
            </Button>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Driver</h1>
            <p className="text-gray-600 mt-1 text-sm">
              Fill in the details to register a new driver
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <Card className="shadow-sm max-w-4xl mx-auto">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            {/* Personal Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please enter driver name" },
                    {
                      min: 3,
                      message: "Name must be at least 3 characters",
                    },
                  ]}
                >
                  <Input size="large" placeholder="Enter full name" />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter email" },
                    { type: "email", message: "Please enter valid email" },
                  ]}
                >
                  <Input size="large" placeholder="Enter email address" />
                </Form.Item>

                <Form.Item
                  label="Mobile Number"
                  name="mobile"
                  rules={[
                    { required: true, message: "Please enter mobile number" },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Please enter valid 10-digit mobile number",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                  />
                </Form.Item>

                <Form.Item
                  label="Date of Birth"
                  name="dateOfBirth"
                  rules={[
                    { required: true, message: "Please select date of birth" },
                  ]}
                >
                  <DatePicker
                    size="large"
                    className="w-full"
                    placeholder="Select date of birth"
                    format="DD/MM/YYYY"
                  />
                </Form.Item>

                <Form.Item
                  label="Blood Group"
                  name="bloodGroup"
                  rules={[
                    { required: true, message: "Please select blood group" },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="Select blood group"
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
                </Form.Item>

                <Form.Item
                  label="Gender"
                  name="gender"
                  rules={[{ required: true, message: "Please select gender" }]}
                >
                  <Select
                    size="large"
                    placeholder="Select gender"
                    options={[
                      { label: "Male", value: "male" },
                      { label: "Female", value: "female" },
                      { label: "Other", value: "other" },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label="Address"
                  name="address"
                  className="md:col-span-2"
                  rules={[{ required: true, message: "Please enter address" }]}
                >
                  <TextArea
                    rows={3}
                    placeholder="Enter complete address"
                  />
                </Form.Item>
              </div>
            </div>

            {/* License Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                License Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label="License Number"
                  name="licenseNumber"
                  rules={[
                    { required: true, message: "Please enter license number" },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Enter license number (e.g., DL-0320190012345)"
                  />
                </Form.Item>

                <Form.Item
                  label="License Issue Date"
                  name="licenseIssueDate"
                  rules={[
                    {
                      required: true,
                      message: "Please select license issue date",
                    },
                  ]}
                >
                  <DatePicker
                    size="large"
                    className="w-full"
                    placeholder="Select issue date"
                    format="DD/MM/YYYY"
                  />
                </Form.Item>

                <Form.Item
                  label="License Expiry Date"
                  name="licenseExpiryDate"
                  rules={[
                    {
                      required: true,
                      message: "Please select license expiry date",
                    },
                  ]}
                >
                  <DatePicker
                    size="large"
                    className="w-full"
                    placeholder="Select expiry date"
                    format="DD/MM/YYYY"
                  />
                </Form.Item>

                <Form.Item
                  label="License Type"
                  name="licenseType"
                  rules={[
                    { required: true, message: "Please select license type" },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="Select license type"
                    options={[
                      { label: "LMV (Light Motor Vehicle)", value: "LMV" },
                      { label: "MCWG (Motorcycle with Gear)", value: "MCWG" },
                      { label: "MCWOG (Motorcycle without Gear)", value: "MCWOG" },
                      { label: "HMV (Heavy Motor Vehicle)", value: "HMV" },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label="Upload License Copy"
                  name="licenseUpload"
                  className="md:col-span-2"
                >
                  <Upload
                    listType="picture"
                    fileList={licenseImage}
                    onChange={({ fileList }) => setLicenseImage(fileList)}
                    beforeUpload={() => false}
                    maxCount={1}
                  >
                    <Button icon={<AntDesignPlusCircleOutlined />} size="large">
                      Upload License Image
                    </Button>
                  </Upload>
                </Form.Item>
              </div>
            </div>

            {/* Professional Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label="Years of Experience"
                  name="experience"
                  rules={[
                    { required: true, message: "Please enter experience" },
                  ]}
                >
                  <InputNumber
                    size="large"
                    className="w-full"
                    min={0}
                    max={50}
                    placeholder="Enter years of experience"
                  />
                </Form.Item>

                <Form.Item
                  label="Joining Date"
                  name="joiningDate"
                  rules={[
                    { required: true, message: "Please select joining date" },
                  ]}
                >
                  <DatePicker
                    size="large"
                    className="w-full"
                    placeholder="Select joining date"
                    format="DD/MM/YYYY"
                  />
                </Form.Item>

                <Form.Item
                  label="Salary"
                  name="salary"
                  rules={[{ required: true, message: "Please enter salary" }]}
                >
                  <InputNumber
                    size="large"
                    className="w-full"
                    prefix="₹"
                    min={0}
                    placeholder="Enter monthly salary"
                  />
                </Form.Item>

                <Form.Item
                  label="Status"
                  name="status"
                  rules={[{ required: true, message: "Please select status" }]}
                  initialValue="active"
                >
                  <Select
                    size="large"
                    placeholder="Select status"
                    options={[
                      { label: "Active", value: "active" },
                      { label: "Inactive", value: "inactive" },
                      { label: "On Leave", value: "on-leave" },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label="Upload Profile Photo"
                  name="profilePhoto"
                  className="md:col-span-2"
                >
                  <Upload
                    listType="picture-card"
                    fileList={profileImage}
                    onChange={({ fileList }) => setProfileImage(fileList)}
                    beforeUpload={() => false}
                    maxCount={1}
                  >
                    {profileImage.length === 0 && (
                      <div>
                        <AntDesignPlusCircleOutlined className="text-2xl" />
                        <div className="mt-2">Upload Photo</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label="Emergency Contact Name"
                  name="emergencyContactName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter emergency contact name",
                    },
                  ]}
                >
                  <Input size="large" placeholder="Enter contact name" />
                </Form.Item>

                <Form.Item
                  label="Emergency Contact Number"
                  name="emergencyContactNumber"
                  rules={[
                    {
                      required: true,
                      message: "Please enter emergency contact number",
                    },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Please enter valid 10-digit mobile number",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                  />
                </Form.Item>

                <Form.Item
                  label="Relationship"
                  name="emergencyContactRelation"
                  rules={[
                    { required: true, message: "Please enter relationship" },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="Select relationship"
                    options={[
                      { label: "Father", value: "father" },
                      { label: "Mother", value: "mother" },
                      { label: "Spouse", value: "spouse" },
                      { label: "Sibling", value: "sibling" },
                      { label: "Friend", value: "friend" },
                      { label: "Other", value: "other" },
                    ]}
                  />
                </Form.Item>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="default"
                size="large"
                onClick={() => router.push("/mtadmin/driver")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                icon={<AntDesignCheckOutlined />}
                className="flex-1 !bg-green-600"
              >
                Add Driver
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddDriverPage;
