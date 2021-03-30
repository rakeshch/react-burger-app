import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './Layout.module.css';
import Aux from '../Aux/Aux';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
    state = {
        showSideDrawer: false
    };

    sideDrawerToggleHandler=()=>{
        const currentstate = this.state.showSideDrawer;
        this.setState({ showSideDrawer: !currentstate })
    }

    sideDrawerClosedHandler=()=>{
        //this.setState({showSideDrawer: !this.state.showSideDrawer}); this may fail because this.state might not be the actual current value
        this.setState((prevState) => { return {showSideDrawer: !prevState.showSideDrawer }}
        );
    }

    render(){
        return (
            <Aux>
                <Toolbar 
                    isAuth={this.props.isAuthenticated}
                    drawerToogleClicked={this.sideDrawerToggleHandler}/>
                <SideDrawer 
                    isAuth={this.props.isAuthenticated}
                    open={this.state.showSideDrawer}
                    closed={this.sideDrawerClosedHandler}/>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        );
    }   
}

const mapStateToProps = state =>{
    return{
        isAuthenticated: state.auth.token != null
    };
};

export default connect(mapStateToProps) (Layout);