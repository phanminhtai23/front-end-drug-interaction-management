import React, { useState, useEffect } from "react";

const UploadWidget = () => {
    const [images, setImages] = useState([]); // Lưu nhiều ảnh
    const [pdfUrl, setPdfUrl] = useState(""); // Lưu PDF (chỉ 1 file)
    const [pdfName, setPdfName] = useState(""); // Lưu tên file PDF

    useEffect(() => {
        if (!window.cloudinary) return;

        const myWidget = window.cloudinary.createUploadWidget(
            {
                cloudName: process.env.REACT_APP_CLOUD_NAME,
                uploadPreset: process.env.REACT_APP_UPLOAD_PRESET,
                cropping: false,
                multiple: true, // Cho phép chọn nhiều file
                sources: ["local", "url", "camera"],
            },
            (error, result) => {
                if (!error && result.event === "success") {
                    const url = result.info.secure_url;
                    const format = result.info.format;
                    const fileName =
                        result.info.original_filename + "." + format;

                    if (format === "pdf") {
                        setPdfUrl(url); // Lưu link PDF
                        setPdfName(fileName); // Lưu tên file PDF
                        setImages([]); // Xóa danh sách ảnh (chỉ có thể có 1 PDF)
                    } else {
                        setImages((prevImages) => [...prevImages, url]);
                    }
                }
            }
        );

        window.myCloudinaryWidget = myWidget;
    }, []);

    // Hàm xóa ảnh khỏi danh sách
    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    // Hàm xóa file PDF
    const removePdf = () => {
        setPdfUrl("");
        setPdfName("");
    };

    return (
        <div className="flex flex-col space-y-2 items-start">
            {/* Nút tải lên */}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    window.myCloudinaryWidget.open();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 transition"
            >
                Tải file lên
            </button>

            {/* Hiển thị danh sách ảnh (theo hàng ngang) */}
            {images.length > 0 && (
                <div className="flex flex-wrap gap-2 w-full">
                    {images.map((img, index) => (
                        <div key={index} className="relative">
                            {/* Nút X để xóa ảnh */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    removeImage(index);
                                }}
                                className="absolute top-1 right-1 bg-black text-white w-5 h-5 flex items-center justify-center rounded-full text-xs shadow-md hover:bg-gray-800 transition"
                            >
                                ✖
                            </button>

                            <img
                                src={img}
                                alt={`Uploaded ${index}`}
                                className="w-24 h-24 object-contain rounded-md shadow-xl"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Nếu có PDF, hiển thị file name */}
            {pdfUrl && (
                <div className="flex items-center space-x-2 bg-gray-200 px-3 py-2 rounded-md shadow-md">
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-800 font-semibold truncate max-w-[200px]"
                    >
                        📄 {pdfName}
                    </a>
                    {/* Nút X để xóa file PDF */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            removePdf();
                        }}
                        className="bg-black text-white w-5 h-5 flex items-center justify-center rounded-full text-xs shadow-md hover:bg-gray-800 transition"
                    >
                        ✖
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadWidget;
