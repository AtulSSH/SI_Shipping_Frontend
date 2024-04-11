import React,{Component} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import logo1 from "../../images/Images/smart-ship-logo-white.png";
import logo2 from "../../images/Images/SI-Sipping-logo.png";
import vesselImage from "../../images/Images/Feather.jpg";
import 'react-toastify/dist/ReactToastify.css';
import {
    validateUser
} from '../../api';
import CustomFooter from "../../layout/customFooter";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';




const styles = theme => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#01579b',
    },
});


const typographyTheme = createMuiTheme({
    typography: {
        font: '15px/15px \'Open Sans\', sans-serif',
        fontFamily: [
            'Open Sans',
        ].join(','),
    }
});

class Login extends Component {

    constructor(props) {
        super(props);
        this.state={
            User:{
                email: null,
                password: null,
            },
            isChecked: false,
            loading:false,
            open:false,
            m:''
        }
    }

    componentDidMount() {
        if (localStorage.checkbox && localStorage.email !== "") {
            this.state.User.email = localStorage.username;
            this.state.User.password = localStorage.password;
            this.state.isChecked = localStorage.checkbox;
        }
    }

    onChangeCheckbox = event => {
        this.setState({
            isChecked: event.target.checked
        })

    }

    onLoginInputChange =(e)=> {
        const {name, value} = e.target;
        let{User} = this.state;

        const currentState = User;
        currentState[name] = value;
        this.setState({ user: currentState});

    }

    onLoginSubmit = () =>{
        this.setState({loading:true})
        const {User,isChecked} = this.state
        if (isChecked && User.email !== "") {
            localStorage.username = User.email
            localStorage.password = User.password
            localStorage.checkbox = isChecked
        }
        const payload = {
            usernameOrEmail:this.state.User.email,
            password:this.state.User.password
        }
        validateUser(this.onSuccess, this.onFailure, payload).then(() => {});

    }

    handleCloseLoading = () => {
        this.setState({loading: false});
    }

    onSuccess=(res)=> {
        if (res.status === 200) {
             if (res.data.accessToken) {
                 window.localStorage.setItem('token', JSON.stringify({
                         login: true,
                         token: res.data.accessToken,
                         firstName: res.data.firstName,
                         role:res.data.roles[0].name,
                         privilege:res.data.privilege,
                         username:res.data.username
                     })
                 )
                 this.setState({loading:false})
                 this.props.history.push('/sisl-psc-fsi/dashboard');

             }
         }
             else{
                this.setState({loading:false})

             }

        }




    onFailure=(err)=>{
        this.setState({loading:false})
        this.setState({open:true});
        this.setState({m:'Username or password does not match'})

    }

    forgotPassword=()=>{
        this.props.history.push('/sisl-psc-fsi/resetPassword');
    }



    render() {
        const {classes} = this.props;
        const {open,m} = {...this.state};
        const horizontal="center"
        const vertical="top"
        return (
           <ThemeProvider theme={typographyTheme}>
           <CssBaseline/>
               <div className={classes.root}>
                   <AppBar position="fixed" className={classes.appBar} style={{backgroundColor:"#403E40"}} >
                       <Toolbar>
                           <Typography variant="h6" noWrap style={{ flex: 1 }}>
                               <img alt = "logo" src={logo1} height="50px"/>
                           </Typography>
                           <div style={{display:"flex"}}>
                               <Typography variant="h6" noWrap>
                                   <img alt = "logo" src={logo2} height="35px"
                                        style={{borderRadius:'50%',display:"inline-block",verticalAlign:"middle",margin:'10px'}} />
                               </Typography>

                               <Typography style={{
                                   marginLeft:'5px',
                                   textTransform: 'uppercase',
                                   fontWeight:700,
                                   margin:'auto'
                               }}  noWrap>
                                   SEVEN ISLANDS SHIPPING LIMITED
                               </Typography>
                           </div>


                       </Toolbar>
                   </AppBar>
                   <Grid item xs={12} sm={12} md={12} className={classes.image} >
                       <img style={{position:'fixed',opacity:'0.7'}} src={vesselImage}

                       />

                   </Grid>
                   <Grid container  style={{zIndex:'0',background:'transparent'}} >
                       <Grid item xs={12} sm={4} md={4}   style={{boxShadow:'0 0 black',background:'white',zIndex:'0',margin:'3%',
                           padding:'2%',marginTop:'10%',marginLeft:'4%',borderRadius:'8px 8px 8px 8px'}}>
                           <div >
                               <h1 style={{color:'#1F3F49',textAlign:'center'}}>PSC-FSI Reporting System</h1>
                               <div>
                                   <Avatar style={{margin:'auto'}} className={classes.avatar}>
                                       <LockOutlinedIcon />
                                   </Avatar>
                               </div>
                               <Typography  style={{color:'#1F3F49',textAlign:'center'}} component="h1" variant="h5">
                                   Sign in
                               </Typography>
                               <form className={classes.form} noValidate>
                                   <TextField
                                       variant="outlined"
                                       margin="dense"
                                       required
                                       fullWidth
                                       id="emailOrUsername"
                                       label="Email Or Username"
                                       name="email"
                                       value={this.state.User.email || ''}
                                       autoComplete="email"
                                       onChange={this.onLoginInputChange}
                                   />
                                   <TextField
                                       variant="outlined"
                                       margin="dense"
                                       required
                                       fullWidth
                                       name="password"
                                       label="Password"
                                       type="password"
                                       value={this.state.User.password || ''}
                                       id="password"
                                       onChange={this.onLoginInputChange}
                                   />
                                   <FormControlLabel
                                       control={
                                           <Checkbox
                                               name="lsRememberMe"
                                               color="primary"
                                               checked={Boolean(this.state.isChecked)}
                                               onChange={this.onChangeCheckbox}
                                           />
                                       }
                                       label="Remember me"
                                   />
                                   <Button
                                       fullWidth
                                       variant="contained"
                                       color="primary"
                                       onClick={this.onLoginSubmit}
                                       className={classes.submit}
                                       style={{background:'royalblue'}}
                                   >
                                       Sign In
                                   </Button>
                                   <Grid container>
                                       <Grid item xs>
                                           <Link style={{cursor:'pointer',textDecoration:'none'}}
                                                 onClick={this.forgotPassword} variant="body2">
                                               Forgot password?
                                           </Link>
                                       </Grid>

                                   </Grid>

                               </form>
                           </div>
                       </Grid>

                   </Grid>

                   <CustomFooter />
                   <Backdrop className={classes.backdrop} open={this.state.loading} onClick={this.handleCloseLoading}>
                       <CircularProgress color="inherit" />
                   </Backdrop>
                   <Snackbar
                       open={{open}}
                       anchorOrigin={{vertical,horizontal}}
                       autoHideDuration={3000}
                       tr
                       onClose={() => this.setState({open: false})}>
                       <MuiAlert style={{display:open?"inherit":"none"}} severity="error">
                           {m}
                       </MuiAlert>
                   </Snackbar>
               </div>
           </ThemeProvider>
        );
    }
}

export default withStyles(styles)(Login);
