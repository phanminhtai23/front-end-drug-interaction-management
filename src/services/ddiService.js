// api/ddiService.js
import axiosClient from "./axiosClient";

const ddiService = {
    // Lấy tất cả các tương tác thuốc
    getAll: (params) => {
        return axiosClient.get("/ddi", { params });
    },

    // Lấy chi tiết tương tác thuốc
    getById: (id) => {
        return axiosClient.get(`/ddi/${id}`);
    },

    // Kiểm tra tương tác giữa các thuốc
    checkInteraction: (drugIds) => {
        return axiosClient.post("/ddi/check", { drugIds });
    },

    // Tạo mới thông tin tương tác thuốc
    create: (data) => {
        return axiosClient.post("/ddi", data);
    },

    // Cập nhật thông tin tương tác thuốc
    update: (id, data) => {
        return axiosClient.put(`/ddi/${id}`, data);
    },

    // Xóa thông tin tương tác thuốc
    delete: (id) => {
        return axiosClient.delete(`/ddi/${id}`);
    },
};

export default ddiService;
