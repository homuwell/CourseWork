import React from 'react';
import axios from 'axios';
import makeToast from './Toaster';
import { withRouter, Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'

const Login = (props) => {
    const nicknameRef = React.createRef();
    const passwordRef = React.createRef();
    
    const loginUser = () => {
        const nickname = nicknameRef.current.value;
        const password = passwordRef.current.value;
        axios.post('http://localhost:8000/user/login', {
            nickname,
            password
        }).then((response) => {
            console.log(response.data);
            makeToast('success', response.data.message);
            localStorage.setItem('CC_Token', response.data.token);
            props.history.push('/dashboard');
            props.setupSocket();
        }).catch((err) => {
            makeToast('error', err.response.data.message);
        })
    };
    
    return (
        <div className='card'>
            <div className='cardHeader'>Login</div>
            <div className='cardBody'>
                <div className='inputGroup'>
                    <label htmlFor='Nickname'>Nickname</label>
                    <input
                        type='text'
                        name='nickname'
                        id='nickname'
                        placeholder='nickname'
                        ref={nicknameRef}
                    />
                </div>
                <div className='inputGroup'>
                    <label htmlFor='password'>Password</label>
                    <input
                        type='password'
                        name='password'
                        id='password'
                        placeholder='Your Password'
                        ref={passwordRef}
                    />
                </div>
                <button onClick={loginUser}>Login</button>
                <Link to='/register'>
                    <button id ='button'>Register</button>
                </Link>
            </div>
        </div>


    );
};

export default withRouter(Login);