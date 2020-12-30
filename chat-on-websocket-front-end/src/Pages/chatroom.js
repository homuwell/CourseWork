import React from 'react';
import {useCallback} from 'react';
import {withRouter, Link,} from 'react-router-dom';
import axios from 'axios';
import Moment from 'react-moment';
const Chatroom = ({match, socket,location}) => {
    const chatroomId = match.params.id;
    const {name} = location.state;
    const messageRef = React.useRef();
    const [userId,setUserId] = React.useState('');
    const [users,setUsers] = React.useState([]);
    const [messages, setMessages] = React.useState([] );

    const getHistory = useCallback(() => {
        if(socket) {
            socket.emit('getHistory', {
                chatroomId
            })
        }
    },[chatroomId,socket]);

    const getUsers = useCallback(() => {
            axios.post('http://localhost:8000/chatroom/users', {

                    chatroomId: chatroomId,

                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('CC_Token')}`,
                    },
                }
            ).then((response) => {
                setUsers(response.data);
            }).catch((err) => {
                console.log(`error: ${err.message}`)

            });
    }, [chatroomId]);

    const sendMessage = () => {
        if (socket) {
            socket.emit('chatroomMessage', {
                chatroomId,
                message: messageRef.current.value,
                data: Date.now(),
            });
            messageRef.current.value = '';
        }
    }

    React.useEffect(  () => {
        let isMounted = true;
            const token = localStorage.getItem('CC_Token');
            if (token) {
                if (isMounted) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    setUserId(payload.id);
                }
            }
            if (socket) {
                socket.on('newMessage', (message) => {
                    if (isMounted) {
                        const newMessages = [...messages, message];
                        setMessages(newMessages);
                    }
                })
            }
        return () => isMounted = false;
    }, [messages,socket]);


    React.useEffect( () => {
        let isMounted = true;

        if(socket) {
            socket.on('updateUsers',() => {
                if (isMounted) getUsers();
            })
        }
        return () => isMounted = false;
    },[users,socket,getUsers])

    React.useEffect(() => {
        let isMounted = true;
        if(isMounted) {
            getHistory();
            getUsers();
            axios.post('http://localhost:8000/chatroom/room', {

                    chatroomId: chatroomId,

                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('CC_Token')}`,
                    },
                }
            ).then((response) => {
                if(isMounted) {
                    setMessages(response.data);
                }
            }).catch((err) => {
                console.log('Something went wrong');

            });
            if (socket) {
                socket.emit('JoinRoom', {
                    chatroomId,
                });
            }
        }
        return () => {
            isMounted = false;
            if (socket) {
                socket.emit('leaveRoom', {
                    chatroomId,
                })
            }
        }

    }, [chatroomId, getHistory,getUsers,socket]);

    return (
        <div className='chatroomPage'>
            <div className='users'>
                <Link to='/dashboard'>
                    <button >Back</button>
                </Link>
                <div className='usersHeader'>
                    Users:
                </div>
                {users.map((user,i) => (
                    <div key={i} className='user'>
                        {user.nickname}
                        <div
                             className={ user.is_online === true ? 'online' : 'offline'}>
                        </div>
                    </div>
                    ))}
            </div>
            <div className='chatroomSection'>
                <div className='cardHeader'>
                    {name}
                </div>
                    <div className='chatroomContent'>
                        <div className='chatroomMessages'>
                            {messages.map((message, i) => (
                                <div key={i} className='message'>
                                    <div className='date'>
                                        <Moment  interval={1000} format = 'DD/MM/YYYY hh:mm a'>{message.date}</Moment>
                                    </div>
                                <span className={
                                    userId === message.userId ? 'ownMessage' : 'otherMessage'}>
                                    {message.name}</span>{' '}
                                    <div className='msg'>
                                        {message.message} {' '}
                                    </div>
                                </div>
                            ))}
                        </div>
                    <div className='chatroomActions'>
                        <div>
                            <input type='text'
                                   name='message'
                                   placeholder='Say something!'
                                   ref={messageRef}
                            />
                        </div>
                        <div>
                            <button className='join' onClick={sendMessage}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default withRouter(Chatroom);