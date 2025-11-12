"use client";

import { useState } from "react";
import { Card, Table, Input, Button, Tag, Space, Select, Avatar } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  AntDesignEyeOutlined,
  AntDesignEditOutlined,
  AntDesignPlusCircleOutlined,
  FluentMdl2Search,
  IcBaselineRefresh,
  MaterialSymbolsPersonRounded,
  IcBaselineCalendarMonth,
} from "@/components/icons";
import { useRouter } from "next/navigation";

const { Search } = Input;

interface DriverData {
  key: string;
  driverId: string;
  name: string;
  email: string;
  mobile: string;
  licenseNumber: string;
  experience: number;
  totalBookings: number;
  completedBookings: number;
  rating: number;
  status: "active" | "inactive" | "on-leave";
  joinedDate: string;
}

const DriverManagementPage = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Mock driver data
  const [drivers] = useState<DriverData[]>([
    {
      key: "1",
      driverId: "DRV-001",
      name: "Ramesh Kumar",
      email: "ramesh.kumar@idrive.com",
      mobile: "9876543210",
      licenseNumber: "DL-0320190012345",
      experience: 8,
      totalBookings: 245,
      completedBookings: 238,
      rating: 4.8,
      status: "active",
      joinedDate: "2023-01-15",
    },
    {
      key: "2",
      driverId: "DRV-002",
      name: "Suresh Sharma",
      email: "suresh.sharma@idrive.com",
      mobile: "9876543211",
      licenseNumber: "DL-0320190023456",
      experience: 10,
      totalBookings: 312,
      completedBookings: 305,
      rating: 4.9,
      status: "active",
      joinedDate: "2022-11-20",
    },
    {
      key: "3",
      driverId: "DRV-003",
      name: "Vikram Singh",
      email: "vikram.singh@idrive.com",
      mobile: "9876543212",
      licenseNumber: "DL-0320190034567",
      experience: 5,
      totalBookings: 156,
      completedBookings: 150,
      rating: 4.6,
      status: "on-leave",
      joinedDate: "2023-05-10",
    },
    {
      key: "4",
      driverId: "DRV-004",
      name: "Manoj Verma",
      email: "manoj.verma@idrive.com",
      mobile: "9876543213",
      licenseNumber: "DL-0320190045678",
      experience: 12,
      totalBookings: 420,
      completedBookings: 410,
      rating: 4.9,
      status: "active",
      joinedDate: "2022-08-05",
    },
    {
      key: "5",
      driverId: "DRV-005",
      name: "Rajiv Gupta",
      email: "rajiv.gupta@idrive.com",
      mobile: "9876543214",
      licenseNumber: "DL-0320190056789",
      experience: 3,
      totalBookings: 89,
      completedBookings: 85,
      rating: 4.5,
      status: "active",
      joinedDate: "2024-01-12",
    },
    {
      key: "6",
      driverId: "DRV-006",
      name: "Anil Kumar",
      email: "anil.kumar@idrive.com",
      mobile: "9876543215",
      licenseNumber: "DL-0320190067890",
      experience: 7,
      totalBookings: 198,
      completedBookings: 192,
      rating: 4.7,
      status: "inactive",
      joinedDate: "2023-03-22",
    },
    {
      key: "7",
      driverId: "DRV-007",
      name: "Deepak Rao",
      email: "deepak.rao@idrive.com",
      mobile: "9876543216",
      licenseNumber: "DL-0320190078901",
      experience: 6,
      totalBookings: 175,
      completedBookings: 170,
      rating: 4.6,
      status: "active",
      joinedDate: "2023-06-18",
    },
    {
      key: "8",
      driverId: "DRV-008",
      name: "Sanjay Patel",
      email: "sanjay.patel@idrive.com",
      mobile: "9876543217",
      licenseNumber: "DL-0320190089012",
      experience: 9,
      totalBookings: 278,
      completedBookings: 270,
      rating: 4.8,
      status: "active",
      joinedDate: "2022-12-10",
    },
    {
      key: "9",
      driverId: "DRV-009",
      name: "Prakash Reddy",
      email: "prakash.reddy@idrive.com",
      mobile: "9876543218",
      licenseNumber: "DL-0320190090123",
      experience: 4,
      totalBookings: 112,
      completedBookings: 108,
      rating: 4.5,
      status: "active",
      joinedDate: "2023-09-05",
    },
    {
      key: "10",
      driverId: "DRV-010",
      name: "Harish Nair",
      email: "harish.nair@idrive.com",
      mobile: "9876543219",
      licenseNumber: "DL-0320190101234",
      experience: 11,
      totalBookings: 356,
      completedBookings: 348,
      rating: 4.9,
      status: "active",
      joinedDate: "2022-10-15",
    },
    {
      key: "11",
      driverId: "DRV-011",
      name: "Kiran Kumar",
      email: "kiran.kumar@idrive.com",
      mobile: "9876543220",
      licenseNumber: "DL-0320190112345",
      experience: 2,
      totalBookings: 45,
      completedBookings: 42,
      rating: 4.3,
      status: "on-leave",
      joinedDate: "2024-03-20",
    },
    {
      key: "12",
      driverId: "DRV-012",
      name: "Mohan Das",
      email: "mohan.das@idrive.com",
      mobile: "9876543221",
      licenseNumber: "DL-0320190123456",
      experience: 15,
      totalBookings: 512,
      completedBookings: 500,
      rating: 5.0,
      status: "active",
      joinedDate: "2022-06-01",
    },
  ]);

  // Filter and search drivers
  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchText.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchText.toLowerCase()) ||
      driver.mobile.includes(searchText) ||
      driver.driverId.toLowerCase().includes(searchText.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || driver.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const columns: ColumnsType<DriverData> = [
    {
      title: "Driver ID",
      dataIndex: "driverId",
      key: "driverId",
      width: 120,
      sorter: (a, b) => a.driverId.localeCompare(b.driverId),
    },
    {
      title: "Driver Details",
      key: "driverDetails",
      width: 280,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={40}
            icon={<MaterialSymbolsPersonRounded />}
            className="bg-gradient-to-r from-green-600 to-teal-600 flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 truncate">
              {record.name}
            </div>
            <div className="text-xs text-gray-500 truncate">{record.email}</div>
            <div className="text-xs text-gray-600">{record.mobile}</div>
          </div>
        </div>
      ),
    },
    {
      title: "License Number",
      dataIndex: "licenseNumber",
      key: "licenseNumber",
      width: 180,
      render: (license) => (
        <span className="font-mono text-sm text-gray-700">{license}</span>
      ),
    },
    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
      width: 120,
      align: "center",
      sorter: (a, b) => a.experience - b.experience,
      render: (exp) => (
        <Tag color="purple" className="!text-sm !px-3 !py-1">
          {exp} {exp === 1 ? "Year" : "Years"}
        </Tag>
      ),
    },
    {
      title: "Total Bookings",
      dataIndex: "totalBookings",
      key: "totalBookings",
      width: 140,
      align: "center",
      sorter: (a, b) => a.totalBookings - b.totalBookings,
      render: (bookings) => (
        <div className="flex items-center justify-center gap-2">
          <IcBaselineCalendarMonth className="text-blue-600 text-lg" />
          <span className="font-medium">{bookings}</span>
        </div>
      ),
    },
    {
      title: "Completed",
      dataIndex: "completedBookings",
      key: "completedBookings",
      width: 120,
      align: "center",
      sorter: (a, b) => a.completedBookings - b.completedBookings,
      render: (completed) => (
        <span className="font-medium text-green-600">{completed}</span>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: 100,
      align: "center",
      sorter: (a, b) => a.rating - b.rating,
      render: (rating) => (
        <div className="flex items-center justify-center gap-1">
          <span className="text-yellow-500">⭐</span>
          <span className="font-semibold">{rating.toFixed(1)}</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status: "active" | "inactive" | "on-leave") => {
        const config = {
          active: { color: "green", text: "Active" },
          inactive: { color: "red", text: "Inactive" },
          "on-leave": { color: "orange", text: "On Leave" },
        };
        return (
          <Tag
            color={config[status].color}
            className="!text-sm !px-3 !py-1"
          >
            {config[status].text}
          </Tag>
        );
      },
    },
    {
      title: "Joined Date",
      dataIndex: "joinedDate",
      key: "joinedDate",
      width: 130,
      sorter: (a, b) => a.joinedDate.localeCompare(b.joinedDate),
      render: (date) => new Date(date).toLocaleDateString("en-IN"),
    },
    {
      title: "Action",
      key: "action",
      width: 180,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            icon={<AntDesignEyeOutlined />}
            onClick={() => router.push(`/mtadmin/driver/${record.driverId}`)}
          >
            View
          </Button>
          <Button
            type="primary"
            icon={<AntDesignEditOutlined />}
            onClick={() =>
              router.push(`/mtadmin/driver/${record.driverId}/edit`)
            }
            className="!bg-blue-600"
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const stats = {
    total: drivers.length,
    active: drivers.filter((d) => d.status === "active").length,
    inactive: drivers.filter((d) => d.status === "inactive").length,
    onLeave: drivers.filter((d) => d.status === "on-leave").length,
    avgRating: (
      drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length
    ).toFixed(1),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Driver Management
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                Manage and view all registered drivers
              </p>
            </div>
            <Space>
              <Button
                type="default"
                icon={<IcBaselineRefresh className="text-lg" />}
                size="large"
              >
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<AntDesignPlusCircleOutlined className="text-lg" />}
                size="large"
                onClick={() => router.push("/mtadmin/driver/add")}
                className="!bg-green-600"
              >
                Add New Driver
              </Button>
            </Space>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <MaterialSymbolsPersonRounded className="text-blue-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600 text-xs mb-1">Total Drivers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </Card>

          <Card className="shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                <MaterialSymbolsPersonRounded className="text-green-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600 text-xs mb-1">Active Drivers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.active}
                </p>
              </div>
            </div>
          </Card>

          <Card className="shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                <MaterialSymbolsPersonRounded className="text-orange-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600 text-xs mb-1">On Leave</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.onLeave}
                </p>
              </div>
            </div>
          </Card>

          <Card className="shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                <MaterialSymbolsPersonRounded className="text-red-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600 text-xs mb-1">Inactive Drivers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.inactive}
                </p>
              </div>
            </div>
          </Card>

          <Card className="shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <p className="text-gray-600 text-xs mb-1">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avgRating}
                </p>
              </div>
            </div>
          </Card>
        </div>
        <div></div>

        {/* Filters and Search */}
        <Card className="shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <Search
                placeholder="Search by name, email, mobile, license or driver ID..."
                allowClear
                size="large"
                prefix={<FluentMdl2Search className="text-gray-400" />}
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Space size="middle">
              <Select
                value={filterStatus}
                onChange={(value) => {
                  setFilterStatus(value);
                  setCurrentPage(1);
                }}
                style={{ width: 150 }}
                size="large"
                options={[
                  { label: "All Drivers", value: "all" },
                  { label: "Active", value: "active" },
                  { label: "On Leave", value: "on-leave" },
                  { label: "Inactive", value: "inactive" },
                ]}
              />
            </Space>
          </div>
        </Card>
        <div></div>

        {/* Drivers Table */}
        <Card className="shadow-sm">
          <Table
            columns={columns}
            dataSource={filteredDrivers}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: filteredDrivers.length,
              onChange: (page) => setCurrentPage(page),
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} drivers`,
              showSizeChanger: false,
            }}
            scroll={{ x: 1400 }}
            size="middle"
          />
        </Card>
      </div>
    </div>
  );
};

export default DriverManagementPage;
