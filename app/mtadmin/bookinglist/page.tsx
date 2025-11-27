"use client";

import { useState } from "react";
import { Card, Table, Input, Button, Tag, Space, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Booking } from "@/services/booking.api";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPaginatedBookings } from "@/services/booking.api";
import { getCookie } from "cookies-next";

const { Search } = Input;

const BookingListPage = () => {
  const router = useRouter();
  const schoolId: number = parseInt(getCookie("school")?.toString() || "0");
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch bookings
  const {
    data: bookingsResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["booking-list", schoolId, searchText, filterStatus, currentPage],
    queryFn: () =>
      getPaginatedBookings({
        searchPaginationInput: {
          skip: (currentPage - 1) * pageSize,
          take: pageSize,
          search: searchText,
        },
        whereSearchInput: {
          schoolId,
          status: filterStatus !== "all" ? filterStatus : undefined,
        },
      }),
    enabled: schoolId > 0,
  });

  const bookings = bookingsResponse?.data?.getPaginatedBooking?.data || [];
  const totalBookings = bookingsResponse?.data?.getPaginatedBooking?.total || 0;

  const columns: ColumnsType<Booking> = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      width: 120,
      sorter: true,
    },
    {
      title: "Customer",
      key: "customer",
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-semibold text-gray-900">{record.customerName}</div>
          <div className="text-xs text-gray-500">{record.customerMobile}</div>
        </div>
      ),
    },
    {
      title: "Course",
      dataIndex: "courseName",
      key: "courseName",
      width: 160,
      sorter: true,
    },
    {
      title: "Car",
      dataIndex: "carName",
      key: "carName",
      width: 140,
      sorter: true,
    },
    {
      title: "Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
      width: 130,
      sorter: true,
      render: (date) => new Date(date).toLocaleDateString("en-IN"),
    },
    {
      title: "Slot",
      dataIndex: "slot",
      key: "slot",
      width: 110,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={status === "COMPLETED" ? "green" : status === "CANCELLED" ? "red" : "blue"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
      render: (amt) => `₹${amt}`,
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => router.push(`/mtadmin/bookinglist/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Booking List</h1>
            <p className="text-gray-600 mt-1 text-sm">All bookings for your school</p>
          </div>
          <Button type="default" onClick={() => refetch()}>Refresh</Button>
        </div>
      </div>
      <div className="px-8 py-6 space-y-6">
        <Card className="shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <Search
                placeholder="Search by customer, course, car, or booking ID..."
                allowClear
                size="large"
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
                  { label: "All", value: "all" },
                  { label: "Pending", value: "PENDING" },
                  { label: "Confirmed", value: "CONFIRMED" },
                  { label: "Completed", value: "COMPLETED" },
                  { label: "Cancelled", value: "CANCELLED" },
                  { label: "No Show", value: "NO_SHOW" },
                ]}
              />
            </Space>
          </div>
        </Card>
        <div></div>
        <Card className="shadow-sm">
          <Table
            columns={columns}
            dataSource={bookings}
            loading={isLoading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalBookings,
              onChange: (page) => setCurrentPage(page),
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} bookings`,
              showSizeChanger: false,
            }}
            scroll={{ x: 1200 }}
            size="middle"
            rowKey="id"
          />
        </Card>
      </div>
    </div>
  );
};

export default BookingListPage;
