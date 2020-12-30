import React from 'react';

const Index = (props) => {
    React.useEffect(() => {
        const token = localStorage.getItem('CC_Token');
        if (!token) {
            props.history.push('/login');
        } else {
            props.history.push('/dashboard');
        }
    }, [props.history]);
    return (
        <div>
            
        </div>
    );
};

export default Index;