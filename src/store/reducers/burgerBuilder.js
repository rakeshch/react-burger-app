import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState={
    ingredients: null,
    totalPrice: 4,
    loading: false,
    error: false,
    building: false
}

const INGREDIENT_PRICES={
    salad:0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

const addIngredient = (state, action) =>{
    // return {
    //         ...state,
    //         ingredients: {
    //             ...state.ingredients,
    //             [action.ingredientType]: state.ingredients[action.ingredientType] + 1
    //         },
    //         totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientType]
    //     };
    
    //using utility function
    const updatedIngredient = {[action.ingredientType]: state.ingredients[action.ingredientType] + 1}
    const updatedIngredients = updateObject(state.ingredients, updatedIngredient);
    const updatedState = {
        ingredients: updatedIngredients,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientType],
        building: true
    } 
    return updateObject(state, updatedState);
}

const removeIngredient = (state, action) =>{
    const updatedIng = {[action.ingredientType]: state.ingredients[action.ingredientType] - 1}
    const updatedIngs = updateObject(state.ingredients, updatedIng);
    const updatedSt = {
        ingredients: updatedIngs,
        totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientType],
        building: true
    } 
    return updateObject(state, updatedSt);
}

const setIngredients = (state, action) =>{
    // return{
        //     ...state,
        //     ingredients: { //to maintain the order of ingredients, as firebase save in aphabeticalorder
        //         salad: action.ingredients.salad,
        //         bacon: action.ingredients.bacon,
        //         cheese: action.ingredients.cheese,
        //         meat: action.ingredients.meat
        //     },
        //     totalPrice: 4,
        //     error: false
        // }

        //usin utility function
    return updateObject(state, {
        ingredients: { //to maintain the order of ingredients, as firebase save in aphabeticalorder
                    salad: action.ingredients.salad,
                    bacon: action.ingredients.bacon,
                    cheese: action.ingredients.cheese,
                    meat: action.ingredients.meat
                },
                totalPrice: 4,
                error: false,
                building: false
        })
}

const fetchingredientsFailed = (state, action) =>{
    return updateObject(state, {
        error: true
    })
    // return{
    //     ...state,
    //     error: true
    // }
}


const reducer = (state=initialState, action) =>{
switch(action.type){
    case actionTypes.ADD_INGREDIENT: return addIngredient(state, action);
    case actionTypes.REMOVE_INGREDIENT: return removeIngredient(state, action);
    case actionTypes.SET_INGREDIENTS: return setIngredients(state, action);
    case actionTypes.FETCH_INGREDIENTS_FAILED: return fetchingredientsFailed(state, action);
    default: return state;
    }
};

export default reducer;