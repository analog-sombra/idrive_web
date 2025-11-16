import { ApiCall } from "./api";

// Types
export interface Syllabus {
  id: number;
  courseId: number;
  syllabusId: string;
  dayNumber: number;
  title: string;
  topics: string; // JSON string
  objectives?: string; // JSON string
  practicalActivities?: string; // JSON string
  assessmentCriteria?: string; // JSON string
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyllabusPagination {
  getPaginatedSyllabus: {
    data: Syllabus[];
    total: number;
    skip: number;
    take: number;
  };
}

export interface SingleSyllabus {
  getSyllabusById: Syllabus;
}

export interface CreateSyllabusResponse {
  createSyllabus: Syllabus;
}

export interface UpdateSyllabusResponse {
  updateSyllabus: Syllabus;
}

export interface DeleteSyllabusResponse {
  deleteSyllabus: Syllabus;
}

// GraphQL Queries
const GET_PAGINATED_SYLLABUS = `
  query GetPaginatedSyllabus($searchPaginationInput: SearchPaginationInput!, $whereSearchInput: SearchSyllabusInput!) {
    getPaginatedSyllabus(searchPaginationInput: $searchPaginationInput, whereSearchInput: $whereSearchInput) {
      data {
        id
        courseId
        syllabusId
        dayNumber
        title
        topics
        objectives
        practicalActivities
        assessmentCriteria
        notes
        createdAt
        updatedAt
      }
      total
      skip
      take
    }
  }
`;

const GET_SYLLABUS_BY_ID = `
  query GetSyllabusById($id: Int!) {
    getSyllabusById(id: $id) {
      id
      courseId
      syllabusId
      dayNumber
      title
      topics
      objectives
      practicalActivities
      assessmentCriteria
      notes
      createdAt
      updatedAt
    }
  }
`;

const CREATE_SYLLABUS = `
  mutation CreateSyllabus($inputType: CreateSyllabusInput!) {
    createSyllabus(inputType: $inputType) {
      id
      courseId
      syllabusId
      dayNumber
      title
      topics
      objectives
      practicalActivities
      assessmentCriteria
      notes
      createdAt
    }
  }
`;

const UPDATE_SYLLABUS = `
  mutation UpdateSyllabus($id: Int!, $updateType: UpdateSyllabusInput!) {
    updateSyllabus(id: $id, updateType: $updateType) {
      id
      courseId
      syllabusId
      dayNumber
      title
      topics
      objectives
      practicalActivities
      assessmentCriteria
      notes
      updatedAt
    }
  }
`;

const DELETE_SYLLABUS = `
  mutation DeleteSyllabus($id: Int!) {
    deleteSyllabus(id: $id) {
      id
    }
  }
`;

// API Functions
export const getPaginatedSyllabus = async (variables: {
  searchPaginationInput: {
    skip: number;
    take: number;
    search?: string;
  };
  whereSearchInput: {
    courseId?: number;
    dayNumber?: number;
    title?: string;
    syllabusId?: string;
  };
}) => {
  return ApiCall<SyllabusPagination>({
    query: GET_PAGINATED_SYLLABUS,
    variables,
  });
};

export const getSyllabusById = async (id: number) => {
  return ApiCall<SingleSyllabus>({
    query: GET_SYLLABUS_BY_ID,
    variables: { id },
  });
};

export const createSyllabus = async (inputType: {
  courseId: number;
  syllabusId: string;
  dayNumber: number;
  title: string;
  topics: string;
  objectives?: string;
  practicalActivities?: string;
  assessmentCriteria?: string;
  notes?: string;
}) => {
  return ApiCall<CreateSyllabusResponse>({
    query: CREATE_SYLLABUS,
    variables: { inputType },
  });
};

export const updateSyllabus = async (updateData: {
  id: number;
  courseId?: number;
  syllabusId?: string;
  dayNumber?: number;
  title?: string;
  topics?: string;
  objectives?: string;
  practicalActivities?: string;
  assessmentCriteria?: string;
  notes?: string;
}) => {
  const { id, ...updateType } = updateData;
  return ApiCall<UpdateSyllabusResponse>({
    query: UPDATE_SYLLABUS,
    variables: { id, updateType: { id, ...updateType } },
  });
};

export const deleteSyllabus = async (id: number) => {
  return ApiCall<DeleteSyllabusResponse>({
    query: DELETE_SYLLABUS,
    variables: { id },
  });
};
