import { instance } from '../instance'

export const get_Module_data = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.get(
      `v1/modules/feedbacks/module-data`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw new Error("Failed to fetch feedback Data");
  }
};

export const get_Trainer_data = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.get(
      `v1/modules/feedbacks/trainer-data`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw new Error("Failed to fetch feedback Data");
  }
};

export const Get_Evaluate_by_Module = async ({ module, trainerAccount }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.get(
      'v1/modules/feedbacks/statistic/evaluate-by-module',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          module: encodeURIComponent(module),
          trainerAccount: trainerAccount.map(account => encodeURIComponent(account)),
        },
        paramsSerializer: params => {
          return Object.entries(params)
            .map(([key, value]) => {
              if (Array.isArray(value)) {
                return value.map(val => `${key}=${val}`).join('&');
              }
              return `${key}=${value}`;
            })
            .join('&');
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
export const Get_Evaluate_by_Trainer = async ({ classCode, trainerAccount }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.get(
      'v1/modules/feedbacks/statistic/module-by-trainer',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          trainerAccount: encodeURIComponent(trainerAccount),
          classCode: classCode.map(classCode => encodeURIComponent(classCode)),
        },
        paramsSerializer: params => {
          return Object.entries(params)
            .map(([key, value]) => {
              if (Array.isArray(value)) {
                return value.map(val => `${key}=${val}`).join('&');
              }
              return `${key}=${value}`;
            })
            .join('&');
        },
      }
    );
    return response;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const get_Technical_data = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.get(
      `v1/modules/feedbacks/technical-names`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching :", error);
    throw new Error("Failed to fetch feedback Data");
  }
};
// Fetch class options by trainer
export const get_ClassAdmin_by_Trainer = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.get('v1/modules/feedbacks/class-admin',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ); // Replace with actual endpoint
    return response;
  } catch (error) {
    throw error;
  }
};

export const Get_Course_by_Module = async ({ classCode }) => {
  try {
    // Ensure classCode is an array
    const validClassCode = Array.isArray(classCode) ? classCode : [classCode];
    const token = localStorage.getItem("token");

    const response = await instance.get(
      'v1/modules/feedbacks/statistic/by-technical-group',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          classCode: validClassCode.map(code => encodeURIComponent(code)), // .map() works now safely
        },
        paramsSerializer: params => {
          return Object.entries(params)
            .map(([key, value]) => {
              if (Array.isArray(value)) {
                return value.map(val => `${key}=${val}`).join('&');
              }
              return `${key}=${value}`;
            })
            .join('&');
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getByModule = async ({ modules }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.get(
      'v1/modules/feedbacks/statistic/by-module',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          module: modules.map(encodeURIComponent),
        },
        paramsSerializer: (params) => {
          return params.module.map((mod) => `module=${mod}`).join("&");
        },
      }
    );
    return response;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getStatisticsByModuleName = async (moduleName) => {
  try {
    const token = localStorage.getItem("token");
    const module = encodeURIComponent(moduleName)
    const response = await instance.get(
      `v1/modules/feedbacks/statistic/by-module-name?module=${module}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

    );
    return response;

  } catch (error) {
    return { success: false, message: "Failed to fetch data by module name." };
  }
};

export const Get_Admin_by_ClassName = async ({ classAdmin, classNames }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.get(
      'v1/modules/feedbacks/statistic/class-admin/by-class-names',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          classAdmin: encodeURIComponent(classAdmin),
          classNames: classNames.map(classNames => encodeURIComponent(classNames)),
        },
        paramsSerializer: params => {
          return Object.entries(params)
            .map(([key, value]) => {
              if (Array.isArray(value)) {
                return value.map(val => `${key}=${val}`).join('&');
              }
              return `${key}=${value}`;
            })
            .join('&');
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
