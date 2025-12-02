import { ApiCall } from "./api";

// Types
export interface SchoolService {
  id: number;
  schoolId: number;
  serviceId: number;
  schoolServiceId: string;
  licensePrice: number;
  addonPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  school?: {
    id: number;
    name: string;
  };
  service?: {
    id: number;
    serviceId: string;
    serviceName: string;
    category: string;
    duration: number;
    description: string;
  };
}

export interface SchoolServicePaginatedResponse {
  getPaginatedSchoolService: {
    data: SchoolService[];
    total: number;
  };
}

export interface CreateSchoolServiceInput {
  schoolId: number;
  serviceId: number;
  licensePrice: number;
  addonPrice: number;
}

export interface UpdateSchoolServiceInput {
  schoolId?: number;
  serviceId?: number;
  licensePrice?: number;
  addonPrice?: number;
  status?: string;
}

// GraphQL Queries
const GET_PAGINATED_SCHOOL_SERVICES = `
  query GetPaginatedSchoolService(
    $searchPaginationInput: SearchPaginationInput!
    $whereSearchInput: WhereSchoolServiceSearchInput!
  ) {
    getPaginatedSchoolService(
      searchPaginationInput: $searchPaginationInput
      whereSearchInput: $whereSearchInput
    ) {
      total
      data {
        id
        schoolId
        serviceId
        schoolServiceId
        licensePrice
        addonPrice
        status
        createdAt
        updatedAt
        school {
          id
          name
        }
        service {
          id
          serviceId
          serviceName
          category
          duration
          description
        }
      }
    }
  }
`;

const GET_ALL_SCHOOL_SERVICES = `
  query GetAllSchoolService($whereSearchInput: WhereSchoolServiceSearchInput!) {
    getAllSchoolService(whereSearchInput: $whereSearchInput) {
      id
      schoolId
      serviceId
      schoolServiceId
      licensePrice
      addonPrice
      status
      createdAt
      updatedAt
      school {
        id
        name
      }
      service {
        id
        serviceId
        serviceName
        category
        duration
        description
      }
    }
  }
`;

const GET_SCHOOL_SERVICE_BY_ID = `
  query GetSchoolServiceById($id: Int!) {
    getSchoolServiceById(id: $id) {
      id
      schoolId
      serviceId
      schoolServiceId
      licensePrice
      addonPrice
      status
      createdAt
      updatedAt
      school {
        id
        name
      }
      service {
        id
        serviceId
        serviceName
        category
        duration
        description
      }
    }
  }
`;

const CREATE_SCHOOL_SERVICE = `
  mutation CreateSchoolService($inputType: CreateSchoolServiceInput!) {
    createSchoolService(inputType: $inputType) {
      id
      schoolId
      serviceId
      schoolServiceId
      licensePrice
      addonPrice
      status
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_SCHOOL_SERVICE = `
  mutation UpdateSchoolService($id: Int!, $updateType: UpdateSchoolServiceInput!) {
    updateSchoolService(id: $id, updateType: $updateType) {
      id
      schoolId
      serviceId
      schoolServiceId
      licensePrice
      addonPrice
      status
      createdAt
      updatedAt
    }
  }
`;

const DELETE_SCHOOL_SERVICE = `
  mutation DeleteSchoolService($id: Int!) {
    deleteSchoolService(id: $id) {
      id
      schoolServiceId
    }
  }
`;

// API Functions
export const getPaginatedSchoolServices = async (variables: {
  searchPaginationInput: {
    skip: number;
    take: number;
    search?: string;
  };
  whereSearchInput?: {
    schoolId?: number;
    serviceId?: number;
    status?: string;
  };
}) => {
  return ApiCall<SchoolServicePaginatedResponse>({
    query: GET_PAGINATED_SCHOOL_SERVICES,
    variables,
  });
};

export const getAllSchoolServices = async (variables?: {
  whereSearchInput?: {
    schoolId?: number;
    serviceId?: number;
    status?: string;
  };
}) => {
  return ApiCall<{ getAllSchoolService: SchoolService[] }>({
    query: GET_ALL_SCHOOL_SERVICES,
    variables: variables || {},
  });
};

export const getSchoolServiceById = async (id: number) => {
  return ApiCall<{ getSchoolServiceById: SchoolService }>({
    query: GET_SCHOOL_SERVICE_BY_ID,
    variables: { id },
  });
};

export const createSchoolService = async (input: CreateSchoolServiceInput) => {
  return ApiCall<{ createSchoolService: SchoolService }>({
    query: CREATE_SCHOOL_SERVICE,
    variables: { inputType: input },
  });
};

export const updateSchoolService = async (
  id: number,
  update: UpdateSchoolServiceInput
) => {
  return ApiCall<{ updateSchoolService: SchoolService }>({
    query: UPDATE_SCHOOL_SERVICE,
    variables: { id, updateType: update },
  });
};

export const deleteSchoolService = async (id: number) => {
  return ApiCall<{ deleteSchoolService: SchoolService }>({
    query: DELETE_SCHOOL_SERVICE,
    variables: { id },
  });
};
