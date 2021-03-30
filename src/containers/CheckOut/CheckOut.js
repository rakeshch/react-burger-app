import React, { Component } from 'react';
import { Route, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';

import CheckOutOrderSummary from '../../components/Order/CheckOutSummary/CheckOutSummary';
import ContactData from './ContactData/ContactData';


class CheckOut extends Component{

    checkOutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkOutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    render(){
        let summary = <Redirect to='/'/>
        if(this.props.ingrds)
        {
            const purchasedRedirect = this.props.purchased? <Redirect to='/'/>: null;
            summary = (
                <div>
                    {purchasedRedirect} 
                     <CheckOutOrderSummary ingredients={this.props.ingrds}
                        checkOutCancelled={this.checkOutCancelledHandler}
                        checkOutContinued={this.checkOutContinuedHandler} />
                    <Route 
                        path={this.props.match.path + '/contact-data'} 
                        component={ContactData}/>
                </div>
                 
            );
        }
        return summary;
    }
};

const mapStateToProps = state =>{
    return {
      ingrds: state.burgBuilder.ingredients,
      purchased: state.order.purchased
    };
}

export default connect(mapStateToProps)(CheckOut);

