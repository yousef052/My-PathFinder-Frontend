import { apiClient } from "../../../core/network/apiClient";

const endpoint = (path) => encodeURI(path);

const unwrap = (response) => response.data;

export const adminService = {
  careerPaths: {
    getAll: async () => unwrap(await apiClient.get(endpoint("/CareerPath"))),
    search: async (params = {}) =>
      unwrap(await apiClient.get(endpoint("/CareerPath/search"), { params })),
    getById: async (id) =>
      unwrap(await apiClient.get(endpoint(`/CareerPath/${id}`))),
    create: async (payload) =>
      unwrap(
        await apiClient.post(endpoint("/CareerPath/add new careerPath"), payload),
      ),
    update: async (id, payload) =>
      unwrap(
        await apiClient.put(
          endpoint(`/CareerPath/updatecareerPath/${id}`),
          payload,
        ),
      ),
    delete: async (id) =>
      unwrap(
        await apiClient.delete(endpoint(`/CareerPath/deletecareerPath/${id}`)),
      ),
  },

  careerPathCourses: {
    create: async (payload) =>
      unwrap(await apiClient.post(endpoint("/CareerPathCourse"), payload)),
    getByCareerPathId: async (careerPathId) =>
      unwrap(
        await apiClient.get(
          endpoint(`/CareerPathCourse/career-path/${careerPathId}`),
        ),
      ),
    delete: async (id) =>
      unwrap(await apiClient.delete(endpoint(`/CareerPathCourse/${id}`))),
  },

  courses: {
    getAll: async (params = {}) =>
      unwrap(await apiClient.get(endpoint("/Course/all"), { params })),
    search: async (params = {}) =>
      unwrap(await apiClient.get(endpoint("/Course/search"), { params })),
    getById: async (id) => unwrap(await apiClient.get(endpoint(`/Course/${id}`))),
    create: async (payload) =>
      unwrap(await apiClient.post(endpoint("/Course/add"), payload)),
    update: async (id, payload) =>
      unwrap(await apiClient.put(endpoint(`/Course/update/${id}`), payload)),
    delete: async (id) =>
      unwrap(await apiClient.delete(endpoint(`/Course/delete/${id}`))),
  },

  categories: {
    getAll: async () =>
      unwrap(await apiClient.get(endpoint("/CourseCategory/all"))),
    getSubcategories: async (categoryId) =>
      unwrap(
        await apiClient.get(
          endpoint(`/CourseCategory/${categoryId}/subcategories`),
        ),
      ),
    createCategory: async (payload) =>
      unwrap(
        await apiClient.post(endpoint("/CourseCategory/category/add"), payload),
      ),
    updateCategory: async (id, payload) =>
      unwrap(
        await apiClient.put(
          endpoint(`/CourseCategory/category/update/${id}`),
          payload,
        ),
      ),
    deleteCategory: async (id) =>
      unwrap(
        await apiClient.delete(endpoint(`/CourseCategory/category/delete/${id}`)),
      ),
    createSubcategory: async (payload) =>
      unwrap(
        await apiClient.post(
          endpoint("/CourseCategory/subcategory/add"),
          payload,
        ),
      ),
    updateSubcategory: async (id, payload) =>
      unwrap(
        await apiClient.put(
          endpoint(`/CourseCategory/subcategory/update/${id}`),
          payload,
        ),
      ),
    deleteSubcategory: async (id) =>
      unwrap(
        await apiClient.delete(
          endpoint(`/CourseCategory/subcategory/delete/${id}`),
        ),
      ),
    importJson: async (formData) =>
      unwrap(
        await apiClient.post(endpoint("/CourseCategory/import-json"), formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
      ),
  },

  platforms: {
    getAll: async (params = {}) =>
      unwrap(
        await apiClient.get(endpoint("/CoursePlatform/Get-All-Platforms"), {
          params,
        }),
      ),
    getById: async (id) =>
      unwrap(await apiClient.get(endpoint(`/CoursePlatform/${id}`))),
    create: async (payload) =>
      unwrap(await apiClient.post(endpoint("/CoursePlatform/add"), payload)),
    update: async (id, payload) =>
      unwrap(
        await apiClient.put(endpoint(`/CoursePlatform/update/${id}`), payload),
      ),
    delete: async (id) =>
      unwrap(await apiClient.delete(endpoint(`/CoursePlatform/delete/${id}`))),
  },

  jobSources: {
    getAll: async (params = {}) =>
      unwrap(await apiClient.get(endpoint("/job-sources"), { params })),
    getById: async (id) =>
      unwrap(await apiClient.get(endpoint(`/job-sources/${id}`))),
    create: async (payload) =>
      unwrap(await apiClient.post(endpoint("/job-sources"), payload)),
    update: async (id, payload) =>
      unwrap(await apiClient.put(endpoint(`/job-sources/${id}`), payload)),
    delete: async (id) =>
      unwrap(await apiClient.delete(endpoint(`/job-sources/${id}`))),
  },

  skills: {
    getGlobalSkills: async () =>
      unwrap(await apiClient.get(endpoint("/Skill/global-skills"))),
    createGlobalSkill: async (payload) =>
      unwrap(await apiClient.post(endpoint("/Skill/create-global-skill"), payload)),
  },
};
