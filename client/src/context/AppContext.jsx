import React, { useEffect } from 'react';
import { createContext, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

export const AppContent = createContext()

export const ApContextProvider = (props)=> {
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setIsLoggedin] = useState(false)
    const [userData, setUserData] = useState(false)

    const getAuthState = async ()=> {
        try {
            const {data} = await axios.get(backendUrl+'/api/auth/is-auth',{ withCredentials: true})
            if(data.success){
                setIsLoggedin(true)
                getUserData()
            }
             
        } catch(error) {
            toast.error(error.message)
        }
    }
    const getUserData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/user/data',{ withCredentials: true})
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }
    const value = {
        backendUrl, 
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData
    }

    useEffect(()=>{
        getAuthState();
    },[])

    return (
        <AppContent.Provider value={ value}>
            {props.children}
        </AppContent.Provider>
    )
}
 