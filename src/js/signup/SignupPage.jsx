import React,{Component} from 'react'
import '../../css/signup.css'
import {NavBar} from '../basics/Navbar'
import {InputField} from '../basics/Inputs'
import {SnackBarGlobalContext,SnackBarContext} from '../context/SnackBarContext'
import {CartContext} from '../context/CartContext'
import {validateEmail,isNumeric} from '../basics/Utils'
import {SnackBar} from '../basics/SnackBar'
import {PageLoaderSpinner} from '../basics/PageLoadSpinner'
import PropTypes from 'prop-types'
import Loader from 'react-loader-spinner'
import * as $ from 'jquery'

export class SignupPage extends Component {
    
    static propTypes = {
        history : PropTypes.object.isRequired
    }

    render(){
        return(
            <SnackBarContext>
                <CartContext>
                    <NavBar history={this.props.history} exit={false} account={false} cart={false} login={true}></NavBar>
                    <div className="container-fluid" id="body-container">
                        <SignupPageUpperRow></SignupPageUpperRow>
                        <div className="row">
                            <div className="col-sm-12" id="signup-card-col">
                                <div className="card" id="signup-card">
                                    <SignupCard googleDetails={this.props.googleDetails} history={this.props.history}></SignupCard>
                                </div>
                            </div>
                        </div>    
                    </div>
                    <SnackBar></SnackBar>
                    <PageLoaderSpinner id="loading-modal"></PageLoaderSpinner>
                </CartContext>
            </SnackBarContext>
        )
    }

    componentDidMount(){
        $("#loading-modal").modal('show')
        setTimeout(()=>{$("#loading-modal").modal('hide')},1500)
    }
}

class SignupCard extends Component{

    static propTypes = {
        history : PropTypes.object.isRequired
    }

    constructor(props){
        super(props)
        this.state = {
            spinner : false,
            firstname : (this.props.googleDetails)?this.props.googleDetails.name:"",
            firstname_empty:false,
            firstname_err:false,
            lastname : (this.props.googleDetails)?this.props.googleDetails.family:"",
            lastname_empty:false,
            lastname_err:false,
            phone : "",
            phone_err:false,
            phone_empty:false,
            email : (this.props.googleDetails)?this.props.googleDetails.email:"",
            email_err:false,
            email_empty:false,
            password : "",
            password_err:false,
            password_empty:false,
            re_password : "",
            re_password_err:false,
            re_password_empty:false
        }
        this.passwordChange = this.passwordChange.bind(this)
        this.re_passwordChange = this.re_passwordChange.bind(this)
        this.emailChange = this.emailChange.bind(this)
        this.phoneChange = this.phoneChange.bind(this)
        this.firstnameChange = this.firstnameChange.bind(this)
        this.lastnameChange = this.lastnameChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.gotoLoginPage = this.gotoLoginPage.bind(this)
    }

    passwordChange(event){
        this.setState({password : event.target.value,password_empty:false,password_err:false,re_password_err:false})
    }

    re_passwordChange(event){
        this.setState({re_password : event.target.value,re_password_empty:false,re_password_err:false,password_err:false})
    }

    emailChange(event){
        this.setState({email : event.target.value,email_empty:false,email_err:false})
    }

    phoneChange(event){
        this.setState({phone : event.target.value,phone_empty:false,phone_err:false})
    }

    firstnameChange(event){
        this.setState({firstname : event.target.value,firstname_empty:false,firstname_err:false})
    }

    lastnameChange(event){
        this.setState({lastname : event.target.value,lastname_empty:false,lastname_err:false})
    }

    onSubmit(){
        let validatation = {}
        let err_pass = false
        let empty = false
        let err_email = false
        let err_phone = false
        if(this.state.firstname==="" || this.state.firstname===null || this.state.firstname===undefined){
            validatation.firstname_empty = true
            empty = true
        }
        if(this.state.lastname==="" || this.state.lastname===null || this.state.lastname===undefined){
            validatation.lastname_empty = true
            empty = true
        }
        if(this.state.phone==="" || this.state.phone===null || this.state.phone===undefined){
            validatation.phone_empty = true
            empty = true
        }
        else if(!(isNumeric(this.state.phone) && this.state.phone.length===11)){
            err_phone = true
            validatation.phone_err = true
        }
        if(this.state.email==="" || this.state.email===null || this.state.email===undefined){
            validatation.email_empty = true
            empty = true
        }
        else if(!validateEmail(this.state.email)){
            err_email = true
            validatation.email_err = true
        }
        if(this.state.password==="" || this.state.password===null || this.state.password===undefined){
            validatation.password_empty = true
            empty = true
        }
        if(this.state.re_password==="" || this.state.re_password===null || this.state.re_password===undefined){
            validatation.re_password_empty = true
            empty = true
        }
        if(!validatation.password_empty && !validatation.re_password_empty){
            if(this.state.password!==this.state.re_password){
                validatation.password_err = true
                validatation.re_password_err = true
                err_pass=true
            }
        }
        let err_msg = ""
        if(empty){
            err_msg += '???????????? ???? ???? '
        }
        if(err_pass){
            err_msg += '???????????? ???? ???????? '
        }
        if(err_email){
            err_msg += '?????????? ???????? '
        }
        if(err_phone){
            err_msg += '???????? ????????'
        }
        if(empty || err_pass || err_email || err_phone){
            this.setState((state,props)=>(validatation))
            this.show(err_msg)
        }
        else{
            //connect server
            this.setState({spinner:true})
            let req = new XMLHttpRequest()
            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    let res = JSON.parse(req.response)
                    console.log(res)
                    if (req.status === 200) {
                        localStorage.setItem('id_token', res.jwt)
                        localStorage.setItem('auth', true)
                        this.setState({spinner:false})
                        this.show(' ???????????????? ???? ???????? ?????? ????????:)')
                        setTimeout(
                            ()=>{
                                this.props.history.push('/home')
                            },
                            2000
                        )
                    } else if (req.status === 400) {
                        this.setState({spinner:false})
                        if (res.status === 4001)
                            this.show('???????? ???? ???? ???????? ???????????? ???????? ????????')
                        else
                            this.show('???????????? ???? ?????? ?????????? ???? ?????????? ?????? ?????? ??????')
                    } else {
                        this.setState({spinner:false})
                        this.show('???????? ???????? ???????? ????????:(')
                        return
                    }
                }
            }.bind(this)
            req.onerror = function() {
                this.setState({spinner:false})
                this.show('???????????? ???? ???????? ?????? ??????:(')
            }.bind(this)
            req.open('POST', 'http://185.166.105.6:31037/signup', true)
            req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            req.send(JSON.stringify({"name":this.state.firstname, "family":this.state.lastname, "email": this.state.email, "password": this.state.password, "phone": this.state.phone}))
        }
    }

    gotoLoginPage(){
        this.props.history.push('/')
    }
    
    render(){
        return(
            <div>
                <SnackBarGlobalContext.Consumer>
                    {(data)=>{
                        this.show = data.showSnackbar
                        return(<div></div>)
                    }}
                </SnackBarGlobalContext.Consumer>
                <div className="card-header">
                    <div className="col-sm-12 text-center">
                        <p className="signup-data-column-info-text" dir="rtl">?????????? ???? ?????????? ??????????! ???????? ???????? ?????????????????? ?????? ?????? ???????? ???? ?????????? ???? ???????? :)</p>
                        <p className="signup-data-column-info-text" dir="rtl">???? ???????? ?????? ???????? ???? ???????? ?????? ???? ?????? ???????????? ?????? ?????? ???????? :)</p>
                    </div>
                </div>
                <div className="card-body signup-card-body">
                    <div className="row  text-center">
                        <div className="col-sm-3"></div>
                        <div className="col-sm-6">
                            <div className="form-group">
                                <div className="form-group row">
                                    <div className="col-sm-12 text-center">
                                        <InputField dir="rtl" value={this.state.firstname} onChange={this.firstnameChange} err={this.state.firstname_err} empty={this.state.firstname_empty} type="text" id="name-inp" placeholder="??????"></InputField>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-sm-12 text-center">
                                        <InputField dir="rtl" value={this.state.lastname} onChange={this.lastnameChange} err={this.state.lastname_err} empty={this.state.lastname_empty} type="text" id="lastname-inp" placeholder="?????? ????????????????"></InputField>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-sm-12 text-center">
                                        <InputField dir="ltr" value={this.state.phone} err={this.state.phone_err} empty={this.state.phone_empty} type="tel" onChange={this.phoneChange} id="phone-inp" placeholder="?????????? ??????????"></InputField>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-sm-12 text-center">
                                        <InputField dir="ltr" value={this.state.email} err={this.state.email_err} empty={this.state.email_empty} type="email" onChange={this.emailChange} id="email-inp" placeholder="??????????"></InputField>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-sm-12 text-center">
                                        <InputField dir="ltr" value={this.state.password} err={this.state.password_err} empty={this.state.password_empty} type="password" onChange={this.passwordChange} id="pass-inp" placeholder="?????? ????????"></InputField>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-sm-12 text-center">
                                        <InputField dir="ltr" value={this.state.re_password} err={this.state.re_password_err} empty={this.state.re_password_empty} type="password" onChange={this.re_passwordChange} id="pass-re-inp" placeholder="?????????? ?????? ????????"></InputField>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <button dir="rtl" className="btn" onClick={this.onSubmit}  id="signup-card-btn">?????? ??????!</button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <p dir="rtl" className="signup-data-column-text">
                                            ???? ??????????????? ?????????? ?????? ???????? 
                                            <a dir="rtl" className="link-color" onClick={this.gotoLoginPage}> ???????? ??????!</a>
                                        </p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <Loader type="BallTriangle" color="#FF6B6B" visible={this.state.spinner} height={50} width={50}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3"></div>
                    </div>
                </div>
            </div>
        )
    }
}

class SignupPageUpperRow extends Component {
    
    render(){
        return(
            <div className="row" id="signup-upper-row">
                <div className="signup-layer"></div>
                <div className="col-sm-12 text-center">
                    <img alt="" src={require('../../assets/LOGO.png')} id="upper-row-img"></img>
                    <h2 dir="rtl" id="upper-row-title">???????????????? ???????? ?????????? ?????? ???? ?????????????? ??????????</h2>
                </div>
            </div>
        )
    }
}