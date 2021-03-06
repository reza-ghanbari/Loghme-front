import React,{Component} from 'react'
import {SnackBarGlobalContext} from './SnackBarContext'
import * as $ from 'jquery'
import { exitFromApp } from '../basics/Utils'
export const CartGlobalContext = React.createContext()

export class CartContext extends Component {

    constructor(props){
        super(props)
        this.state = {
            orders : [],
            total : "0",
            spinner : false,
            update : this.updateState.bind(this),
            finalize : this.finalize.bind(this),
            increase : this.increase.bind(this),
            decrease : this.decrease.bind(this)
        }
        this.updateState = this.updateState.bind(this)
        this.finalize = this.finalize.bind(this)
        this.increase = this.increase.bind(this)
        this.decrease = this.decrease.bind(this)
    }

    render(){
        return(
                <SnackBarGlobalContext.Consumer>
                    {
                        (data)=>{
                            this.show = data.showSnackbar
                            return(
                                    <CartGlobalContext.Provider value = {this.state}>
                                        {this.props.children}
                                    </CartGlobalContext.Provider>
                            )
                        }
                    }
                </SnackBarGlobalContext.Consumer>
        );
    }

    componentDidMount(){
        this.updateState()
        this.mount = true
    }

    componentWillUnmount(){
        this.mount = false
    }

    updateState(){
        if(localStorage.getItem("auth")==null){
            return
        }
        let req = new XMLHttpRequest()
        req.responseType = 'json'
        req.onreadystatechange = function() {
            console.log(req.response)
            if(req.readyState === 4 && req.status === 200 && this.mount) {
                this.state.orders = []
                this.setState((state,props)=>({
                    orders : req.response.orders,
                    total : req.response.cost,
                    spinner : false
                }))
            }
            else if(req.readyState === 4 && req.status === 500 && this.mount){
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????????????? ???????? ???????? ???????? :(")
            }
            else if(req.readyState === 4 && req.status === 404 && req.response.status === 4040001 && this.mount){
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????? ???????? ???? ???????? ?????? ????????")
            }
            else if(req.readyState === 4 && req.status === 404 && req.response.status === 4040001 && this.mount){
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????? ???????? ???? ???????? ?????? ????????")
            }
            else if(req.readyState === 4 && req.status === 500 && req.response.status === 500 && this.mount){
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????????????? ???????? ???????? ???????? :(")
            }
            else if(req.status===403){
                if(localStorage.getItem("auth")){
                    exitFromApp()
                }
            }
            else if(this.mount) {
                this.setState({spinner:true})
            }
            
        }.bind(this)
        req.onerror = function(){
            if(this.mount){
                this.setState((state,props)=>({
                    spinner : false
                }))
                this.show("?????????????? ???????? ???????? ???????? :(")
            }
        }.bind(this)
        req.open('GET','http://185.166.105.6:31037/users/cart',true)
        
        req.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('id_token'))
        req.send()
    }

    finalize(){
        let req = new XMLHttpRequest()
        req.onerror = function(){
            this.setState((state,props)=>({
                spinner : false,
            }))
            this.show("?????????????? ???????? ???????? ???????? :(")
        }.bind(this)
        req.onreadystatechange = function() {
            if(req.readyState === 4 && req.status === 200 && this.mount) {
                this.setState((state,props)=>({
                    orders : [],
                    total : 0,
                    spinner : false
                }))
                this.show("???????? ???????? :)")
                this.updateState()
            }
            else if(req.readyState === 4 && req.status === 500 && this.mount){
                this.setState((state,props)=>({
                    spinner : false
                }))
                this.show("?????????????? ???????? ???????? ???????? :(")
            }
            else if(req.readyState === 4 && req.status === 400 && this.mount){
                this.setState((state,props)=>{
                    let ans = {
                        spinner : false
                    }
                    if(req.response.status === 40001 && this.mount){
                        this.show("?????????????? ???? ?????? ???????? ?????????? ??????!")
                    }
                    else{
                        this.show("???????????? ?????????? ?????? :(")
                    }
                    return ans
                })
            }
            else if(req.readyState === 4 && req.status === 404 && req.response.status === 4040001 && this.mount){
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????? ???????? ???? ???????? ?????? ????????")
            }
            else if(req.readyState === 4 && req.status === 500 && req.response.status === 500 && this.mount){
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????????????? ???????? ???????? ???????? :(")
            }
            else if(req.status===403){
                if(localStorage.getItem("auth")){
                    exitFromApp()
                }
            }
            else if(this.mount){
                this.setState({spinner:true})
            }
        }.bind(this)
        req.responseType = 'json'
        req.open('POST','http://185.166.105.6:31037/users/cart',true)
        
        req.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('id_token'))
        req.send()
    }

    increase(item){
        let req = new XMLHttpRequest()
        req.responseType = 'json'
        req.onerror = function(){
            this.setState((state,props)=>({
                spinner : false
            }))
            this.show("?????????????? ???????? ???????? ???????? :(")
        }.bind(this)
        // onreadystatechanges
        req.onreadystatechange = function() {
            if(req.readyState === 4 && req.status === 200  && this.mount) {
                this.setState((state,props)=>({
                    spinner : false
                }))
                this.updateState()
            }
            else if(req.readyState === 4 && req.status === 500  && this.mount){
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????????????? ???????? ???????? ???????? :(")
            }
            else if(req.readyState === 4 && req.status === 404 && req.response.status === 40401 && this.mount){
                if(item.special) {
                    item.special = false
                    this.increase(item)
                    return
                }
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????? ?????? ???????? ?????????? :(")
            }
            else if(req.status===403 && req.response.status===null){
                if(localStorage.getItem("auth")){
                    exitFromApp()
                }
            }
            else if(req.readyState === 4 && req.status === 403 && this.mount){
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????????? ???????????? ???? ?????? ???????????????? ?????????? :(")
            }
            else if(req.readyState === 4 && req.status === 404 && req.response.status === 40402 && this.mount){
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????? ?????????????? ???????? ?????????? :(")
            }
            else if(req.readyState === 4 && req.status === 404 && req.response.status === 40401 && this.mount){
                if(item.special == true) {
                    item.special = false
                    this.increase(item)
                    return
                }
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????? ?????? ???????? ?????????? :(")
            }
            else if(req.readyState === 4 && req.status === 400 && req.response.status === 40001 && this.mount){
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????? ???????????? ???????????? ?????????? :(")
            }
            else if(req.readyState === 4 && req.status === 400 && req.response.status === 40002 && this.mount){
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("???????????????? ?????? :(")
            }
            else if(req.readyState === 4 && req.status === 400 && req.response.status === 40004 && this.mount){
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????????? ?????????? ???????? ????????")
            }
            else if(req.readyState === 4 && req.status === 404 && req.response.status === 4040001 && this.mount){
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????? ???????? ???? ???????? ?????? ????????")
            }
            else if(req.readyState === 4 && req.status === 500 && req.response.status === 500 && this.mount){
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????????????? ???????? ???????? ???????? :(")
            }
            else if(this.mount) {
                this.setState({spinner:true})
            }
        }.bind(this)
        req.onerror = function(){
            if(this.mount){
                this.setState((state,props)=>({
                    spinner : false
                }))
                this.show("?????????????? ???????? ???????? ???????? :(")
            }
        }.bind(this)
        req.open('PUT','http://185.166.105.6:31037/users/cart',true)
        
        req.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('id_token'))
        req.setRequestHeader("Content-Type", "application/json")
        req.send(JSON.stringify(item))
    }

    decrease(item){
        let req = new XMLHttpRequest()
        req.responseType = 'json'
        req.onerror = function(){
            this.setState((state,props)=>({
                spinner : false
            }))
            this.show("?????????????? ???????? ???????? ???????? :(")
        }.bind(this)
        // onreadystatechanges
        req.onreadystatechange = function() {
            if(req.readyState === 4 && req.status === 200 && this.mount) {
                this.setState((state,props)=>({
                    spinner : false
                }))
                this.updateState()
            }
            else if(req.readyState === 4 && req.status === 500 && this.mount){
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????????????? ???????? ???????? ???????? :(")
            }
            else if(req.readyState === 4 && req.status === 200 && req.response.status === 40401 && this.mount){
                if(item.special == true) {
                    item.special = false
                    this.decrease(item)
                    return
                }
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????? ?????? ???????? ?????????? :(")
            }
            else if(req.status===403 && req.response.status===null){
                if(localStorage.getItem("auth")){
                    exitFromApp()
                }
            }
            else if(req.readyState === 4 && req.status === 403 && this.mount){
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????????? ???????????? ???? ?????? ???????????????? ?????????? :(")
            }
            else if(req.readyState === 4 && req.status === 404 && req.response.status === 40402 && this.mount){
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????? ?????????????? ???????? ?????????? :(")
            }
            else if(req.readyState === 4 && req.status === 404 && req.response.status === 40401 && this.mount){
                if(item.special == true) {
                    item.special = false
                    this.decrease(item)
                    return
                }
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????? ?????? ???????? ?????????? :(")
            }
            else if(req.readyState === 4 && req.status === 400 && req.response.status === 40001 && this.mount){
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????? ???????? ?????? :(")
            }
            else if(req.readyState === 4 && req.status === 400 && req.response.status === 40002 && this.mount){
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("???????????????? ?????? :(")
            }
            else if(req.readyState === 4 && req.status === 404 && req.response.status === 4040001 && this.mount){
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????? ???????? ???? ???????? ?????? ????????")
            }
            else if(req.readyState === 4 && req.status === 500 && req.response.status === 500 && this.mount){
                this.setState((state,props)=>({
                    spinner : false,
                }))
                this.show("?????????????? ???????? ???????? ???????? :(")
            }
            else if(this.mount){
                this.setState({spinner:true})
            }
        }.bind(this)
        req.open('DELETE','http://185.166.105.6:31037/users/cart',true)
        req.setRequestHeader("Content-Type", "application/json")
        
        req.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('id_token'))
        req.send(JSON.stringify(item))
    }
}

