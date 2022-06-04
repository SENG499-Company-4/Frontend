import React from 'react';
import ErrorImage from 'images/404.png';
import Button from '@mui/material/Button';

function ErrorPage() {
    return (
        <div className='Wraper' style={{textAlign: 'center' }}>
            <div> <img src={ErrorImage} alt='404'/> </div>
            <div> <h2>This Page is Lost in the Wind</h2> </div>
            <br />
            <Button variant='text' href='/'>Back to Home Page</Button>
        </div>


    )
}

export default ErrorPage;