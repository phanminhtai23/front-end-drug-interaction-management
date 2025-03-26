import React, { useState } from "react";
import { 
    Edit, Trash2, Eye, Plus, 
    Users, PillBottle, Layers, 
    LogOut 
} from "lucide-react";

// Hardcoded Data
const USERS = [
    {
        _id: "user1",
        username: "john_doe",
        email: "johndoe@example.com",
        full_name: "John Doe",
        role: "user",
        created_at: "2025-02-22T12:00:00Z",
    },
    {
        _id: "user2",
        username: "jane_smith",
        email: "janesmith@example.com",
        full_name: "Jane Smith",
        role: "admin",
        created_at: "2025-02-23T14:30:00Z",
    },
];

const MEDICINES = [
    {
        id: "GC-215-13",
        tenThuoc: "EtonciB1",
        hoatChat: [
            { tenHoatChat: "Vitamin B1 (Thiamin nitrat)", nongDo: "150 mg" },
        ],
        congTySx: "Công ty cổ phần dược phẩm Hà Tây",
        nuocSx: "Việt Nam",
    },
    {
        id: "MD-102-22",
        tenThuoc: "Paracetamol",
        hoatChat: [{ tenHoatChat: "Paracetamol", nongDo: "500 mg" }],
        congTySx: "Công ty dược phẩm Quốc Tế",
        nuocSx: "Việt Nam",
    },
];

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

// Reusable Modal Component
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
};

// User Management Component
const UserManagement = () => {
    const [users, setUsers] = useState(USERS);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("view"); // 'view', 'edit', 'add'
    const [searchTerm, setSearchTerm] = useState('');

    const handleView = (user) => {
        setSelectedUser(user);
        setModalMode("view");
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setModalMode("edit");
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedUser({});
        setModalMode("add");
        setIsModalOpen(true);
    };

    const handleDelete = (userId) => {
        setUsers(users.filter((user) => user._id !== userId));
    };

    const handleSave = (updatedUser) => {
        if (modalMode === "add") {
            setUsers([
                ...users,
                { ...updatedUser, _id: Date.now().toString() },
            ]);
        } else {
            setUsers(
                users.map((user) =>
                    user._id === updatedUser._id ? updatedUser : user
                )
            );
        }
        setIsModalOpen(false);
    };

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Quản Lý Người Dùng</h2>
                <button
                    onClick={handleAdd}
                    className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
                >
                    <Plus className="mr-2" /> Thêm Người Dùng
                </button>
            </div>
            
            <div className="mb-4">
                <input 
                    type="text" 
                    placeholder="Tìm kiếm người dùng..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                />
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Tên Đăng Nhập</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Quyền</th>
                        <th className="border p-2">Ngày Tạo</th>
                        <th className="border p-2">Thao Tác</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user._id}>
                            <td className="border p-2">{user.username}</td>
                            <td className="border p-2">{user.email}</td>
                            <td className="border p-2">{user.role}</td>
                            <td className="border p-2">
                                {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="border p-2">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleView(user)}
                                        className="text-blue-500"
                                    >
                                        <Eye />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="text-yellow-500"
                                    >
                                        <Edit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user._id)}
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
                {modalMode === "view" && selectedUser && (
                    <div>
                        <h3 className="text-xl font-bold mb-4">
                            Chi Tiết Người Dùng
                        </h3>
                        <p>
                            <strong>Tên Đăng Nhập:</strong>{" "}
                            {selectedUser.username}
                        </p>
                        <p>
                            <strong>Email:</strong> {selectedUser.email}
                        </p>
                        <p>
                            <strong>Tên Đầy Đủ:</strong>{" "}
                            {selectedUser.full_name}
                        </p>
                        <p>
                            <strong>Quyền:</strong> {selectedUser.role}
                        </p>
                    </div>
                )}
                {(modalMode === "edit" || modalMode === "add") && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const updatedUser = {
                                ...(selectedUser || {}),
                                username: formData.get("username"),
                                email: formData.get("email"),
                                full_name: formData.get("full_name"),
                                role: formData.get("role"),
                            };
                            handleSave(updatedUser);
                        }}
                    >
                        <h3 className="text-xl font-bold mb-4">
                            {modalMode === "edit"
                                ? "Chỉnh Sửa"
                                : "Thêm Người Dùng"}
                        </h3>
                        <div className="mb-4">
                            <label className="block mb-2">Tên Đăng Nhập</label>
                            <input
                                type="text"
                                name="username"
                                defaultValue={selectedUser?.username || ""}
                                className="w-full border p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                defaultValue={selectedUser?.email || ""}
                                className="w-full border p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Tên Đầy Đủ</label>
                            <input
                                type="text"
                                name="full_name"
                                defaultValue={selectedUser?.full_name || ""}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Quyền</label>
                            <select
                                name="role"
                                defaultValue={selectedUser?.role || "user"}
                                className="w-full border p-2 rounded"
                            >
                                <option value="user">Người Dùng</option>
                                <option value="admin">Quản Trị</option>
                            </select>
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

// Medicine Management Component
const MedicineManagement = () => {
    const [medicines, setMedicines] = useState(MEDICINES);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("view");
    const [searchTerm, setSearchTerm] = useState('');

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
        setSelectedMedicine({});
        setModalMode("add");
        setIsModalOpen(true);
    };

    const handleDelete = (medicineId) => {
        setMedicines(medicines.filter((med) => med.id !== medicineId));
    };

    const handleSave = (updatedMedicine) => {
        if (modalMode === "add") {
            setMedicines([
                ...medicines,
                { ...updatedMedicine, id: `MD-${Date.now()}` },
            ]);
        } else {
            setMedicines(
                medicines.map((med) =>
                    med.id === updatedMedicine.id ? updatedMedicine : med
                )
            );
        }
        setIsModalOpen(false);
    };

    const filteredMedicines = medicines.filter(med => 
        med.tenThuoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.hoatChat[0].tenHoatChat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.congTySx.toLowerCase().includes(searchTerm.toLowerCase())
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

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Mã Thuốc</th>
                        <th className="border p-2">Tên Thuốc</th>
                        <th className="border p-2">Hoạt Chất</th>
                        <th className="border p-2">Công Ty SX</th>
                        <th className="border p-2">Thao Tác</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMedicines.map((med) => (
                        <tr key={med.id}>
                            <td className="border p-2">{med.id}</td>
                            <td className="border p-2">{med.tenThuoc}</td>
                            <td className="border p-2">
                                {med.hoatChat[0].tenHoatChat}
                            </td>
                            <td className="border p-2">{med.congTySx}</td>
                            <td className="border p-2">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleView(med)}
                                        className="text-blue-500"
                                    >
                                        <Eye />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(med)}
                                        className="text-yellow-500"
                                    >
                                        <Edit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(med.id)}
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
                {modalMode === "view" && selectedMedicine && (
                    <div>
                        <h3 className="text-xl font-bold mb-4">
                            Chi Tiết Thuốc
                        </h3>
                        <p>
                            <strong>Mã Thuốc:</strong> {selectedMedicine.id}
                        </p>
                        <p>
                            <strong>Tên Thuốc:</strong>{" "}
                            {selectedMedicine.tenThuoc}
                        </p>
                        <p>
                            <strong>Hoạt Chất:</strong>{" "}
                            {selectedMedicine.hoatChat[0].tenHoatChat} -{" "}
                            {selectedMedicine.hoatChat[0].nongDo}
                        </p>
                        <p>
                            <strong>Công Ty SX:</strong>{" "}
                            {selectedMedicine.congTySx}
                        </p>
                        <p>
                            <strong>Nước SX:</strong> {selectedMedicine.nuocSx}
                        </p>
                    </div>
                )}
                {(modalMode === "edit" || modalMode === "add") && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const updatedMedicine = {
                                ...(selectedMedicine || {}),
                                tenThuoc: formData.get("tenThuoc"),
                                hoatChat: [
                                    {
                                        tenHoatChat: formData.get("hoatChat"),
                                        nongDo: formData.get("nongDo"),
                                    },
                                ],
                                congTySx: formData.get("congTySx"),
                                nuocSx: formData.get("nuocSx"),
                            };
                            handleSave(updatedMedicine);
                        }}
                    >
                        <h3 className="text-xl font-bold mb-4">
                            {modalMode === "edit" ? "Chỉnh Sửa" : "Thêm Thuốc"}
                        </h3>
                        <div className="mb-4">
                            <label className="block mb-2">Tên Thuốc</label>
                            <input
                                type="text"
                                name="tenThuoc"
                                defaultValue={selectedMedicine?.tenThuoc || ""}
                                className="w-full border p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Hoạt Chất</label>
                            <input
                                type="text"
                                name="hoatChat"
                                defaultValue={
                                    selectedMedicine?.hoatChat?.[0]
                                        ?.tenHoatChat || ""
                                }
                                className="w-full border p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Nồng Độ</label>
                            <input
                                type="text"
                                name="nongDo"
                                defaultValue={
                                    selectedMedicine?.hoatChat?.[0]?.nongDo ||
                                    ""
                                }
                                className="w-full border p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Công Ty SX</label>
                            <input
                                type="text"
                                name="congTySx"
                                defaultValue={selectedMedicine?.congTySx || ""}
                                className="w-full border p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Nước SX</label>
                            <input
                                type="text"
                                name="nuocSx"
                                defaultValue={selectedMedicine?.nuocSx || ""}
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

// Drug Interaction Management Component
const DrugInteractionManagement = () => {
    const [interactions, setInteractions] = useState(DRUG_INTERACTIONS);
    const [selectedInteraction, setSelectedInteraction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("view");
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredInteractions = interactions.filter(interaction => 
        interaction.TenThuoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interaction.HoatChat_1.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interaction.HoatChat_2.toLowerCase().includes(searchTerm.toLowerCase())
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
                            <td className="border p-2">
                                {interaction.TenThuoc}
                            </td>
                            <td className="border p-2">
                                {interaction.HoatChat_1}
                            </td>
                            <td className="border p-2">
                                {interaction.HoatChat_2}
                            </td>
                            <td className="border p-2">
                                {interaction.MucDoNghiemTrong}
                            </td>
                            <td className="border p-2">
                                <div className="flex space-x-2">
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

const AdminDashboard = () => {
    const [selectedKey, setSelectedKey] = useState("1");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const renderContent = () => {
        switch (selectedKey) {
            case "1":
                return <UserManagement />;
            case "2":
                return <MedicineManagement />;
            case "3":
                return <DrugInteractionManagement />;
            default:
                return <UserManagement />;
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Enhanced Sidebar */}
            <div className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col">
                <div className="h-16 flex items-center justify-center bg-gray-900 text-lg font-semibold border-b border-gray-700">
                    Quản Trị Hệ Thống
                </div>
                <nav className="flex-grow p-4">
                    <ul className="space-y-2">
                        <li
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                selectedKey === "1"
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-700 hover:text-blue-300"
                            }`}
                            onClick={() => setSelectedKey("1")}
                        >
                            <Users className="mr-3" />
                            Quản Lý Người Dùng
                        </li>
                        <li
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                selectedKey === "2"
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-700 hover:text-blue-300"
                            }`}
                            onClick={() => setSelectedKey("2")}
                        >
                            <PillBottle className="mr-3" />
                            Quản Lý Thuốc
                        </li>
                        <li
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                selectedKey === "3"
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-700 hover:text-blue-300"
                            }`}
                            onClick={() => setSelectedKey("3")}
                        >
                            <Layers className="mr-3" />
                            Tương Tác Thuốc
                        </li>
                    </ul>
                </nav>

                {/* Logout Section */}
                <div className="p-4 border-t border-gray-700">
                    <button
                        className="flex items-center w-full p-3 hover:bg-white hover:text-black rounded-lg"
                        onClick={() => {
                            // Handle logout logic
                            alert("Đăng xuất");
                        }}
                    >
                        <LogOut className="mr-3 text-red-500" />
                        Đăng Xuất
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-gray-100 flex flex-col">
                {/* Main Content */}
                <main className="p-6 flex-grow">{renderContent()}</main>
            </div>
        </div>
    );
};

export default AdminDashboard;