import { ApiCall } from './api';

// Types
export interface Service {
  id: number;
  schoolId: number;
  serviceId: string;
  serviceName: string;
  serviceType: 'LICENSE' | 'ADDON';
  category: string;
  price: number;
  duration: number; // in days
  description: string;
  features?: string;
  includedServices?: string;
  requirements?: string;
  termsAndConditions?: string;
  activeUsers: number;
  totalRevenue: number;
  status: 'ACTIVE' | 'INACTIVE' | 'UPCOMING' | 'DISCONTINUED';
  createdAt: string;
  updatedAt: string;
}

export interface ServicePagination {
  getPaginatedService: {
    data: Service[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface SingleService {
  getServiceById: Service;
}

export interface CreateServiceResponse {
  createService: Service;
}

export interface UpdateServiceResponse {
  updateService: Service;
}

// GraphQL Queries
const GET_PAGINATED_SERVICES = `
  query GetPaginatedService($page: Int!, $limit: Int!, $where: WhereServiceSearchInput) {
    getPaginatedService(page: $page, limit: $limit, where: $where) {
      data {
        id
        schoolId
        serviceId
        serviceName
        serviceType
        category
        price
        duration
        description
        features
        includedServices
        requirements
        termsAndConditions
        activeUsers
        totalRevenue
        status
        createdAt
        updatedAt
      }
      total
      page
      limit
    }
  }
`;

const GET_SERVICE_BY_ID = `
  query GetServiceById($id: Int!) {
    getServiceById(id: $id) {
      id
      schoolId
      serviceId
      serviceName
      serviceType
      category
      price
      duration
      description
      features
      includedServices
      requirements
      termsAndConditions
      activeUsers
      totalRevenue
      status
      createdAt
      updatedAt
    }
  }
`;

const CREATE_SERVICE = `
  mutation CreateService($inputType: CreateServiceInput!) {
    createService(inputType: $inputType) {
      id
      schoolId
      serviceId
      serviceName
      serviceType
      category
      price
      duration
      description
      status
      createdAt
    }
  }
`;

const UPDATE_SERVICE = `
  mutation UpdateService($id: Int!, $updateType: UpdateServiceInput!) {
    updateService(id: $id, updateType: $updateType) {
      id
      schoolId
      serviceId
      serviceName
      serviceType
      category
      price
      duration
      description
      features
      includedServices
      requirements
      termsAndConditions
      activeUsers
      totalRevenue
      status
      updatedAt
    }
  }
`;

const DELETE_SERVICE = `
  mutation DeleteService($id: Int!) {
    deleteService(id: $id) {
      id
    }
  }
`;

// API Functions
export const getPaginatedServices = async (variables: {
  page: number;
  limit: number;
  where?: {
    schoolId?: number;
    serviceType?: string;
    status?: string;
  };
}) => {
  return ApiCall<ServicePagination>({
    query: GET_PAGINATED_SERVICES,
    variables,
  });
};

export const getServiceById = async (id: number) => {
  return ApiCall<SingleService>({
    query: GET_SERVICE_BY_ID,
    variables: { id },
  });
};

export const createService = async (inputType: {
  schoolId: number;
  serviceId: string;
  serviceName: string;
  serviceType: 'LICENSE' | 'ADDON';
  category: string;
  price: number;
  duration: number;
  description: string;
  features?: string;
  includedServices?: string;
  requirements?: string;
  termsAndConditions?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'UPCOMING' | 'DISCONTINUED';
}) => {
  return ApiCall<CreateServiceResponse>({
    query: CREATE_SERVICE,
    variables: { inputType },
  });
};

export const updateService = async (updateData: {
  id: number;
  serviceName?: string;
  serviceType?: 'LICENSE' | 'ADDON';
  category?: string;
  price?: number;
  duration?: number;
  description?: string;
  features?: string;
  includedServices?: string;
  requirements?: string;
  termsAndConditions?: string;
  activeUsers?: number;
  totalRevenue?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'UPCOMING' | 'DISCONTINUED';
}) => {
  const { id, ...updateType } = updateData;
  return ApiCall<UpdateServiceResponse>({
    query: UPDATE_SERVICE,
    variables: { id, updateType: { id, ...updateType } },
  });
};

export const deleteService = async (id: number) => {
  return ApiCall<{ deleteService: { id: number } }>({
    query: DELETE_SERVICE,
    variables: { id },
  });
};
