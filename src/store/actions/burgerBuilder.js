import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const addIngredient = ingredientName =>{
    return {
        type: actionTypes.ADD_INGREDIENT, 
        ingredientType: ingredientName
    }
}

export const removeIngredient = ingredientName =>{
    return {
        type: actionTypes.REMOVE_INGREDIENT, 
        ingredientType: ingredientName
    }
}

export const fetchIngredientFailed = () =>{
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    }
}

export const setIngredients = (ingredients) =>{
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients
    }
}

export const initIngredients = () =>{
    //runs async code
    return dispatch =>{
        axios.get("https://react-my-burger-f4039-default-rtdb.firebaseio.com/Ingredients.json")
        .then(response=>{
            dispatch(setIngredients(response.data));
        })
        .catch(error=>{
            dispatch(fetchIngredientFailed());
        })
    }
};