import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../../axios-orders';
import * as orderActions from '../../../store/actions/index';
import { updateObject, checkValidity } from '../../../shared/utility';

class ContactData extends Component{
    state={
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5,
                    isNumeric: true
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-Mail'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: 'fastest', //default value
                validation: {},
                valid: true
            }
        },
        formIsValid: false
    }

    orderHandler=(event)=>{
        // to handle default behavior of page load
        event.preventDefault();

        //access the state
        const formData={};
        for(let formElmIdentifier in this.state.orderForm){
            formData[formElmIdentifier] = this.state.orderForm[formElmIdentifier].value
        }

        this.setState({loading: true});
        const order={
           ingredients: this.props.ingrds,
           price: this.props.price, //In production app always make calculations like these in the server side to avoid any user maniulations
           orderData: formData,
           userId: this.props.userId
        }
        this.props.onOrderBurger(order, this.props.token);
    }

    //perform two way binding
    inputChangedHandler = (event, inputIdentifier) =>{
        // const updatedOrderForm = {
        //     ...this.state.orderForm
        // };

        // //above line do not performa deep clone, so do another clone to accesss value

        // const updatedFromElement = {
        //     ...updatedOrderForm[inputIdentifier]
        // };
        // updatedFromElement.value = event.target.value;
        // //check for validity
        // updatedFromElement.valid = this.checkValidity(updatedFromElement.value, updatedFromElement.validation);
        // updatedFromElement.touched = true;
        // updatedOrderForm[inputIdentifier] = updatedFromElement;

        //console.log(event.target.value);
        //optimizing above code using utility function
        const updatedFromElement = updateObject(this.state.orderForm[inputIdentifier], {
            value: event.target.value,
            valid: checkValidity(event.target.value, this.state.orderForm[inputIdentifier].validation),
            touched: true
        });

        const updatedOrderForm = updateObject(this.state.orderForm, {
            [inputIdentifier]: updatedFromElement
        })

        let formIsValid= true;
        for(let formIdentifier in updatedOrderForm){
            formIsValid = updatedOrderForm[formIdentifier].valid && formIsValid;
        }


        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});

        //console.log(this.state.orderForm);
    }

    render(){
        const formEelementsArray=[];
        for(let key in this.state.orderForm)
        {
            formEelementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }
        let form =(
             <form onSubmit={this.orderHandler}>
                 {formEelementsArray.map(elm=>(
                     <Input 
                        key={elm.id}
                        elementType={elm.config.elementType} 
                        elementConfig={elm.config.elementConfig} 
                        value={elm.config.value} 
                        invalid={!elm.config.valid}
                        shouldValidate={elm.config.validation}
                        touched={elm.config.touched}
                        changed={(event)=>this.inputChangedHandler(event, elm.id)}/>
                 ))}
                  
                    <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
                </form>
            );

            if(this.props.loading)
            {
                form=<Spinner/>
            }
        return (
            <div className={classes.ContactData}>
                <h1>Enter your Contact data here</h1>
                {form}
            </div>
        );
    }
}

const mapStateToProps = state =>{
    return {
        ingrds: state.burgBuilder.ingredients,
        price: state.burgBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch =>{
    return {
      onOrderBurger:(orderData, token) => dispatch(orderActions.purchaseBurger(orderData, token))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));