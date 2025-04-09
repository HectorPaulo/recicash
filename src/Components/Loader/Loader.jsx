import React from 'react';

const Loader = ({ 
    size = "md", 
    fullScreen = false,
    message = "", 
    className = "" 
}) => {
    // Configurar tamaños para diferentes variantes
    const sizeClasses = {
        sm: "w-16 h-16 border-4 text-2xl",
        md: "w-20 h-20 border-6 text-3xl",
        lg: "w-28 h-28 border-8 text-4xl",
        xl: "w-36 h-36 border-10 text-5xl",
        xxl: "w-44 h-44 border-12 text-6xl"
    };

    const Spinner = () => (
        <div className={`${sizeClasses[size]} animate-spin border-gray-300 flex items-center justify-center border-t-green-700 rounded-full ${className}`}>
            {/* <svg 
                width="2em" 
                height="2em" 
                className="animate-ping" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 -960 960 960" 
                fill="green"
            >
                <path d="M480-100q-79 0-148-30t-120.5-81.5Q160-263 130-332t-30-148q0-79 30-148t81.5-120.5Q263-800 332-830t148-30v-100l160 160-160 160v-100q-108 0-184 76t-76 184q0 66 30.5 122.5T332-266q16-28 47.5-47.5T452-338q-3-21-8-42t-12-39q-11 9-24 14t-28 5q-33 0-56.5-23.5T300-480v-40q0-17-5.5-32T280-580q50-1 89 9 34 9 62 29.5t29 61.5q0 9-1.5 16.5T453-448q-13-10-26-18t-27-14q17 13 39 40t41 64q20-49 50-96.5t70-87.5q-23 16-44 34t-41 38q-7-11-11-24.5t-4-27.5q0-42 29-71t71-29h40q23 0 38-6t25-14q11-9 17-20 4 67-7 120-9 45-34 82.5T600-440q-15 0-28.5-4T547-455q-7 19-16 50.5T517-337q38 7 67 26t44 45q51-35 81.5-91T740-480h120q0 79-30 148t-81.5 120.5Q697-160 628-130t-148 30Z"/>
            </svg> */}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                <Spinner />
                {message && <p className="text-white mt-4 text-lg font-medium">{message}</p>}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <Spinner />
            {message && <p className="mt-2 text-gray-600">{message}</p>}
        </div>
    );
};

export default Loader;