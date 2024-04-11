import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CustomFooter from "../../layout/customFooter";
import Typography from '@material-ui/core/Typography';
import {createMuiTheme, MuiThemeProvider, ThemeProvider, withStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import logo1 from "../../images/Images/smart-ship-logo-white.png";
import logo2 from "../../images/Images/SI-Sipping-logo.png";
import {updatePassword} from "../../api";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";




const theme = createMuiTheme({
    palette: {
        secondary: {
            main: '#37b159',
            light: '#37b159',
            dark: '#37b159',
        }
    },
});


const styles = theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(5),
        backgroundColor: 'darkred',
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
});

const typographyTheme = createMuiTheme({
    typography: {
        font: '15px/15px \'Open Sans\', sans-serif',
        fontFamily: [
            'Open Sans',
        ].join(','),
    },
});


class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            User: {
                email: null,
                password: null,
            },
            msg:'',
            open:false,
            severity:"error"
        }
    }


    cancelProcess=()=>{
        this.props.history.push('/sisl-psc-fsi/login');
    }


    handleChange =(e)=> {
        const {name, value} = e.target;
        let{User} = this.state;

        const currentState = User;
        currentState[name] = value;
        this.setState({ user: currentState});

    }

    onSubmit = () =>{
        const {User} = this.state;
        const payload = {
            email:User.email,
            password:User.password
        }
        updatePassword(this.onSuccess, this.onFailure, payload);

    }

    onSuccess=(res)=> {
        if (res.status === 200) {
                this.setState({msg:res.data,open:true,severity:"info"});
            }
        else{
            this.setState({msg:res.data,open:true,severity:"error"});
        }

    }

    onFailure=(err)=>{

    }

    render() {

        const {classes} = this.props;
        const horizontal = "center"
        const vertical = "top"
        const {open,severity,msg} = {...this.state};
        return (

                <div >

            <AppBar position="fixed" className={classes.appBar} style={{background:'#403E40'}} >
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
                    <ThemeProvider theme={typographyTheme}>
            <Container component="main" maxWidth="xs">
                <div className={classes.paper} >
                    <img src="https://img.icons8.com/flat_round/64/000000/recurring-appointment.png"
                         height="45px"
                    style={{marginTop:'30px',marginBottom:'10px'}}
                    />

                    <Typography component="h1" variant="h5">
                        Reset Password
                    </Typography>
                    <Typography component="h4" variant="h7"
                        style={{color:'green'}}
                    >
                    </Typography>

                    <form className={classes.form} noValidate style={{vh:'100%'}}>
                        <MuiThemeProvider theme={typographyTheme}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>

                            <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            onChange={this.handleChange}
                            autoComplete="email"
                            autoFocus
                        />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="New Password"
                            type="password"
                            id="password"
                            onChange={this.handleChange}
                            autoComplete="current-password"
                        />
                            </Grid>

                        <Grid item xs={12} sm={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={this.cancelProcess}
                            >
                                Cancel
                            </Button>
                        </Grid>
                            <Grid item xs={12} sm={6}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={this.onSubmit}
                        >
                            Reset Password
                        </Button>

                        </Grid>
                        </Grid>


                        </MuiThemeProvider>
                    </form>
                    <CustomFooter />
                </div>
            </Container>

            <Snackbar
                open={Boolean(open)}
                anchorOrigin={{vertical,horizontal}}
                autoHideDuration={3000}
                onClose={() => this.setState({open: false,severity:'error'})}>
                <MuiAlert style={{display:open?"inherit":"none"}} severity={severity}>
                    {msg}
                </MuiAlert>
            </Snackbar>
                    </ThemeProvider>
            </div>

        );
    }
}

export default withStyles(styles)(ResetPassword);
