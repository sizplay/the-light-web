import React, { Component } from 'react';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchCategories, fetchProducts, fetchLineItems, fetchUsers, fetchOrders, getLoggedIn, setCart } from '../store';

import Nav from './Nav';
import Private from './Auth/AuthNeeded';
import Admin from './Auth/AdminNeeded';
import Login from './Auth/Login';
import ForgotPW from './Auth/ForgotPW';
import ResetPW from './Auth/ResetPW';
import Products from './Products';
import Product from './Product';
import Cart from './Cart';
import AdminCategories from './Admin/AdminCategories';
import AdminProducts from './Admin/AdminProducts';
import AdminEditProducts from './Admin/AdminEditProducts';
import AdminUsers from './Admin/AdminUsers';
import User from './User/User';
import Orders from './User/Orders';
import Cards from './User/Cards';
import EditUser from './User/EditUser';
import Addresses from './User/Addresses';

class Root extends Component {

  componentDidMount() {
    this.props.fetchCategories();
    this.props.fetchProducts();
    this.props.fetchLineItems();
    const user = localStorage.getItem('user');
    if (user) {
      this.props.getLoggedIn({ token: user })
      .then(_user => {
        if(_user.isAdmin) this.props.fetchUsers();
        this.props.setCart(_user);
      });
    }
  }

  render() {

    const user = localStorage.getItem('user')
    if(user) {
      this.props.getLoggedIn({ token: user });
    }

    return (
      <div>
        <Router>
          <div>
            <Nav />
            <Route path='/login' component={Login} />
            <Route exact path='/' render={()=> <Redirect to='products' />} />
            <Route exact path='/products' component={Products} />
            <Route exact path='/products/:id' render={({ match, history }) => <Product id={match.params.id * 1} history={history} />} />
            <Route exact path='/account' component={Private(User)}/>
            <Route path='/account/orders' component={Private(Orders)}/>
            <Route path='/account/card' component={Private(Cards)}/>
            <Route path='/account/edit-profile' component={Private(EditUser)}/>
            <Route path='/account/addresses' component={Private(Addresses)}/>
            <Route path='/admin/categories' component={Admin(AdminCategories)} />
            <Route path='/admin/products' render={({ match, history }) => <AdminProducts id={match.params.id * 1} history={history} />} />
            <Route path='/admin/products/:id' render={({ match, history }) => <AdminEditProducts id={match.params.id * 1} history={history} />} />
            <Route path='/admin/users' render={({ match, history }) => <AdminUsers id={match.params.id * 1} history={history} />} />
            <Route path='/cart' render={({ match }) => <Cart history={history} />} />
            <Route path='/forgot' component={ForgotPW} />
            <Route path='/reset/:token' render={({ match }) => <ResetPW token={match.params.token}/>} />
          </div>
        </Router>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLineItems: () => dispatch(fetchLineItems()),
    fetchCategories: () => dispatch(fetchCategories()),
    fetchProducts: () => dispatch(fetchProducts()),
    fetchUsers: () => dispatch(fetchUsers()),
    fetchOrders: (user) => dispatch(fetchOrders(user)),
    getLoggedIn: (user) => dispatch(getLoggedIn(user)),
    setCart: (user) => dispatch(setCart(user))
  };
};

export default connect(null, mapDispatchToProps)(Root);
