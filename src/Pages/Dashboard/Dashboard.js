import React, {Component} from 'react';
import {createMuiTheme, ThemeProvider, withStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import logo from '../../images/logo.png';
import {PersonAdd,PowerSettingsNew,History,Report} from '@material-ui/icons'
import HistoricalFragment from '../../Fragments/HistoricalFragment';
import DailyFragment from "../../Fragments/DailyFragment";
import AddUser from '../../Fragments/AddUser';
import CustomFooter from "../../layout/customFooter";
import logo1 from "../../images/Images/smart-ship-logo-white.png";
import logo2 from "../../images/Images/SI-Sipping-logo.png";
import './style.css';
import EditScreen from "../../Fragments/EditScreen";


const drawerWidth = '15%'

const styles = theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,

    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        height:'calc(100% - 31px)'
    },
    drawerContainer: {
        overflow: 'hidden',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(1),
        width:'100%',
        overflowX: "hidden"
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

class Admin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fragment:'HISTORICAL',
            login:false,
            token:null,
            firstName:'',
            role:'',
            selectedIndex:0,
            username:'',
        }
    }

    componentDidMount() {
        let store = JSON.parse(window.localStorage.getItem('token'));
        if(store !== null){
            this.setState({
                login:true,
                token:store.token,
                firstName:store.firstName,
                role:store.role,
                username:store.username
            });
        }
        else{
            this.props.history.push('/sisl-psc-fsi/login');
        }
    }


    loadFragment = () => {
        switch (this.state.fragment) {
            case "EDIT":
                return <EditScreen />
            case "HISTORICAL":
                return <HistoricalFragment/>
            case "ADD_USER":
                return <AddUser/>
            case "LOGOUT":
                return;
            default:
                break;

        }
    }

    logout=()=>{
        localStorage.removeItem('token');
        this.setState({login:false})
        this.props.history.push('/sisl-psc-fsi/login');
    }



    render() {
        const {classes} = this.props;
        return (
            <ThemeProvider theme={typographyTheme}>

                if(this.state.login)
                {
                    <div className={classes.root}>
                        <CssBaseline/>
                        <AppBar position="fixed" style={{background:'#403E40'}} className={classes.appBar}>
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
                        <Drawer
                            className={classes.drawer}
                            variant="permanent"
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                        >
                            <Toolbar/>
                            <div className={classes.drawerContainer}>
                                <List>
                                    <ListItem>
                                        <Typography style={{color:'darkred',fontSize:'19px'}}>
                                        {"Welcome "+this.state.firstName}
                                        </Typography>

                                    </ListItem>
                                </List>

                                <List style={{padding:0}}>
                                    <ListItem  selected={this.state.selectedIndex === 0}   button onClick={() => this.setState({fragment: "HISTORICAL",selectedIndex:0})}>
                                        <ListItemIcon>
                                            <History/>
                                            <Typography style={{
                                                marginLeft:'10px',
                                                color:'black',
                                                alignSelf:'center'
                                            }}>Report</Typography>
                                        </ListItemIcon>
                                        </ListItem>
                                </List>

                                {this.state.username !=='SISL' &&
                                    <List style={{padding: 0}}>
                                        <ListItem selected={this.state.selectedIndex === 1} button
                                                  onClick={() => this.setState({fragment: "EDIT", selectedIndex: 1})}>
                                            <ListItemIcon>
                                                <Report/>
                                                <Typography style={{
                                                    marginLeft: '10px',
                                                    color: 'black',
                                                    alignSelf: 'center'
                                                }}>Edit</Typography>
                                            </ListItemIcon>
                                        </ListItem>
                                    </List>
                                }

                                {this.state.role === 'ROLE_ADMIN' && this.state.username !=='SISL' ?
                                    <List style={{padding:0}}>
                                        <ListItem selected={this.state.selectedIndex === 2} button
                                                  onClick={() => this.setState({
                                                      fragment: "ADD_USER",
                                                      selectedIndex: 2
                                                  })}>
                                            <ListItemIcon>
                                                <PersonAdd/>
                                                <Typography  style={{
                                                    marginLeft:'10px',
                                                    color:'black',
                                                    alignSelf:'center'
                                                }}>Add User</Typography>
                                            </ListItemIcon>
                                        </ListItem>
                                    </List>
                                    :<div> </div>
                                }


                                    <Divider/>

                                <List style={{padding:0}}>
                                    <ListItem  button onClick={this.logout}>
                                        <ListItemIcon>
                                            <PowerSettingsNew/>
                                            <Typography style={{
                                                marginLeft:'10px',
                                                color:'black',
                                                alignSelf:'center'
                                            }}>Logout</Typography>
                                        </ListItemIcon>
                                    </ListItem>
                                </List>

                            </div>
                        </Drawer>
                        <main className={classes.content}>
                            <Toolbar/>
                            {this.loadFragment()}
                        </main>
                        <CustomFooter className={classes.appBar} />
                    </div>
                }

            </ThemeProvider>



        );
    }
}

export default withStyles(styles)(Admin);
