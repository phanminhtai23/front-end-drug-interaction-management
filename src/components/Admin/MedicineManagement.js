import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import drugService from "../../services/drugService";
import { LoadingData } from "../loading";
import ReactPaginate from "react-paginate";
import { message } from "antd";
import UploadWidget from "../Cloudary";
// import "../../styles/style.css";

const MedicineManagement = () => {
    const [medicines, setMedicines] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("view");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [userToDelete, setmedToDelete] = useState(null);
    const itemsPerPage = 9;

    useEffect(() => {
        fetchDrug();
    }, []);

    const fetchDrug = async () => {
        try {
            setLoading(true);
            const response = await drugService.getAll();
            // console.log("Full response:", response);
            // Check if response.data exists and is an array
            if (response.drugs && Array.isArray(response.drugs)) {
                setMedicines(response.drugs);
            } else {
                console.error("Invalid response format:", response);
                setMedicines([]);
                setError("Định dạng dữ liệu không hợp lệ");
            }
        } catch (err) {
            console.error("Error fetching users:", err);
            setMedicines([]); // Ensure users is at least an empty array
            setError(
                "Không thể tải danh sách người dùng, vui lòng thử lại sau."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleView = (medicine) => {
        setSelectedMedicine(medicine);
        setModalMode("view");
        setIsModalOpen(true);
    };

    const handleEdit = (medicine) => {
        setSelectedMedicine(medicine);
        setModalMode("edit");
        setIsModalOpen(true);
    };

const handleAdd = () => {
    setSelectedMedicine({
        tenThuoc: "",
        hoatChat: [{ tenHoatChat: "", nongDo: "" }],
        soDangKy: "",
        dotPheDuyet: "",
        soQuyetDinh: "",
        pheDuyet: "",
        phanLoai: "",
        taDuoc: "",
        baoChe: "",
        dongGoi: "",
        tieuChuan: "",
        tuoiTho: "",
        congTySx: "",
        congTySxCode: "",
        nuocSx: "",
        diaChiSx: "",
        congTyDk: "",
        nuocDk: "",
        diaChiDk: "",
        nhomThuoc: "",
    });
    setModalMode("add");
    setIsModalOpen(true);
};

    // Show delete confirmation modal
    const showDeleteConfirmation = (med) => {
        setmedToDelete(med);
        setModalMode("delete");
        setIsModalOpen(true);
    };

    // Handle actual deletion after confirmation
    const handleDelete = async () => {
        try {
            // You'll need to adjust your API endpoint to accept email instead of ID
            // or change how you identify users for deletion
            await drugService.delete(userToDelete.id);

            // Close the modal
            setIsModalOpen(false);

            // Show success message
            message.success("Xóa thuốc thành công!");

            // Refresh the users list after successful deletion
            fetchDrug();
        } catch (err) {
            console.error("Error deleting user:", err);
            message.error("Không thể xóa thuốc, vui lòng thử lại sau.");
        }
    };


    const handleSave = async (updatedMedicine) => {
        try {
            if (modalMode === "add") {
                await drugService.create(updatedMedicine);
            } else {
                await drugService.update(updatedMedicine.id, updatedMedicine);
            }
            // Refresh the medicines list after saving
            fetchDrug();
            setIsModalOpen(false);
        } catch (err) {
            console.error(
                `Error ${
                    modalMode === "add" ? "adding" : "updating"
                } medicine:`,
                err
            );
            setError(
                `Không thể ${modalMode === "add" ? "thêm" : "cập nhật"} thuốc`
            );
        }
    };

    // Format hoạt chất for display
    const formatHoatChat = (hoatChatArray) => {
        if (
            !hoatChatArray ||
            !Array.isArray(hoatChatArray) ||
            hoatChatArray.length === 0
        )
            return "";
        return hoatChatArray.map((hc) => hc.tenHoatChat).join("; ");
    };

    // Make sure medicines is always an array before filtering
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const filteredMedicines = medicines.filter(
        (med) =>
            med.tenThuoc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            med.congTySx?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            med.nuocSx?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pageCount = Math.ceil(filteredMedicines.length / itemsPerPage);
    const currentMedicines = filteredMedicines.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Quản Lý Thuốc</h2>
                <button
                    onClick={handleAdd}
                    className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
                >
                    <Plus className="mr-2" /> Thêm Thuốc
                </button>
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm thuốc..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                />
            </div>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}
            <div className="flex-grow">
                {loading ? (
                    <LoadingData />
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2 w-24">Mã Thuốc</th>
                                <th className="border p-2">Tên Thuốc</th>
                                <th className="border p-2 w-1/3">Hoạt Chất</th>
                                <th className="border p-2">Công Ty SX</th>
                                <th className="border p-2 w-24">Nước SX</th>
                                <th className="border p-2 w-28">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentMedicines.length > 0 ? (
                                currentMedicines.map((med) => (
                                    <tr key={med.id || Math.random()}>
                                        <td className="border p-2 ">
                                            {med.id || ""}
                                        </td>
                                        <td className="border p-2 ">
                                            {med.tenThuoc || ""}
                                        </td>
                                        <td className="border p-2 ">
                                            {formatHoatChat(med.hoatChat)}
                                        </td>
                                        <td className="border p-2 ">
                                            {med.congTySx || ""}
                                        </td>
                                        <td className="border p-2 ">
                                            {med.nuocSx || ""}
                                        </td>
                                        <td className="border p-2 ">
                                            <div className="flex justify-center items-center space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleView(med)
                                                    }
                                                    className="text-blue-500"
                                                >
                                                    <Eye />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleEdit(med)
                                                    }
                                                    className="text-yellow-500"
                                                >
                                                    <Edit />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        showDeleteConfirmation(
                                                            med
                                                        )
                                                    }
                                                    className="text-red-500"
                                                >
                                                    <Trash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="border p-2 text-center"
                                    >
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1 bg-white shadow-md rounded-lg p-1 border border-gray-300">
                <ReactPaginate
                    previousLabel={"← Trước"}
                    nextLabel={"Tiếp →"}
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                    marginPagesDisplayed={0}
                    pageRangeDisplayed={5}
                    containerClassName="flex items-center space-x-1 text-sm mb-0"
                    pageClassName="px-2 py-1 border border-gray-300 rounded hover:bg-gray-200 transition"
                    pageLinkClassName="block"
                    previousLinkClassName="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
                    nextLinkClassName="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
                    disabledClassName="opacity-50 cursor-not-allowed"
                    activeClassName="bg-blue-500 text-white px-2 py-1 rounded"
                />
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="max-h-[70vh] overflow-y-auto w-full">
                    {modalMode === "view" && selectedMedicine && (
                        <div className="max-h-[70vh] overflow-y-auto">
                            <h3 className="text-xl font-bold mb-4">
                                Chi Tiết Thuốc
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                <p>
                                    <strong>Mã Thuốc:</strong>{" "}
                                    {selectedMedicine.id || ""}
                                </p>
                                <p>
                                    <strong>Tên Thuốc:</strong>{" "}
                                    {selectedMedicine.tenThuoc || ""}
                                </p>
                                <p>
                                    <strong>Số Đăng Ký:</strong>{" "}
                                    {selectedMedicine.soDangKy || ""}
                                </p>
                                <p>
                                    <strong>Số Quyết Định:</strong>{" "}
                                    {selectedMedicine.soQuyetDinh || ""}
                                </p>
                                <p>
                                    <strong>Phê Duyệt:</strong>{" "}
                                    {selectedMedicine.pheDuyet || ""}
                                </p>
                                <p>
                                    <strong>Đợt Phê Duyệt:</strong>{" "}
                                    {selectedMedicine.dotPheDuyet || ""}
                                </p>
                            </div>

                            <div className="mt-3">
                                <p className="mb-1">
                                    <strong>Hoạt Chất:</strong>
                                </p>
                                {Array.isArray(selectedMedicine.hoatChat) &&
                                    selectedMedicine.hoatChat.map(
                                        (hc, index) => (
                                            <p key={index} className="ml-4">
                                                • {hc.tenHoatChat || "Không có"}{" "}
                                                - {hc.nongDo || "Không rõ"}
                                            </p>
                                        )
                                    )}
                            </div>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                                <p>
                                    <strong>Công Ty SX:</strong>{" "}
                                    {selectedMedicine.congTySx || ""}
                                </p>
                                <p>
                                    <strong>Mã Công Ty SX:</strong>{" "}
                                    {selectedMedicine.congTySxCode || ""}
                                </p>
                                <p>
                                    <strong>Nước SX:</strong>{" "}
                                    {selectedMedicine.nuocSx || ""}
                                </p>
                                <p>
                                    <strong>Địa Chỉ SX:</strong>{" "}
                                    {selectedMedicine.diaChiSx || ""}
                                </p>
                                <p>
                                    <strong>Công Ty ĐK:</strong>{" "}
                                    {selectedMedicine.congTyDk || ""}
                                </p>
                                <p>
                                    <strong>Nước ĐK:</strong>{" "}
                                    {selectedMedicine.nuocDk || ""}
                                </p>
                                <p>
                                    <strong>Địa Chỉ ĐK:</strong>{" "}
                                    {selectedMedicine.diaChiDk || ""}
                                </p>
                                <p>
                                    <strong>Phân Loại:</strong>{" "}
                                    {selectedMedicine.phanLoai || ""}
                                </p>
                                <p>
                                    <strong>Bào Chế:</strong>{" "}
                                    {selectedMedicine.baoChe || ""}
                                </p>
                                <p>
                                    <strong>Đóng Gói:</strong>{" "}
                                    {selectedMedicine.dongGoi || ""}
                                </p>
                                <p>
                                    <strong>Tiêu Chuẩn:</strong>{" "}
                                    {selectedMedicine.tieuChuan || ""}
                                </p>
                                <p>
                                    <strong>Tuổi Thọ:</strong>{" "}
                                    {selectedMedicine.tuoiTho || ""}
                                </p>
                                <p>
                                    <strong>Tá Dược:</strong>{" "}
                                    {selectedMedicine.taDuoc || ""}
                                </p>
                                <p>
                                    <strong>Nhóm Thuốc:</strong>{" "}
                                    {selectedMedicine.nhomThuoc || ""}
                                </p>
                            </div>
                        </div>
                    )}
                    {(modalMode === "edit" || modalMode === "add") && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                // Update this part to collect all the fields
                                const formData = new FormData(e.target);

                                // Create hoatChat array properly
                                const hoatChat = [];
                                const hoatChatInputs =
                                    document.querySelectorAll(
                                        ".hoatChat-container"
                                    );

                                hoatChatInputs.forEach((container) => {
                                    const tenHoatChat = container.querySelector(
                                        '[name^="tenHoatChat"]'
                                    ).value;
                                    const nongDo =
                                        container.querySelector(
                                            '[name^="nongDo"]'
                                        ).value;

                                    if (tenHoatChat || nongDo) {
                                        hoatChat.push({ tenHoatChat, nongDo });
                                    }
                                });

                                const updatedMedicine = {
                                    ...(selectedMedicine || {}),
                                    tenThuoc: formData.get("tenThuoc"),
                                    hoatChat: hoatChat,
                                    dotPheDuyet:
                                        formData.get("dotPheDuyet") || "",
                                    soQuyetDinh:
                                        formData.get("soQuyetDinh") || "",
                                    pheDuyet: formData.get("pheDuyet") || "",
                                    soDangKy: formData.get("soDangKy") || "",
                                    phanLoai: formData.get("phanLoai") || "",
                                    taDuoc: formData.get("taDuoc") || "",
                                    baoChe: formData.get("baoChe") || "",
                                    dongGoi: formData.get("dongGoi") || "",
                                    tieuChuan: formData.get("tieuChuan") || "",
                                    tuoiTho: formData.get("tuoiTho") || "",
                                    congTySx: formData.get("congTySx") || "",
                                    congTySxCode:
                                        formData.get("congTySxCode") || "",
                                    nuocSx: formData.get("nuocSx") || "",
                                    diaChiSx: formData.get("diaChiSx") || "",
                                    congTyDk: formData.get("congTyDk") || "",
                                    nuocDk: formData.get("nuocDk") || "",
                                    diaChiDk: formData.get("diaChiDk") || "",
                                    nhomThuoc: formData.get("nhomThuoc") || "",
                                };

                                handleSave(updatedMedicine);
                            }}
                            className="w-full"
                        >
                            {/* Chỉ hiển thị phần tải file khi modalMode === "add" */}
                            {modalMode === "add" && (
                                <div className="mb-4 flex flex-col items-start space-y-2">
                                    <label className="text-gray-700 font-bold">
                                        Nhập nhiều file ảnh hoặc một file PDF để
                                        thêm thuốc:
                                    </label>
                                    <UploadWidget />
                                </div>
                            )}
                            <h3 className="text-xl font-bold mb-4">
                                {modalMode === "edit"
                                    ? "Chỉnh Sửa"
                                    : "Thêm Thuốc"}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block mb-2 ">
                                        Tên Thuốc
                                    </label>
                                    <input
                                        type="text"
                                        name="tenThuoc"
                                        defaultValue={
                                            selectedMedicine?.tenThuoc || ""
                                        }
                                        className="w-full border p-2 rounded py-2 leading-normal"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 ">
                                        Số Đăng Ký
                                    </label>
                                    <input
                                        type="text"
                                        name="soDangKy"
                                        defaultValue={
                                            selectedMedicine?.soDangKy || ""
                                        }
                                        className="w-full border p-2 rounded py-2 leading-normal"
                                    />
                                </div>
                            </div>
                            {/* Hoạt chất section - make it dynamic */}
                            <div className="mb-4">
                                <label className="block mb-2 ">Hoạt Chất</label>
                                <div id="hoatChatContainer">
                                    {selectedMedicine?.hoatChat?.map(
                                        (hc, index) => (
                                            <div
                                                key={index}
                                                className="flex gap-2 mb-2 hoatChat-container"
                                            >
                                                <input
                                                    type="text"
                                                    name={`tenHoatChat${index}`}
                                                    defaultValue={
                                                        hc.tenHoatChat || ""
                                                    }
                                                    placeholder="Tên hoạt chất"
                                                    className="w-1/2 border p-2 rounded py-2 leading-normal"
                                                />
                                                <input
                                                    type="text"
                                                    name={`nongDo${index}`}
                                                    defaultValue={
                                                        hc.nongDo || ""
                                                    }
                                                    placeholder="Nồng độ"
                                                    className="w-1/2 border p-2 rounded py-2 leading-normal"
                                                />
                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                                        onClick={() => {
                                                            const container =
                                                                document.getElementById(
                                                                    "hoatChatContainer"
                                                                );
                                                            container.removeChild(
                                                                container
                                                                    .children[
                                                                    index
                                                                ]
                                                            );
                                                        }}
                                                    >
                                                        X
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    ) || (
                                        <div className="flex gap-2 mb-2 hoatChat-container">
                                            <input
                                                type="text"
                                                name="tenHoatChat0"
                                                placeholder="Tên hoạt chất"
                                                className="w-1/2 border p-2 rounded py-2 leading-normal"
                                            />
                                            <input
                                                type="text"
                                                name="nongDo0"
                                                placeholder="Nồng độ"
                                                className="w-1/2 border p-2 roundedpy-2 leading-normal"
                                            />
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
                                    onClick={() => {
                                        const container =
                                            document.getElementById(
                                                "hoatChatContainer"
                                            );
                                        const newIndex =
                                            container.children.length;
                                        const newRow =
                                            document.createElement("div");
                                        newRow.className =
                                            "flex gap-2 mb-2 hoatChat-container";
                                        newRow.innerHTML = `
                        <input
                            type="text"
                            name="tenHoatChat${newIndex}"
                            placeholder="Tên hoạt chất"
                            class="w-1/2 border p-2 rounded py-2 leading-normal"
                        />
                        <input
                            type="text"
                            name="nongDo${newIndex}"
                            placeholder="Nồng độ"
                            class="w-1/2 border p-2 rounded py-2 leading-normal"
                        />
                        <button
                            type="button"
                            class="bg-red-500 text-white px-2 py-1 rounded"
                            onclick="this.parentElement.remove()"
                        >
                            X
                        </button>
                    `;
                                        container.appendChild(newRow);
                                    }}
                                >
                                    + Thêm Hoạt Chất
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block mb-2 ">
                                        Công Ty SX
                                    </label>
                                    <input
                                        type="text"
                                        name="congTySx"
                                        defaultValue={
                                            selectedMedicine?.congTySx || ""
                                        }
                                        className="w-full border p-2 rounded py-2 leading-normal"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 ">
                                        Mã Công Ty SX
                                    </label>
                                    <input
                                        type="text"
                                        name="congTySxCode"
                                        defaultValue={
                                            selectedMedicine?.congTySxCode || ""
                                        }
                                        className="w-full border p-2 rounded py-2 leading-normal"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 ">
                                        Nước SX
                                    </label>
                                    <input
                                        type="text"
                                        name="nuocSx"
                                        defaultValue={
                                            selectedMedicine?.nuocSx || ""
                                        }
                                        className="w-full border p-2 rounded py-2 leading-normal"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 ">
                                        Địa Chỉ SX
                                    </label>
                                    <input
                                        type="text"
                                        name="diaChiSx"
                                        defaultValue={
                                            selectedMedicine?.diaChiSx || ""
                                        }
                                        className="w-full border p-2 rounded py-2 leading-normal"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block mb-2 ">
                                        Phân Loại
                                    </label>
                                    <input
                                        type="text"
                                        name="phanLoai"
                                        defaultValue={
                                            selectedMedicine?.phanLoai || ""
                                        }
                                        className="w-full border p-2 rounded py-2 leading-normal"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 ">
                                        Bào Chế
                                    </label>
                                    <input
                                        type="text"
                                        name="baoChe"
                                        defaultValue={
                                            selectedMedicine?.baoChe || ""
                                        }
                                        className="w-full border p-2 rounded py-2 leading-normal"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 ">
                                        Tuổi Thọ
                                    </label>
                                    <input
                                        type="text"
                                        name="tuoiTho"
                                        defaultValue={
                                            selectedMedicine?.tuoiTho || ""
                                        }
                                        className="w-full border p-2 rounded py-2 leading-normal"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 ">
                                        Đóng Gói
                                    </label>
                                    <input
                                        type="text"
                                        name="dongGoi"
                                        defaultValue={
                                            selectedMedicine?.dongGoi || ""
                                        }
                                        className="w-full border p-2 rounded py-2 leading-normal"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block mb-2 ">
                                        Công Ty ĐK
                                    </label>
                                    <input
                                        type="text"
                                        name="congTyDk"
                                        defaultValue={
                                            selectedMedicine?.congTyDk || ""
                                        }
                                        className="w-full border p-2 rounded py-2 leading-normal"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 ">
                                        Nước ĐK
                                    </label>
                                    <input
                                        type="text"
                                        name="nuocDk"
                                        defaultValue={
                                            selectedMedicine?.nuocDk || ""
                                        }
                                        className="w-full border p-2 rounded py-2 leading-normal"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 ">
                                        Địa Chỉ ĐK
                                    </label>
                                    <input
                                        type="text"
                                        name="diaChiDk"
                                        defaultValue={
                                            selectedMedicine?.diaChiDk || ""
                                        }
                                        className="w-full border p-2 rounded py-2 leading-normal"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 ">
                                        Tá Dược
                                    </label>
                                    <input
                                        type="text"
                                        name="taDuoc"
                                        defaultValue={
                                            selectedMedicine?.taDuoc || ""
                                        }
                                        className="w-full border p-2 rounded py-2 leading-normal"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block mb-2 ">
                                        Số Quyết Định
                                    </label>
                                    <input
                                        type="text"
                                        name="soQuyetDinh"
                                        defaultValue={
                                            selectedMedicine?.soQuyetDinh || ""
                                        }
                                        className="w-full border p-2 rounded py-2 leading-normal"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 ">
                                        Phê Duyệt
                                    </label>
                                    <input
                                        type="text"
                                        name="pheDuyet"
                                        defaultValue={
                                            selectedMedicine?.pheDuyet || ""
                                        }
                                        className="w-full border p-2 rounded py-2 leading-normal"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 ">
                                        Đợt Phê Duyệt
                                    </label>
                                    <input
                                        type="text"
                                        name="dotPheDuyet"
                                        defaultValue={
                                            selectedMedicine?.dotPheDuyet || ""
                                        }
                                        className="w-full border p-2 rounded py-2 leading-normal"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 ">
                                        Tiêu Chuẩn
                                    </label>
                                    <input
                                        type="text"
                                        name="tieuChuan"
                                        defaultValue={
                                            selectedMedicine?.tieuChuan || ""
                                        }
                                        className="w-full border p-2 rounded py-2 leading-normal"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 ">
                                    Nhóm Thuốc
                                </label>
                                <input
                                    type="text"
                                    name="nhomThuoc"
                                    defaultValue={
                                        selectedMedicine?.nhomThuoc || ""
                                    }
                                    className="w-full border p-2 rounded py-2 leading-normal"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                                >
                                    Hủy
                                </button>
                                <button
                                    // onClick={handleSave}
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Lưu
                                </button>
                            </div>
                        </form>
                    )}

                    {modalMode === "delete" && userToDelete && (
                        <div>
                            <h3 className="text-xl font-bold mb-4">
                                Xác Nhận Xóa
                            </h3>
                            <p className="mb-4">
                                Bạn có chắc chắn muốn xóa thuốc{" "}
                                <strong>{userToDelete.id}</strong> (
                                {userToDelete.tenThuoc})?
                            </p>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Xác Nhận
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default MedicineManagement;
