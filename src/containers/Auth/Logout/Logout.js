import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import * as authAction from '../../../store/actions/auth';

class Logout extends Component{
    componentDidMount(){
        this.props.onLogout();
    }

    render(){
        return (
           <Redirect to='/'/>
        );
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        onLogout: () => dispatch(authAction.logout())
    };
};

export default connect(null, mapDispatchToProps) (Logout);

