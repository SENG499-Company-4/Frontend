import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

function Register() {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [verified, setVerified] = useState(0); // 0 is initial, 1 is success, -1 is failure

    const createAccount = (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        if (password === verifyPassword) {
            console.log('Passwords match')
            setVerified(1)
        }
        else {
            setVerified(-1)
            setEmail('')
            setUsername('')
            setPassword('')
            setVerifyPassword('')
        }
    }

    return (
        <Box
            component="form"
            sx={{
                width: 300,
                height: 300,
            }}
            m='auto'
            justifyContent='center'
            noValidate
            autoComplete="off"
        >
            <div className='register'>
                <div className='register_container'>
                    <h1>Create an Account</h1>
                    {verified === -1 ? <h4>Passwords do not match, try again.</h4> : ''}
                    <form>
                        <h5>UVIC Email</h5>
                        <TextField
                            id="outlined-required"
                            label="UVic Email"
                            style={{ width: '100%' }}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <h5>Username</h5>
                        <TextField
                            id="outlined-required"
                            label="Use your UVic ID"
                            style={{ width: '100%' }}
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                        <h5>Password</h5>
                        <TextField
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            style={{ width: '100%' }}
                            value={password}
                            onChange={p => setPassword(p.target.value)}
                        />
                        <h5> Verify Password</h5>
                        <TextField
                            id="outlined-password-input"
                            label="Verify Password"
                            type="password"
                            style={{ width: '100%' }}
                            value={verifyPassword}
                            onChange={p => setVerifyPassword(p.target.value)}
                        />
                        <Button variant="contained" style={{ width: '100%', height: 60, marginTop: 40 }} onClick={createAccount}>Create a Scheduler account</Button>
                    </form>
                </div>
            </div >
        </Box >
    )
}

export default Register