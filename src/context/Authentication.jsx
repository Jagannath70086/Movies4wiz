'use client'
import {createContext,useContext, useState} from 'react'

const AuthenticationContext = createContext(null)

export const AuthenticationProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState({'name':'','email':''})
    
    return (
        <AuthenticationContext.Provider
        value={{
            isAuthenticated,
            setIsAuthenticated,
            user,
            setUser
        }}
        >{children}
        </AuthenticationContext.Provider>
    )
}

export const Authentication = () => {
    const context = useContext(AuthenticationContext);
    if (context === undefined) {
        console.log('Authentication must be used within an AuthenticationProvider')
    }
    return context
}
