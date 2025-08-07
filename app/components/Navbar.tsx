import React from 'react'
import {Link} from "react-router";

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/">
                <p className="uppercase text-2xl font-bold text-gradient">resumind</p>
            </Link>
            <Link to="/upload" className="primary-button w-fit capitalize">upload resume</Link>
        </nav>
    )
}
export default Navbar
