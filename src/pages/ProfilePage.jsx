import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-base-200">
      <div className="max-w-sm w-full bg-gray-500 text-gray-800  rounded-lg p-4 space-y-4 pt-10">
        <div className="text-center ">
          <h1 className="text-lg text-white font-semibold">Profile</h1>
          <p className="mt-1 text-sm text-white">Your profile information</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <img
              src={selectedImg || authUser.profilePic || "/avatar.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-300"
            />
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-1 rounded-full cursor-pointer transition-all duration-200 ${
                isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
              }`}
            >
              <Camera className="w-4 h-4 text-base-200" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-xs text-white">
            {isUpdatingProfile
              ? "Uploading..."
              : "Click the camera icon to update your photo"}
          </p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="text-xs text-white flex items-center gap-1">
              <User className="w-3 h-3" />
              Full Name
            </div>
            <p className="px-3 py-2 text-white text-sm bg-base-200 rounded-lg border">
              {authUser?.fullName}
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-white flex items-center gap-1">
              <Mail className="w-3 h-3" />
              Email Address
            </div>
            <p className="px-3 py-2 text-white text-sm bg-base-200 rounded-lg border">
              {authUser?.email}
            </p>
          </div>
        </div>

        <div className="bg-base-300 text-white rounded-lg p-4">
          <h2 className="text-sm font-medium mb-3">Account Information</h2>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b text-white border-gray-700">
              <span>Member Since</span>
              <span>{authUser.createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex text-white items-center justify-between py-1">
              <span>Account Status</span>
              <span className="text-green-500 text-sm">🟢  Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
