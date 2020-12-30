
import React, {useCallback} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import LoginPage from './Pages/login';
import RegisterPage from './Pages/register';
import IndexPage from './Pages/index';
import DashboardPage from './Pages/dashboard';
import  ChatroomPage from './Pages/chatroom';
import io from 'socket.io-client';
import makeToast from './Pages/Toaster';
import PrivateRoute from './Pages/privateroute';

function App() {
    const [socket, setSocket] = React.useState(null);

    const setupSocket = useCallback( () => {
        const token = localStorage.getItem('CC_Token');
        if(token && !socket) {
            const newSocket = io('http://localhost:8000', {
                query: {
                    token: localStorage.getItem('CC_Token')
                },
            });

            newSocket.on('disconnect', () => {
                setSocket(null);
                setTimeout(setSocket, 3000);
                makeToast('error', 'Socket Disconnected!');
            });

            newSocket.on('connect', () => {
                makeToast('success', 'Socket Connected!');
            });
            setSocket(newSocket);
        }
    },[socket]);
    React.useEffect(() => {
            setupSocket();
    }, [setupSocket]);
  return <BrowserRouter>
      <Switch>
          <Route path ='/' component={IndexPage} exact />
         <Route path ='/login' render={() => <LoginPage setupSocket={setupSocket} />} exact/>
          <Route path ='/register' component={RegisterPage} exact/>
          <PrivateRoute path='/dashboard'  render={() => <DashboardPage socket={socket} />} exact />
          <PrivateRoute path ='/chatroom/:id' render={() => <ChatroomPage  socket={socket}/>} exact/>
      </Switch>
    </BrowserRouter>
}

export default App;
