import React, { Component } from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';

import DishDetail from './DishdetailComponent';
import { DISHES } from '../shared/dishes';
import { COMMENTS } from '../shared/comments';
import { PROMOTIONS } from '../shared/promotions';
import { LEADERS } from '../shared/leaders';

import Menu from './MenuComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';

import { addComment, fetchDishes } from '../redux/ActionCreators';

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  }
}

const mapDispatchToProps = dispatch => ({
  
  addComment: (dishId, rating, author, comment) => dispatch(addComment(dishId, rating, author, comment)),
  fetchDishes: () => { dispatch(fetchDishes())},
  resetFeedbackForm: () => { dispatch(actions.reset('feedback'))}
});


class Main extends Component {
  componentDidMount() {
    this.props.fetchDishes();
  }

  constructor(props) {
    super(props);
    this.state = {
        dishes: DISHES,
        comments: COMMENTS,
        promotions: PROMOTIONS,
        leaders: LEADERS
        
    };
  }

  

  render() {
    const HomePage = () =>{
      return(
        <Home 
            dish={this.state.dishes.filter((dish) => dish.featured)[0]}
            dishesLoading={this.props.dishes.isLoading}
            dishesErrMess={this.props.dishes.errMess}
            promotion={this.state.promotions.filter((promo) => promo.featured)[0]}
            leader={this.state.leaders.filter((leader) => leader.featured)[0]}/>
        
      )
    };
    const DishWithId = ({match}) => {
      return(
        <DishDetail dish={this.props.dishes.filter((dish) => dish.id === parseInt(match.params.dishId,10))[0]}
          isLoading={this.props.dishes.isLoading}
          errMess={this.props.dishes.errMess}
          comments={this.props.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId,10))}
          addComment={this.props.addComment}
        />
      );
    };
    return (
      // <div>
      //   <Header />
      //   <Switch>
      //       <Route path='/home' component={HomePage} />
      //       <Route exact path='/menu' component={() => <Menu dishes={this.state.dishes} />} />
      //       <Route exact path='/contactus' component={Contact} />
      //       <Route path='/menu/:dishId' component={DishWithId} />
      //       <Redirect to="/home" />
      //   </Switch>
      //   <Footer />
      // </div>
      <div>
        <Header />
        <div>
          <Switch>
              <Route path='/home' component={HomePage} />
              <Route exact path='/menu' component={() => <Menu dishes={this.props.dishes} />} />
              <Route path='/menu/:dishId' component={DishWithId} />
              <Route exact path='/contactus' component={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} />} />
              <Route exact path='/contactus' component={Contact} /> 
              <Redirect to="/home" />
          </Switch>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));