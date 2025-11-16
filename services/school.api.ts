import { ApiCall } from "./api";

// Types
export interface School {
  id: number;
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  registrationNumber: string;
  gstNumber: string;
  establishedYear: string;
  website: string;
  logo?: string;
  dayStartTime?: string;
  dayEndTime?: string;
  lunchStartTime?: string;
  lunchEndTime?: string;
  weeklyHoliday?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  branchName?: string;
  rtoLicenseNumber?: string;
  rtoLicenseExpiry?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiry?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
}

export interface SchoolPagination {
  getPaginatedSchool: {
    data: School[];
    total: number;
    skip: number;
    take: number;
  };
}

export interface SingleSchool {
  getSchoolById: School;
}

export interface CreateSchoolResponse {
  createSchool: School;
}

export interface UpdateSchoolResponse {
  updateSchool: School;
}

// GraphQL Queries
const GET_PAGINATED_SCHOOLS = `
  query GetPaginatedSchool($searchPaginationInput: SearchPaginationInput!, $whereSearchInput: WhereSchoolSearchInput!) {
    getPaginatedSchool(searchPaginationInput: $searchPaginationInput, whereSearchInput: $whereSearchInput) {
      data {
        id
        name
        email
        phone
        alternatePhone
        address
        registrationNumber
        gstNumber
        establishedYear
        website
        logo
        status
        createdAt
        updatedAt
      }
      total
      skip
      take
    }
  }
`;

const GET_SCHOOL_BY_ID = `
  query GetSchoolById($id: Int!) {
    getSchoolById(id: $id) {
      id
      name
      email
      phone
      alternatePhone
      address
      registrationNumber
      gstNumber
      establishedYear
      website
      logo
      dayStartTime
      dayEndTime
      lunchStartTime
      lunchEndTime
      weeklyHoliday
      ownerName
      ownerPhone
      ownerEmail
      bankName
      accountNumber
      ifscCode
      branchName
      rtoLicenseNumber
      rtoLicenseExpiry
      insuranceProvider
      insurancePolicyNumber
      insuranceExpiry
      facebook
      instagram
      twitter
      status
      createdAt
      updatedAt
    }
  }
`;

const CREATE_SCHOOL = `
  mutation CreateSchool($inputType: CreateSchoolInput!) {
    createSchool(inputType: $inputType) {
      id
      name
      email
      phone
      alternatePhone
      address
      registrationNumber
      gstNumber
      establishedYear
      website
      logo
      status
      createdAt
    }
  }
`;

const UPDATE_SCHOOL = `
  mutation UpdateSchool($id: Int!, $updateType: UpdateSchoolInput!) {
    updateSchool(id: $id, updateType: $updateType) {
      id
      name
      email
      phone
      alternatePhone
      address
      registrationNumber
      gstNumber
      establishedYear
      website
      logo
      dayStartTime
      dayEndTime
      lunchStartTime
      lunchEndTime
      weeklyHoliday
      ownerName
      ownerPhone
      ownerEmail
      bankName
      accountNumber
      ifscCode
      branchName
      rtoLicenseNumber
      rtoLicenseExpiry
      insuranceProvider
      insurancePolicyNumber
      insuranceExpiry
      facebook
      instagram
      twitter
      status
      updatedAt
    }
  }
`;

// API Functions
export const getPaginatedSchools = async (variables: {
  searchPaginationInput: {
    skip: number;
    take: number;
    search?: string;
  };
  whereSearchInput: {
    name?: string;
    email?: string;
    phone?: string;
    status?: string;
    address?: string;
  };
}) => {
  return ApiCall<SchoolPagination>({
    query: GET_PAGINATED_SCHOOLS,
    variables,
  });
};

export const getSchoolById = async (id: number) => {
  return ApiCall<SingleSchool>({
    query: GET_SCHOOL_BY_ID,
    variables: {
      id,
    },
  });
};

export const createSchool = async (inputType: {
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  registrationNumber: string;
  gstNumber: string;
  establishedYear: string;
  website: string;
  logo?: string;
}) => {
  return ApiCall<CreateSchoolResponse>({
    query: CREATE_SCHOOL,
    variables: { inputType },
  });
};

export const updateSchool = async (updateData: {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  address?: string;
  registrationNumber?: string;
  gstNumber?: string;
  establishedYear?: string;
  website?: string;
  logo?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  // Operating hours
  dayStartTime?: string;
  dayEndTime?: string;
  lunchStartTime?: string;
  lunchEndTime?: string;
  weeklyHoliday?: string;
  // Owner details
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  // Bank details
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  branchName?: string;
  // Licenses
  rtoLicenseNumber?: string;
  rtoLicenseExpiry?: Date;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiry?: Date;
  // Social media
  facebook?: string;
  instagram?: string;
  twitter?: string;
}) => {
  const { id, ...updateType } = updateData;
  return ApiCall<UpdateSchoolResponse>({
    query: UPDATE_SCHOOL,
    variables: { id, updateType: { id, ...updateType } },
  });
};
