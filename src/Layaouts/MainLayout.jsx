import React from 'react'
import Header from '../components/crossSections/header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/crossSections/Footer'

function MainLayout() {
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}

export default MainLayout