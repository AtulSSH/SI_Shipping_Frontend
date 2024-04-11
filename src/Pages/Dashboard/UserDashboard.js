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
import {PowerSettingsNew,History,Report} from '@material-ui/icons'
import HistoricalFragment from '../../Fragments/HistoricalFragment';
import DailyFragment from "../../Fragments/DailyFragment";
import logo1 from "../../images/Images/smart-ship-logo-white.png";
import logo2 from "../../images/Images/SI-Sipping-logo.png";



const drawerWidth = 240;


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
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
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

class User extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fragment:'DAILY',
            login:false,
            token:null,
            selectedIndex:0
        }
    }

    componentDidMount() {
        let store = JSON.parse(sessionStorage.getItem('token'));
        if(store !== null){
            this.setState({login:true,token:store.token});
        }
        else{
            this.props.history.push('/sisl-psc-fsi/login');
        }
    }


    loadFragment = () => {
        switch (this.state.fragment) {
            case "DAILY":
                return <DailyFragment/>
            case "HISTORICAL":
                return <HistoricalFragment/>

            case "LOGOUT":
                return;
            default:
                break;

        }
    }

    logout=()=>{
        sessionStorage.removeItem('token');
        this.setState({login:false})
        this.props.history.push('/sisl-psc-fsi/login');
    }



    render() {
        const {classes} = this.props;
        return (
            <ThemeProvider theme={typographyTheme}>
                 <div>
                if(this.state.login)
                {
                    <div className={classes.root}>
                        <CssBaseline/>
                        <AppBar position="fixed" className={classes.appBar}>
                            <Toolbar>
                                <Typography variant="h6" noWrap style={{ flex: 1 }}>
                                    <img alt = "logo" src={logo1} height="50px"/>
                                </Typography>
                                <div>
                                    <img alt = "logo" src={logo2} height="40px" />
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
                                    <ListItem  selected={this.state.selectedIndex === 0}
                                               button
                                               onClick={() => this.setState({fragment: "DAILY",selectedIndex:0})}
                                    >
                                        <ListItemIcon>
                                            <Report/>
                                        </ListItemIcon>
                                        <ListItemText primary="Current Day Report"/>
                                    </ListItem>
                                </List>

                                <List>
                                    <ListItem selected={this.state.selectedIndex === 1}
                                              button
                                              onClick={() => this.setState({fragment: "HISTORICAL",selectedIndex:1})}
                                    >
                                        <ListItemIcon>
                                            <History/>
                                        </ListItemIcon>
                                        <ListItemText primary="Historical Report"/>
                                    </ListItem>
                                </List>


                                <Divider/>
                                <List>
                                    <ListItem button onClick={this.logout}>
                                        <ListItemIcon>
                                            <PowerSettingsNew/>
                                        </ListItemIcon>
                                        <ListItemText primary="Logout"/>
                                    </ListItem>
                                </List>


                            </div>
                        </Drawer>
                        <main className={classes.content}>
                            <Toolbar/>
                            {this.loadFragment()}
                        </main>

                    </div>
                }



            </div>
            </ThemeProvider>
        );
    }
}

export default withStyles(styles)(User);
