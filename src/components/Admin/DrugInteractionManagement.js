import React, { useState } from "react";
import Modal from "./Modal";
import {
    Edit,
    Trash2,
    Eye,
    Plus,
} from "lucide-react";

const DRUG_INTERACTIONS = [
    {
        TenThuoc: "Acehasan 200",
        HoatChat_1: "Acetylcystein",
        HoatChat_2: "Tetracyclin hydroclorid",
        MucDoNghiemTrong: "Trung bình",
        CanhBaoTuongTacThuoc:
            "Acetylcystein có thể làm giảm hấp thu của tetracyclin hydroclorid.",
    },
    {
        TenThuoc: "Aspirin",
        HoatChat_1: "Aspirin",
        HoatChat_2: "Warfarin",
        MucDoNghiemTrong: "Cao",
        CanhBaoTuongTacThuoc:
            "Aspirin có thể tăng nguy cơ chảy máu khi dùng chung với Warfarin.",
    },
];

// Drug Interaction Management Component
const DrugInteractionManagement = () => {
    const [interactions, setInteractions] = useState(DRUG_INTERACTIONS);
    const [selectedInteraction, setSelectedInteraction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("view");
    const [searchTerm, setSearchTerm] = useState("");

    const handleView = (interaction) => {
        setSelectedInteraction(interaction);
        setModalMode("view");
        setIsModalOpen(true);
    };

    const handleEdit = (interaction) => {
        setSelectedInteraction(interaction);
        setModalMode("edit");
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedInteraction({});
        setModalMode("add");
        setIsModalOpen(true);
    };

    const handleDelete = (tenThuoc) => {
        setInteractions(
            interactions.filter(
                (interaction) => interaction.TenThuoc !== tenThuoc
            )
        );
    };

    const handleSave = (updatedInteraction) => {
        if (modalMode === "add") {
            setInteractions([...interactions, updatedInteraction]);
        } else {
            setInteractions(
                interactions.map((interaction) =>
                    interaction.TenThuoc === updatedInteraction.TenThuoc
                        ? updatedInteraction
                        : interaction
                )
            );
        }
        setIsModalOpen(false);
    };

    const filteredInteractions = interactions.filter(
        (interaction) =>
            interaction.TenThuoc.toLowerCase().includes(
                searchTerm.toLowerCase()
            ) ||
            interaction.HoatChat_1.toLowerCase().includes(
                searchTerm.toLowerCase()
            ) ||
            interaction.HoatChat_2.toLowerCase().includes(
                searchTerm.toLowerCase()
            )
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Quản Lý Tương Tác Thuốc</h2>
                <button
                    onClick={handleAdd}
                    className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
                >
                    <Plus className="mr-2" /> Thêm Tương Tác
                </button>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm tương tác thuốc..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                />
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Tên Thuốc</th>
                        <th className="border p-2">Hoạt Chất 1</th>
                        <th className="border p-2">Hoạt Chất 2</th>
                        <th className="border p-2">Mức Độ</th>
                        <th className="border p-2">Thao Tác</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredInteractions.map((interaction) => (
                        <tr key={interaction.TenThuoc}>
                            <td className="border p-2 text-center">
                                {interaction.TenThuoc}
                            </td>
                            <td className="border p-2 text-center">
                                {interaction.HoatChat_1}
                            </td>
                            <td className="border p-2 text-center">
                                {interaction.HoatChat_2}
                            </td>
                            <td className="border p-2 text-center">
                                {interaction.MucDoNghiemTrong}
                            </td>
                            <td className="border p-2 text-center">
                                <div className="flex justify-center items-center space-x-2">
                                    <button
                                        onClick={() => handleView(interaction)}
                                        className="text-blue-500"
                                    >
                                        <Eye />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(interaction)}
                                        className="text-yellow-500"
                                    >
                                        <Edit />
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDelete(interaction.TenThuoc)
                                        }
                                        className="text-red-500"
                                    >
                                        <Trash2 />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {modalMode === "view" && selectedInteraction && (
                    <div>
                        <h3 className="text-xl font-bold mb-4">
                            Chi Tiết Tương Tác Thuốc
                        </h3>
                        <p>
                            <strong>Tên Thuốc:</strong>{" "}
                            {selectedInteraction.TenThuoc}
                        </p>
                        <p>
                            <strong>Hoạt Chất 1:</strong>{" "}
                            {selectedInteraction.HoatChat_1}
                        </p>
                        <p>
                            <strong>Hoạt Chất 2:</strong>{" "}
                            {selectedInteraction.HoatChat_2}
                        </p>
                        <p>
                            <strong>Mức Độ Nghiêm Trọng:</strong>{" "}
                            {selectedInteraction.MucDoNghiemTrong}
                        </p>
                        <p>
                            <strong>Cảnh Báo:</strong>{" "}
                            {selectedInteraction.CanhBaoTuongTacThuoc}
                        </p>
                    </div>
                )}
                {(modalMode === "edit" || modalMode === "add") && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const updatedInteraction = {
                                ...(selectedInteraction || {}),
                                TenThuoc: formData.get("TenThuoc"),
                                HoatChat_1: formData.get("HoatChat_1"),
                                HoatChat_2: formData.get("HoatChat_2"),
                                MucDoNghiemTrong:
                                    formData.get("MucDoNghiemTrong"),
                                CanhBaoTuongTacThuoc: formData.get(
                                    "CanhBaoTuongTacThuoc"
                                ),
                            };
                            handleSave(updatedInteraction);
                        }}
                    >
                        <h3 className="text-xl font-bold mb-4">
                            {modalMode === "edit"
                                ? "Chỉnh Sửa"
                                : "Thêm Tương Tác Thuốc"}
                        </h3>
                        <div className="mb-4">
                            <label className="block mb-2">Tên Thuốc</label>
                            <input
                                type="text"
                                name="TenThuoc"
                                defaultValue={
                                    selectedInteraction?.TenThuoc || ""
                                }
                                className="w-full border p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Hoạt Chất 1</label>
                            <input
                                type="text"
                                name="HoatChat_1"
                                defaultValue={
                                    selectedInteraction?.HoatChat_1 || ""
                                }
                                className="w-full border p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Hoạt Chất 2</label>
                            <input
                                type="text"
                                name="HoatChat_2"
                                defaultValue={
                                    selectedInteraction?.HoatChat_2 || ""
                                }
                                className="w-full border p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">
                                Mức Độ Nghiêm Trọng
                            </label>
                            <select
                                name="MucDoNghiemTrong"
                                defaultValue={
                                    selectedInteraction?.MucDoNghiemTrong || ""
                                }
                                className="w-full border p-2 rounded"
                            >
                                <option value="Thấp">Thấp</option>
                                <option value="Trung bình">Trung bình</option>
                                <option value="Cao">Cao</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">
                                Cảnh Báo Tương Tác
                            </label>
                            <textarea
                                name="CanhBaoTuongTacThuoc"
                                defaultValue={
                                    selectedInteraction?.CanhBaoTuongTacThuoc ||
                                    ""
                                }
                                className="w-full border p-2 rounded"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Lưu
                        </button>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default DrugInteractionManagement;
