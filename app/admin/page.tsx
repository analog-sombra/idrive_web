"use client";

import { Card, Row, Col, Statistic, Table, Tag, Button, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  IcBaselineRefresh,
  AntDesignEyeOutlined,
  AntDesignPlusCircleOutlined,
  AntDesignEditOutlined,
} from "@/components/icons";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  getSchoolStatistics,
  getAllSchoolsWithCounts,
  type SchoolWithCounts,
} from "@/services/school.api";
import dayjs from "dayjs";

const AdminDashboard = () => {
  const router = useRouter();

  // Fetch statistics
  const {
    data: statsResponse,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["schoolStatistics"],
    queryFn: getSchoolStatistics,
  });

  const stats = statsResponse?.data?.getSchoolStatistics;

  // Fetch schools with counts
  const {
    data: schoolsResponse,
    isLoading: schoolsLoading,
    refetch: refetchSchools,
  } = useQuery({
    queryKey: ["schoolsWithCounts"],
    queryFn: getAllSchoolsWithCounts,
  });

  const schools: SchoolWithCounts[] =
    schoolsResponse?.data?.getAllSchoolWithCounts || [];

  const handleRefresh = () => {
    refetchStats();
    refetchSchools();
  };

  const columns: ColumnsType<SchoolWithCounts> = [
    {
      title: "School ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id) => `SCH-${String(id).padStart(3, "0")}`,
    },
    {
      title: "School Name",
      dataIndex: "name",
      key: "name",
      width: 280,
      render: (text, record) => (
        <div>
          <div className="font-semibold text-gray-900">{text}</div>
          <div className="text-xs text-gray-500">{record.address}</div>
        </div>
      ),
    },
    {
      title: "Contact",
      key: "contact",
      width: 200,
      render: (_, record) => (
        <div>
          <div className="text-sm">{record.email || "N/A"}</div>
          <div className="text-xs text-gray-500">{record.phone}</div>
        </div>
      ),
    },
    {
      title: "Students",
      dataIndex: "userCount",
      key: "userCount",
      width: 100,
      align: "center",
      sorter: (a, b) => (a.userCount || 0) - (b.userCount || 0),
    },
    {
      title: "Instructors",
      dataIndex: "driverCount",
      key: "driverCount",
      width: 110,
      align: "center",
      sorter: (a, b) => (a.driverCount || 0) - (b.driverCount || 0),
    },
    {
      title: "Vehicles",
      dataIndex: "carCount",
      key: "carCount",
      width: 100,
      align: "center",
      sorter: (a, b) => (a.carCount || 0) - (b.carCount || 0),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status: "ACTIVE" | "INACTIVE" | "SUSPENDED") => {
        const config = {
          ACTIVE: { color: "green", text: "Active" },
          INACTIVE: { color: "red", text: "Inactive" },
          SUSPENDED: { color: "orange", text: "Suspended" },
        };
        return (
          <Tag color={config[status].color} className="!text-sm !px-3 !py-1">
            {config[status].text}
          </Tag>
        );
      },
    },
    {
      title: "Joined Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date) => dayjs(date).format("DD MMM, YYYY"),
    },
    {
      title: "Action",
      key: "action",
      width: 180,
      fixed: "right",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="default"
            icon={<AntDesignEyeOutlined />}
            size="small"
            onClick={() => router.push(`/admin/school/${record.id}`)}
          >
            View
          </Button>
          <Button
            type="primary"
            icon={<AntDesignEditOutlined />}
            size="small"
            onClick={() => router.push(`/admin/school/${record.id}/edit`)}
            className="!bg-blue-600"
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Super Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Manage all driving schools from one place
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              type="default"
              icon={<IcBaselineRefresh className="text-lg" />}
              size="large"
              onClick={handleRefresh}
              loading={statsLoading || schoolsLoading}
            >
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<AntDesignPlusCircleOutlined className="text-lg" />}
              size="large"
              onClick={() => router.push("/admin/school/add")}
              className="!bg-gradient-to-r from-indigo-600 to-blue-600 border-0 shadow-md"
            >
              Add New School
            </Button>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 space-y-6">
        {/* Statistics Cards */}
        <Row gutter={[20, 20]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-sm hover:shadow-md transition-all" loading={statsLoading}>
              <Statistic
                title={
                  <span className="text-gray-600 text-sm">Total Schools</span>
                }
                value={stats?.totalSchools || 0}
                prefix={<span className="text-3xl">🏫</span>}
                valueStyle={{
                  color: "#1890ff",
                  fontSize: "28px",
                  fontWeight: 600,
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-sm hover:shadow-md transition-all" loading={statsLoading}>
              <Statistic
                title={
                  <span className="text-gray-600 text-sm">Active Schools</span>
                }
                value={stats?.activeSchools || 0}
                prefix={<span className="text-3xl">✅</span>}
                valueStyle={{
                  color: "#52c41a",
                  fontSize: "28px",
                  fontWeight: 600,
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-sm hover:shadow-md transition-all" loading={statsLoading}>
              <Statistic
                title={
                  <span className="text-gray-600 text-sm">Total Users</span>
                }
                value={stats?.totalUsers || 0}
                prefix={<span className="text-3xl">👥</span>}
                valueStyle={{
                  color: "#722ed1",
                  fontSize: "28px",
                  fontWeight: 600,
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-sm hover:shadow-md transition-all" loading={statsLoading}>
              <Statistic
                title={
                  <span className="text-gray-600 text-sm">Total Bookings</span>
                }
                value={stats?.totalBookings || 0}
                prefix={<span className="text-3xl">📅</span>}
                valueStyle={{
                  color: "#fa8c16",
                  fontSize: "28px",
                  fontWeight: 600,
                }}
              />
            </Card>
          </Col>
        </Row>
        <div></div>

        {/* Schools Table */}
        <Card
          title={
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg">All Schools</span>
              <Button
                type="link"
                onClick={() => router.push("/admin/school")}
                className="text-blue-600"
              >
                View All →
              </Button>
            </div>
          }
          className="shadow-sm"
        >
          <Table
            columns={columns}
            dataSource={schools}
            pagination={{ pageSize: 5 }}
            scroll={{ x: 1300 }}
            size="middle"
            loading={schoolsLoading}
            rowKey="id"
          />
        </Card>
        <div></div>

        {/* Quick Actions */}
        <Card
          title={<span className="font-semibold text-lg">Quick Actions</span>}
          className="shadow-sm"
        >
          <Row gutter={[20, 20]}>
            <Col xs={24} md={8}>
              <div
                className="border-2 border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:shadow-md transition-all bg-white"
                onClick={() => router.push("/admin/school/add")}
              >
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AntDesignPlusCircleOutlined className="text-3xl text-blue-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-2">
                  Add New School
                </h3>
                <p className="text-gray-500 text-sm">
                  Register a new driving school
                </p>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div
                className="border-2 border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 hover:shadow-md transition-all bg-white"
                onClick={() => router.push("/admin/school")}
              >
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏫</span>
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-2">
                  Manage Schools
                </h3>
                <p className="text-gray-500 text-sm">
                  View and manage all schools
                </p>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div
                className="border-2 border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 hover:shadow-md transition-all bg-white"
              >
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-2">
                  View Reports
                </h3>
                <p className="text-gray-500 text-sm">
                  Analytics and performance reports
                </p>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
