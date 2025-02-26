import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
    const [userData, setUserData] = useState(null);
    const email = localStorage.getItem("email");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:5000/users/settings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                });
                const data = await response.json();
                setUserData(data.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (email) fetchUserData();
    }, [email]);

    return (
        <div className="bg-gradient-to-br from-purple-600 to-blue-500 flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 w-[400px]">
                {userData ? (
                    <div className="flex flex-col items-center">
                        {/* Profile Image */}
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                            <img src={userData.image || "/default-avatar.png"} alt="Profile" className="w-full h-full object-cover" />
                        </div>

                        {/* Username */}
                        <h2 className="mt-4 text-xl font-semibold text-gray-800">{userData.username}</h2>

                        {/* Email */}
                        <p className="text-sm text-gray-500">{email}</p>

                        {/* Description */}
                        <p className="mt-3 text-center text-gray-600">{userData.description || "No description available."}</p>

                        {/* Account Type */}
                        <div className="mt-4 px-4 py-2 bg-gray-200 rounded-md">
                            <span className="text-gray-700 text-sm font-medium">Account Type: {userData.type}</span>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Loading...</p>
                )}
                <br />
                <br />

                    <div className="w-full fixed bottom-0 left-0 p-4 shadow-lg">
                                    <div className="max-w-md mx-auto flex flex-col gap-3">
                                        <button className="w-full bg-gray-200 text-gray-700 font-medium py-2 rounded-md hover:bg-gray-300 transition" onClick={()=>{navigate('/personal-informations')}}>
                                            Edit Personal Information
                                        </button>
                                        <button className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition" onClick={()=>{navigate('/')}}>
                                            Back to Home Screen 
                                        </button>
                                    </div>
                                </div>
                                </div>

            
            
        </div>
    );
};

export default Settings;
