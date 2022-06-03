import React from 'react'
import './Header.css';
import { Link } from "react-router-dom";

function Header() {

    return (
        <div className='header'>
            <Link to='/'>
                <img className='header_logo' src='https://mpng.subpng.com/20180613/to/kisspng-university-of-victoria-camosun-college-royal-roads-dynamic-lines-5b20e48b52e7d5.6938109015288823153396.jpg' />
            </Link>
            <div className='header_nav'>
                <div className='header_option'>
                    <span className='header_optionLineOne'>Hello Guest</span>
                    <span className='header_optionLineTwo'>Sign In</span>
                </div>
                <div className='header_option'>
                    <span className='header_optionLineOne'>Account</span>
                    <span className='header_optionLineTwo'>Profile</span>
                </div>
                <div className='header_option'>
                    <span className='header_optionLineOne'>Schedule</span>
                    <span className='header_optionLineTwo'>Account</span>
                </div>
                <Link to='/checkout'>
                    <div className='header_optionBasket'>

                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Header