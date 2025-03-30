// api/drugService.js
import axiosClient from "./axiosClient";

const drugService = {
    // Lấy danh sách thuốc
    getAll: () => {
        return axiosClient.get("/drugs");
    },

    // Thêm mới thuốc
    create: (data) => {
        return axiosClient.post("/drugs", data);
    },

    // Trích thông tin từ document
    extract: (document_urls) => {
        return axiosClient.get(`/drugs/extract`, document_urls);
    },

    // Cập nhật thông tin thuốc
    update: (drug_id) => {
        return axiosClient.put(`/drugs/${drug_id}`);
    },

    // Xóa thuốc
    delete: (drug_id) => {
        return axiosClient.delete(`/drugs/${drug_id}`);
    },
};

export default drugService;
