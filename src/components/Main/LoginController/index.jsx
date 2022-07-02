import React, { useState } from 'react';
import LoginView from '../LoginComponent';
import { apiAcc } from '../../../api/apiConnect';
import {toastFail} from '../../../helper/Notification/utils'
import { postLogin } from '../../../api/actions';

const Login = (props) => {
    const { setLoading, loginSuccess } = props;
    const [user, setUser] = useState({ username: '', password: '' });
    const handleLogin = () => {
        setLoading(true);
        postLogin(user)
            .then((res) => {
                console.log(res.data.data)
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('token', res?.data.data.jwtToken);
                localStorage.setItem('username', user.username);
                localStorage.setItem('company', res?.data.data.accountInfo.companyId);
                localStorage.setItem('id', res?.data.data?.accountInfo?.id);
                localStorage.setItem('userType', res?.data.data.accountInfo.userType)
                localStorage.setItem('fullName', res?.data.data.accountInfo.fullName)
                res?.data.data.accountInfo.roles.length > 0 ? localStorage.setItem('roleId', res?.data.data.accountInfo.roles[0].id) : localStorage.setItem('roleId', '2')
                setLoading(false)
                loginSuccess()
            })
            .catch((err) => {
                setLoading(false);
                if(err.request.status === 400) {
                    toastFail('Tên đăng nhập hoặc mật khẩu không đúng')
                } else if(err.request.status === 500) {
                    toastFail('Không có phản hồi từ máy chủ')
                } else {
                    toastFail('Không thể kết nối tới máy chủ')
                }
            });
    };

    const handleKeyEnter = (e) => {
        if(e.key === 'Enter') {
            handleLogin()
        }
    }

    return (
        <LoginView 
            postLogin={handleLogin} 
            setUser={setUser} 
            user={user} 
            handleKeyEnter={handleKeyEnter}
        />
    );
};

export default Login;
