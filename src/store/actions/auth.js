import * as actiontTypes from './actionTypes';
import axios from 'axios';

export const authStart = () =>{
    return {
        type: actiontTypes.AUTH_START
    };
};

export const authSuccess = (userId, token) => {
    return {
        type: actiontTypes.AUTH_SUCCESS,
        userId: userId,
        token: token
    };
};

export const authFail = (error) =>{
    return {
        type: actiontTypes.AUTH_FAIL,
        error: error
    };
};

export const logout=()=>{
    //remove local storage data
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return {
        type: actiontTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeOut = (expirationTime) =>{
    return dispatch =>{
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime*1000); //value is 3600, timeout convert to secs
    }
}

export const auth = (email, password, isSignUp) =>{
    return dispatch =>{
        dispatch(authStart());
        const authData ={
            email: email,
            password: password,
            returnSecureToken: true
        }
        //default URL as signup
        let url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCVNs5bC9Pol6kczlITc3BpUDV5ey2ffCY";
        if(!isSignUp)
        {
            url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCVNs5bC9Pol6kczlITc3BpUDV5ey2ffCY";
        }
        axios.post(url, authData)
        .then(response=>{
           // console.log(response);
            //using localstorage to persist session token
            const expirationTime = new Date(new Date().getTime() + response.data.expiresIn * 1000);
            localStorage.setItem('userId', response.data.localId);
            localStorage.setItem('token', response.data.idToken);
            localStorage.setItem('expirationTime', expirationTime);
            dispatch(authSuccess(response.data.localId, response.data.idToken));
            dispatch(checkAuthTimeOut(response.data.expiresIn));
        })
        .catch(err=> {
           // console.log(err);
            dispatch(authFail(err.response.data.error));
        })   
    }
}

export const setAuthRedirectPath = (path) =>{
    return {
        type: actiontTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

export const authcheckState = () =>{
    return dispatch =>{
        const token = localStorage.getItem("token");
        if(!token){
            dispatch(logout());
        }
        else{
            const expirationTime =  new Date(localStorage.getItem("expirationTime"));
            if(expirationTime > new Date())
            {
                const userId = localStorage.getItem("userId");
                //session still not expired
                dispatch(authSuccess(userId, token));
                dispatch(checkAuthTimeOut((expirationTime.getTime() - new Date().getTime())/1000));
            }
            else
                dispatch(logout());
        }
    }
}