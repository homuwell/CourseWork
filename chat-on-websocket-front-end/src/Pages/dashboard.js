import React, {useCallback} from 'react';
import axios from 'axios';
import {Link, useHistory} from 'react-router-dom';
import Toaster from './Toaster';

const DashboardPage = (props) => {
    const history = useHistory();
    const roomNameRef = React.useRef();
    const [chatRooms, setChatRooms] = React.useState([]);

    const getChatRooms = useCallback( () => {
        axios.get('http://localhost:8000/chatroom', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('CC_Token')}`,
            },
        }).then((response) => {
            setChatRooms(response.data);
        }).catch((err) => {
            setTimeout(getChatRooms, 3000);
        });
    },[]);

    const removeToken = () => {
        localStorage.removeItem('CC_Token');
    }

    React.useEffect(() => {
        let isMounted = true;
        if (isMounted) getChatRooms();
        return () => isMounted = false;
    },[getChatRooms]);

    const addChatRoom = useCallback( () => {
        const roomName = roomNameRef.current.value;

        axios.post('http://localhost:8000/chatroom', {
                name: roomName,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('CC_Token')}`,
                },
            }
        ).then((chatRoom) => {
            getChatRooms();
            Toaster('success', 'Room has been added!');
        }).catch((err) => {
            if (err.message === 'Chatroom with that name already exists!') {
                Toaster('error', err.message);
            } else {
                Toaster('error', 'Something went wrong and room hasn\'t been added');
            }
        })
    },[getChatRooms]);
    return (
        <div className='card'>
            <div className='cardHeader'>Chatrooms</div>
            <div className='cardBody'>
                <div className='inputGroup'>
                    <label htmlFor='chatroomName'>Chatroom Name</label>
                    <input
                        type='text'
                        name='chatroomName'
                        id='chatroomName'
                        placeholder='ChatterBox Nepal'
                        ref = {roomNameRef}
                    />
                </div>
            </div>
            <button onClick={addChatRoom}>Create Chatroom</button>
            <div className='chats'>
                {chatRooms.map((chatroom) => (
                    <div  key={chatroom._id} className='chatroom'>
                        <div>{chatroom.name}</div>
                        <Link to={{pathname: '/chatroom/' + chatroom._id, state: {name : chatroom.name} }}>
                            <div className='join'>Join</div>
                        </Link>
                    </div>
                ))}
            </div>
            <div>
                <button onClick={() => {removeToken(); history.push('/login'); props.socket.disconnect()}}>Logout</button>
            </div>
        </div>
    );
};

export default DashboardPage;