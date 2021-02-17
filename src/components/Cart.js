import React, { Component } from 'react'
import formatCurrency from '../util';
import Fade from "react-reveal/Fade";
import axios from 'axios';

export default class Cart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: "",
            email: "",
            address: "",
            states: [],
            city: [],
            showCheckout: false
        }
        this.getCity = this.getCity.bind(this);
    };


    componentDidMount() {
        axios.post("http://cbatnode-env.eba-q2bgsjkv.us-east-1.elasticbeanstalk.com/api/state/get")
            .then(response => {
                this.setState({ states: response.data.data });
                console.log(this.state.states)
            })
            .catch(error => {
                this.setState({ error: "Url Error" })
            })
    }
    getCity(e){
        axios.post("http://cbatnode-env.eba-q2bgsjkv.us-east-1.elasticbeanstalk.com/api/city/get",{
            state:e.target.value
        })
        .then(response=>{
            this.setState({city:response.data.data});
            console.log(this.state.city);
        })
        .catch(error=>{
            this.setState({error:"Url Error"});
            console.log(error);
        })
    }


    handleInput = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    createOrder = (e) => {
        e.preventDefault();
        const order = {
            name: this.state.name,
            email: this.state.email,
            address: this.state.address,
            cartItems: this.props.cartItems
        };
        this.props.createOrder(order);
    }

    render() {
        const { cartItems } = this.props;
        return (
            <div>
                {cartItems.length === 0 ? <div className="cart cart-header">Cart is empty</div>
                    :
                    <div className="cart cart-header">You have {cartItems.length} items in the cart{" "}</div>
                }
                <div>
                    <div className="cart">
                        <Fade left cascade>
                            <ul className="cart-items">
                                {
                                    cartItems.map(item => (
                                        <li key={item._id}>
                                            <div>
                                                <img src={item.image} alt={item.title} />
                                            </div>
                                            <div>{item.title}</div>
                                            <div className="right">
                                                {formatCurrency(item.price)} x {item.count} {" "}
                                                <button className="button" onClick={() => this.props.removeFromCart(item)}>
                                                    Remove
                                </button>
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </Fade>
                    </div>
                    {cartItems.length !== 0 && (
                        <div>
                            <div className="cart">
                                <div className="totle">
                                    <div>
                                        Total:{" "}
                                        {formatCurrency(
                                            cartItems.reduce((a, c) => a + c.price * c.count, 0)
                                        )}
                                    </div>
                                    <button
                                        onClick={() => {
                                            this.setState({ showCheckout: true });
                                        }}
                                        className="button primary"
                                    >
                                        Proceed
                               </button>
                                </div>
                            </div>
                            {this.state.showCheckout && (
                                <Fade right cascade>
                                    <div className="cart">
                                        <form onSubmit={this.createOrder}>
                                            <ul className="form-container">
                                                <li>
                                                    <label>Email</label>
                                                    <input type="email" name="email" required onChange={this.handleInput} />
                                                </li>
                                                <li>
                                                    <label>Name</label>
                                                    <input type="text" name="name" required onChange={this.handleInput} />
                                                </li>
                                                <li>
                                                    <label>Address</label>
                                                    <input type="text" name="address" required onChange={this.handleInput} />
                                                </li>
                                                <li>
                                                    <label>Select State</label>
                                                    <select onChange={this.getCity}>
                                                        {
                                                            this.state.states.map((data, key) => <option key={key}>{data.state}</option>)
                                                        }
                                                    </select>
                                                    </li>
                                                    <li>
                                                    <label>Select City</label>
                                                    <select>
                                                        {
                                                            this.state.city.map((data, key) => <option key={key}>{data.city}</option>)
                                                        }
                                                    </select>

                                                </li>
                                                <li>
                                                    <button type="submit" className="button primary">Checkout</button>
                                                </li>
                                            </ul>
                                        </form>
                                    </div>
                                </Fade>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
