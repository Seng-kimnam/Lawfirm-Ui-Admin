export const base_Url = "http://localhost:8080/api/v1/";

// User
export const loginUrl = "auths/login";
export const registerUrl = "userauthorize/register";

export const getUserUrl = "User/get-list";
export const getUserByIdUrl = "User/get-by-id/";
export const postUserUrl = "User/post";
export const putUserUrl = "User/put/";
export const deleteUserUrl = "User/delete?id=";
// Service
export const getServiceUrl = (page: Number) => {
  return `services?page=${page}&size=10&sortBy=serviceId&ascending=true`;
};
// export const getServiceByIdUrl = (id: number | string) => {
//   return `services/${id}`;
// };
export const postServiceUrl = "services";
export const putServiceUrl = "services/";
export const deleteServiceUrl = "services/";

// ServiceType
export const getServiceTypeUrl = (page: Number) => {
  return `expertises?page=${page}&size=10&sortBy=expertiseId&ascending=true`;
};

export const getCategoryWithPagination = (page: number) => {
  return `categories?page=${page}&size=10&sortBy=categoryId&ascending=true`;
};

export const getDocumentWithPagination = (page: number) => {
  return `documents?page=${page}&size=10&sortBy=docId&ascending=true`;
};
export const getServiceTypeByIdUrl = "expertises/";
export const postServiceTypeUrl = "expertises";
export const putServiceTypeUrl = "expertises/";
export const deleteServiceTypeUrl = "expertises/";

// Role
export const getRoleUrl = "roles";
export const getRoleByIdUrl = "roles/";
export const postRoleUrl = "roles";
export const putRoleUrl = "roles/";
export const deleteRoleUrl = "roles/";

// client

export const getClientList = (page: Number) => {
  return `clients?page=${page}&size=10&sortBy=clientId&ascending=true`;
};

// court

export const getCourtList = (page: Number) => {
  return `courts?page=${page}&size=10&sortBy=courtId&ascending=true`;
};

// case
export const getCaseList = (page: Number) => {
  return `cases?page=${page}&size=10&sortBy=caseId&ascending=true`;
};

export const getTaskList = (page: Number) => {
  return `tasks?page=${page}&size=10&sortBy=taskId&ascending=true`;
};
