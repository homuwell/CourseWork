import React from 'react';
import axios from 'axios';
import makeToast from './Toaster';
const Register = (props) => {
    const nicknameRef = React.createRef();
    const nameRef = React.createRef();
    const surnameRef = React.createRef();
    const passwordRef = React.createRef();
    const registerUser = () => {
        const nickname = nicknameRef.current.value;
        const password = passwordRef.current.value;
        const name = nameRef.current.value;
        const surname = surnameRef.current.value;
        axios.post('http://localhost:8000/user/register',{
            nickname,
            name,
            surname,
            password
        }).then((response) => {
            console.log(response.data);
            makeToast('success', response.data.message);
            props.history.push('/login');
        }).catch((err) => {
            makeToast('error', err.response.data.message);
        })
    }
    return (
        <div>
            <div className='card'>
                <div className='cardHeader'>Register</div>
                <div className='cardBody'>
                    <div className='inputGroup'>
                        <label htmlFor='nickname'>Nickname</label>
                        <input type='text'
                               name='nickname'
                               id='nickname'
                               placeholder='NickName'
                               ref={nicknameRef}
                        />
                    </div>
                    <div className='inputGroup'>
                        <label htmlFor='Name'>Name:</label>
                        <input type='text'
                               name='name'
                               id='name'
                               placeholder='Name'
                               ref={nameRef}
                        />
                    </div>
                    <div className='inputGroup'>
                        <label htmlFor='surname'>Surname:</label>
                        <input type='text'
                               name='surname'
                               id='surname'
                               placeholder='Surname'
                               ref={surnameRef}
                        />
                    </div>
                    <div className='inputGroup'>
                        <label htmlFor='password'>Password:</label>
                        <input type='password'
                               name='password'
                               id='password'
                               placeholder='Password'
                               ref={passwordRef}
                        />
                    </div>
                    <button onClick={registerUser}>Зарегистрироваться</button>
                </div>
            </div>
        </div>
    );
};

export default Register;