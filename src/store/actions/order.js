import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';;

export const purchaseBurgerSuccess = (id, orderData) =>{
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData: orderData
    }
};

export const purchaseBurgerFail = (error) =>{
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    }
}

export const purchaseBurgerStart = () =>{
    return {
        type: actionTypes.PURCHASE_BURGER_START
    }
}

export const purchaseBurger = (orderData, token) =>{
    return dispatch =>{
        dispatch(purchaseBurgerStart());
          //orders will be created if do not exist. for firebase to function correctly, need to add .json
       axios.post('/orders.json?auth=' + token, orderData)
       .then(response=>{
           //console.log(response.data);
           dispatch(purchaseBurgerSuccess(response.data.name, orderData));
       })
       .catch(error =>{
        dispatch(purchaseBurgerFail(error));
       })
    }
}

export const purchaseInit = () =>{
    return {
        type: actionTypes.PURCHASE_INIT
    }
};

export const fetchOrdersSuccess = (orders) =>{
    return {
        type: actionTypes.FETCH_ORDERS__SUCCESS,
        orders: orders
    }
}

export const fetchOrdersFail = (error) =>{
    return {
        type: actionTypes.FETCH_ORDERS__FAIL,
        error: error
    }
}

export const fetchOrdersStart = () =>{
    return {
        type: actionTypes.FETCH_ORDERS_START
    }
}

export const fetchOrders = (token, userId) =>{
    return dispatch =>{
        dispatch(fetchOrdersStart());
        const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"';
        axios.get('/orders.json?auth=' + queryParams)
            .then(resp=> {
                const fetchedOrders= [];
                for(let key in resp.data){
                    fetchedOrders.push({
                        ...resp.data[key],
                        id: key
                    })
                }
                // console.log(resp.data);
                // this.setState({ loading: false, orders: fetchedOrders});
                dispatch(fetchOrdersSuccess(fetchedOrders));

            }).catch(error =>{
                dispatch(fetchOrdersFail(error));
       })
    }
}