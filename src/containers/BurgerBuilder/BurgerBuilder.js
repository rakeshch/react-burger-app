import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/OrderSummary/OrderSummary';

import axios from '../../../src/axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';


// const INGREDIENT_PRICES={
//     salad:0.5,
//     cheese: 0.4,
//     meat: 1.3,
//     bacon: 0.7
// };

class BurgerBuilder extends Component{
    state = {
        // ingredients:null,
        // totalPrice: 4,
        //purchasable: false,
        purchasing: false
    }

    componentDidMount(){
       // console.log(this.props);
        this.props.oninitIngredients();
        //https://react-my-burger-f4039-default-rtdb.firebaseio.com/Ingredients
        // axios.get("https://react-my-burger-f4039-default-rtdb.firebaseio.com/Ingredients.json")
        //         .then(response=>{
        //             this.setState({ ingredients: response.data })
        //         })
        //         .catch(error=>{
        //             this.setState({ error: true });
        //         })
    }

    updatePurchaseState(ingredients){
            //convert object to array and read the amount of ingredients added for every ingredient
        const sum = Object.keys(ingredients)
                .map(igkey => {
                    return ingredients[igkey];
                }).reduce((sum, el) =>{
                    return sum + el;
                }, 0)
        return sum > 0;
    }

    purchaseHandler = () => {
        if(this.props.isAuthenticated){
                   this.setState({purchasing: true}); 
        }else{
            this.props.onSetAuthRedirectPath('/checkout')
            this.props.history.push('/auth');
        }
    }

    purchaseCancelHandler =()=>{
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler =()=>{
        this.props.onPurchaseInit();
        this.props.history.push('/checkout');
    }

    render(){
        //disable button when there is no ingredient added
        const disabledInfo = {
            ...this.props.ingrds
        };

        for(let key in disabledInfo)
        {
            disabledInfo[key] = disabledInfo[key]<=0;
        }
        let orderSummary = null;
        let burger= this.props.error? <p>Ingredients can't be loaded</p>: <Spinner/>;

        if(this.props.ingrds)
        {
           
        burger=(
                <Aux>
                    <Burger ingredients={this.props.ingrds}/>
                    <BuildControls 
                    ingredientAdded={this.props.onAddIngredient}
                    ingredientRemoved ={this.props.onRemoveIngredient}
                    disabled={disabledInfo}
                    price={this.props.ttlPrice}
                    purchasable={this.updatePurchaseState(this.props.ingrds)}
                    ordered={this.purchaseHandler}
                    isAuth = {this.props.isAuthenticated}
                    />
                </Aux>
            );

            orderSummary=<OrderSummary 
            ingredients={this.props.ingrds} 
            cancelled={this.purchaseCancelHandler} 
            continued={this.purchaseContinueHandler}
            price={this.props.ttlPrice}/>
        }

        // if(this.state.loading)
        //     orderSummary= <Spinner/>

        return(
            <Aux>
                <Modal show={this.state.purchasing} clicked={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps= state =>{
    return {
        ingrds: state.burgBuilder.ingredients,
        ttlPrice: state.burgBuilder.totalPrice,
        error: state.burgBuilder.error,
        isAuthenticated: state.auth.token != null,
        building: state.burgBuilder.building
    };
};

const mapDispatchToProps = dispatch =>{
    return {
        onAddIngredient: (ingredientType) => dispatch(actions.addIngredient(ingredientType)),
        onRemoveIngredient: (ingredientType) => dispatch(actions.removeIngredient(ingredientType)),
        oninitIngredients: () => dispatch(actions.initIngredients()),
        onPurchaseInit:() => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    };
};



export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));