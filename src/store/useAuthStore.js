import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import { data } from "react-router-dom";
import toast from "react-hot-toast";
import { io } from "socket.io-client"


const BASE_URL = "https://message-chat-app-backend.vercel.app/"


export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/api/auth/check')
            set({ authUser: res.data })

            get().connectSocket()
        } catch (error) {
            console.log("Error in checkAuth : ", error)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true })

        try {
            const res = await axiosInstance.post('/api/auth/signup', data)
            set({ authUser: res.data })
            toast.success("Account created successfully")
            sessionStorage.setItem("token", res.data.token);


        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.get('/api/auth/logout');
            sessionStorage.removeItem("token"); // ✅ remove token
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    },
    


    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstance.post('/api/auth/login', data)
            set({ authUser: res.data })
            toast.success("Logged in successfully")
            sessionStorage.setItem("token", res.data.token);


            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isLoggingIn: false })
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.put('/api/auth/update-profile', data)
            set({ authUser: res.data })
            toast.success("Profile updated successfully")
        } catch (error) {
            console.log("error in update profile frontend function : ", error)
            toast.error(error.response.data.message)
        } finally {
            set({ isUpdatingProfile: false })
        }
    },

    connectSocket: () => {
        const { authUser } = get()
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL,{
            query:{
                userId: authUser._id,
            },
        })
        socket.connect();

        set({socket:socket})

        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds})
        })
    },
    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect()
     },



}))