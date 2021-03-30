import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';
import { updateObject, checkValidity } from '../../shared/utility';


class Auth extends Component{
    state={
        controls:{
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'User Name'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        isSignup: false
    }

    componentDidMount(){
        if(!this.props.buildingBurger && this.props.authRedirectPath !== '/')
        {
            this.props.onSetAuthRedirectPath();
        }
    }

    

    //perform two way binding
    inputChangedHandler = (event, controlName) =>{
        //console.log(event.target.value);
        // const updatedControls = {
        //     ...this.state.controls,
        //     [controlName]:{
        //         ...this.state.controls[controlName],
        //         value: event.target.value,
        //         valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
        //         touched: true
        //     }
        // };
        //optimizing above code using utility function
        const updatedControls = updateObject(this.state.controls, {
            [controlName]: updateObject(this.state.controls[controlName], {
            value: event.target.value,
            valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
            touched: true
            })
        });

        this.setState({controls: updatedControls});
    }

    submitHandler = (event) =>{
        event.preventDefault();
       // console.log(this.state.controls.email.value);
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
    }

    switchAuthModeHandler = () =>{
        this.setState(prevState =>{
            return { isSignup: !prevState.isSignup}
        });
    }

    render(){
        const formEelementsArray=[];
        for(let key in this.state.controls)
        {
            formEelementsArray.push({
                id: key,
                config: this.state.controls[key]
            })
        }
        let form = formEelementsArray.map(elm=>(
                        <Input 
                        key={elm.id}
                        elementType={elm.config.elementType} 
                        elementConfig={elm.config.elementConfig} 
                        value={elm.config.value} 
                        invalid={!elm.config.valid}
                        shouldValidate={elm.config.validation}
                        touched={elm.config.touched}
                        changed={(event)=>this.inputChangedHandler(event, elm.id)}/>
                    ));
            
            //console.log('loading', this.props.loading);
            if(this.props.loading)
            {
                form=<Spinner/>
            }

            let errorMessage = null;
            if(this.props.error)
            {
                errorMessage = (<p1>{this.props.error.message}</p1>);
            }

            let authRedirect= null;
            if(this.props.isAuthenticated)
            {
                authRedirect= <Redirect to={this.props.authRedirectPath}/>;
            }

        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    <h1>Enter your Login details</h1>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button btnType="Danger"
                clicked={this.switchAuthModeHandler}>
                    SWITCH TO {this.state.isSignup? "SIGNIN": "SIGNUP"}
                </Button>
            </div>
        );
    }
}

const mapStateToProps = state =>{
    return{
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token != null,
        buildingBurger: state.burgBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch =>{
    return{
        onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);