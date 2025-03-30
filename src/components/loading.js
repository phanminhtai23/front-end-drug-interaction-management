import React from 'react';

const LoadingPage = () => {
    return (
        <div className="flex items-center justify-center h-64 w-full bg-gray-50 rounded-lg shadow-md">
            <div className="flex flex-col items-center space-y-4">
                <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-t-4 border-blue-500 rounded-full animate-spin"></div>
                </div>
                <p className="text-lg font-medium text-gray-700">Loading...</p>
            </div>
        </div>
    );
};


const LoadingData = () => {
    return (
        <div className="flex flex-col items-center justify-center py-8 px-4 rounded-lg bg-gray-50 shadow-sm">
            <div className="flex space-x-2 mb-3">
                <div
                    className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                ></div>
                <div
                    className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                ></div>
                <div
                    className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                ></div>
            </div>
            <div className="text-center text-gray-700 font-medium">
                Đang tải dữ liệu...
            </div>
        </div>
    );
}
export { LoadingPage, LoadingData };
