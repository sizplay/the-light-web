import React from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import StripeCheckout from 'react-stripe-checkout';
import { checkOutUser, createAddress } from '../store';

const Checkout = (props) => {

  const { name, description, amount, user } = props;
  const CURRENCY = 'USD';
  const PUBLISHED_KEY = 'pk_test_furtUjPSZ4NnBAWEDDzDt4dG';

  const usdToCents = (amount) => amount * 100;

  const successPayment = () => {
    const { address, user, createAddress, checkOutUser, history } = props;
    if (address.line1) {
      createAddress(Object.assign({}, address, { user_id: user.id }))
      .then(res => {
        checkOutUser( user.id, 1, res.address.id)
        history.push('/')
      })
    }
    else {
      checkOutUser(user.id, 1, address)
      history.push('/')
    }
  };

  const errorPayment = data => {
    alert('Payment Error');
  };

  const onToken = (amount, description) => token =>
    axios.post('/api/stripe/checkout',
      {
        description,
        source: token.id,
        currency: CURRENCY,
        amount: usdToCents(amount)
      })
      .then(() => successPayment())
      .catch(errorPayment);

  return (
    <StripeCheckout
      name={name}
      description={description}
      amount={usdToCents(amount)}
      token={onToken(amount, description)}
      currency={CURRENCY}
      stripeKey={PUBLISHED_KEY}
      email={user.email}
    />
  )
}

const mapDispatch = (dispatch) => {
  return {
    checkOutUser: (user, card, address) => dispatch(checkOutUser(user, card, address)),
    createAddress: (address) => dispatch(createAddress(address))
  }
}

export default connect(null, mapDispatch)(Checkout);