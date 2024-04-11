import React, {Component} from 'react';
import {createMuiTheme, MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import {getAllUsers, getUserByID, registerUser, suspendUserByID, updateUser} from "../api";
import MaterialTable, {MTableToolbar} from "material-table";
import {Backdrop, Button, Container, Fade, Grid, Modal, TextField} from '@material-ui/core';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormLabel from "@material-ui/core/FormLabel";
import edit from '../../src/images/editNew-24.png';
import deleteImg from '../../src/images/denied-30.png';
import addUser from '../../src/images/icons8-add-user-male-32.png';
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";


const theme = createMuiTheme({
    palette: {
        secondary: {
            main: '#37b159',
            light: '#37b159',
            dark: '#37b159',
        }
    },
    typography: {
        font: '15px/15px \'Open Sans\', sans-serif',
        fontFamily: [
            'Open Sans',
        ].join(','),
    }
});

const styles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 2, 2),
        outline:'none',
        width:'65%'

    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    group: {
        width: 'auto',
        height: 'auto',
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'row',

    },

});

class AddUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            User: {
                id:null,
                firstName:null,
                lastName:null,
                email:null,
                password:null,
                username:null,
            },
            GetUser:{
                id:'',
                firstName:'',
                lastName:'',
                email:'',
                username:'',
                privileges: '',
            },
            token:null,
            data:[{
                id:'-',
                firstName:'-',
                lastName:'-',
                email:'-',
                username:'-',
                privileges:'-'
            }],
            columns:
                [
                    { title: 'First Name', field: 'firstName',width:'2px'},
                    { title: 'Last Name', field: 'lastName', width:'2px'},
                    { title: 'Email', field: 'email' , width:'2px'},
                    { title: 'User Name', field: 'username', width:'2px'},
                    { title: 'Permission',field:'privileges', width:'2px'}

                ],
            popup: false,
            heading:'',
            selectedData:[],
            isEdit:false,
            isView:false,
            severity:"error",
            openDialog:false,
            open:false


        }
    }

    componentDidMount() {
        let store = JSON.parse(localStorage.getItem('token'));
        if(store !== null) {
            this.setState({token: store.token});
            this.userLoader();
        }
        else{
            this.props.history.push('/sisl-psc-fsi/login');
        }
    }


    userLoader=()=>{
        let store = JSON.parse(localStorage.getItem('token'));
        if(store !== null){
            this.setState({token:store.token});
            let tok = "Bearer " + store.token;

            const header = {
                'Authorization': tok
            }
            getAllUsers(this.onGetAllUsersSuccess,this.onGetAllUsersFailure,header);

        }

    }

    onGetAllUsersSuccess=(res)=>{
        this.setState({data:res.data});
    }

    onGetAllUsersFailure=(err)=>{

    }

    onRegisterInputChange =(e)=> {
        const {name, value} = e.target;
        let{User} = this.state;

        const currentState = User;
        currentState[name] = value;
        this.setState({ user: currentState});
        //this.setState({ GetUser: currentState});
    }

    onPrivilegeChange=(e)=>{
        if(e.target.name === 'edit' && e.target.checked){
            this.state.User.edit = true
        }
        else if(e.target.name === 'delete' && e.target.checked){
            this.state.User.delete = true
        }
        else{
            this.state.User.edit = false;
            this.state.User.delete = false;
        }
    }



    onUpdateUserSubmitClick = () =>{

        const{User,GetUser,isEdit,isView} = this.state;
        let prev;

        if(isEdit)
            prev = "0";
        else if(isView)
            prev = "1"


        const payload = {
            id: GetUser.id,
            firstName: (User.firstName !== null) ? User.firstName : GetUser.firstName,
            lastName: (User.lastName !== null) ? User.lastName : GetUser.lastName,
            username: (User.username !== null) ? User.username : GetUser.username,
            email: (User.email !== null) ? User.email : GetUser.email,
            privileges: prev

        }

        let store = JSON.parse(localStorage.getItem('token'));
        if(store !== null) {
            this.setState({token: store.token});
            let tok = "Bearer " + store.token;

            const header = {
                'Authorization': tok
            }
            updateUser(this.onUpdateUserSuccess, this.onUpdateUserFailure, payload, header);

            // send to server
        }

    }


    onUpdateUserSuccess=(res)=>{
        this.setState({m:res.data.message,open:true,severity:'success'});
        if(res.data.status == "true"){
            this.popupClose();
            this.resetForm();
            this.userLoader();
        }


    }

    onUpdateUserFailure=(err)=>{

    }



    onRegisterSubmit = () =>{

        const {User,isEdit,isView} = this.state;
        let store = JSON.parse(localStorage.getItem('token'));
        let tok = "Bearer "+store.token;
        let prev;

        const header={
            'Authorization':tok
        }

        if(isEdit)
            prev = "0";
        else if(isView)
            prev = "1"

        const payload = {
            firstName : User.firstName,
            lastName : User.lastName,
            username : User.username,
            email : User.email,
            password : User.password,
            privileges: prev
        }
        if( !payload.firstName || payload.firstName.trim() === ''){
            this.setState({m:"Please enter first name",severity:'info',open:true});
            return
        }
        if(!payload.email || payload.email.trim() === ''){
            this.setState({m:"Please enter email Id",severity:'info',open:true});
            return
        }
        if(!payload.username || payload.username.trim() === ''){
            this.setState({m:"Please enter username",severity:'info',open:true});
            return
        }
        if(!payload.password || payload.password.trim() === ''){
            this.setState({m:"Please enter password",severity:'info',open:true});
            return
        }
        if(payload.privileges == null || payload.privileges.trim() === ''){
            this.setState({m:"Role must be selected",severity:'info',open:true});
            return
        }
        registerUser(this.onSuccess,this.onFailure,payload,header);

    }

    onSuccess=(res)=> {
        if (res.data.status === true) {
            this.setState({m:res.data.message,open:true,severity:"success"});
            this.popupClose();
        }
        else{
            this.setState({open:true,m:res.data.message})
        }
        this.userLoader();
    }



    onFailure=(err)=>{

    }


    popupClose = () => {
        this.setState({popup: false});
    }

    popupShow = () => {
        this.setState({popup: true});
    }

    fetchUserID=(id)=>{
        this.setState({heading:'Edit User Details',m:''});
        let store = JSON.parse(localStorage.getItem('token'));
        let tok = "Bearer "+store.token;

        const header={
            'Authorization':tok
        }

        const payload = {
            "id":id
        }
        getUserByID(this.getUserByIDSuccess,this.getUserByIDFailure,payload,header);


    }

    getUserByIDSuccess=(res)=>{
        if(res.data.privileges === '0')
            this.setState({isEdit:true})
        else if(res.data.privileges === '1')
            this.setState({isView:true})

        this.setState({GetUser:res.data,disableUserName:true});
        this.popupShow();
    }

    getUserByIDFailure=(err)=>{


    }

    addUser=()=>{
        this.resetForm();
        this.setState({heading:'Add User',m:'',isEdit:true});
        this.popupShow();

    }

    resetForm=()=>{
        const {GetUser} = this.state;
        GetUser.id = '';
        GetUser.username = '';
        GetUser.email = '';
        GetUser.firstName = '';
        GetUser.lastName = '';
        GetUser.password = '';
        this.setState({isEdit:false,disableUserName:false,deleteUserId:false,isView:false});

    }

    deleteUser=()=>{
        const id = this.state.deleteUserId;
        let store = JSON.parse(localStorage.getItem('token'));
        let tok = "Bearer "+store.token;
        const header={
            'Authorization':tok
        }

        const payload = {
            "id":id
        }
        if(id !== 1) {
            suspendUserByID(this.suspendUserByIDSuccess, this.suspendUserByIDFailure, payload, header);
        }
        else{
            alert("Admin cannot be deleted")
        }
        this.setState({deleteUserId:null});
    }

    askForConfirmation = (id) =>{
        this.setState({openDialog:true})
        this.setState({deleteUserId:id});
    }

    suspendUserByIDSuccess=(res)=>{
        this.userLoader();
        if(res.data.status==="true"){
            this.setState({open:true,m:res.data.message,severity:"info"})
        }else{
            this.setState({open:true,m:res.data.message,severity:"error"})
        }
    }

    suspendUserByIDFailure=(err)=>{

    }


    render() {
        const {classes} = this.props;
        const {data,columns,GetUser,m,heading,User} = {...this.state};
        const {open,disableUserName,severity,openDialog} = this.state;
        const horizontal = "center"
        const vertical = "top"
        let cnt = 0
        let deleteUserId
        data.forEach(item=>{
            Object.entries(item).forEach((key)=>{
                if(key[0] === "privileges"){
                    if(data[cnt].privileges === '0')
                        data[cnt].privileges = 'Edit';
                    else if(data[cnt].privileges === '1')
                        data[cnt].privileges = 'View Only';
                    cnt++;
                }
            })
        })

        return (

            <MuiThemeProvider theme={theme}>
                <Container maxWidth="lg" fixed >

                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        className={classes.modal}
                        open={this.state.popup}
                        onClose={this.popupClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                            timeout: 500,
                            invisible:true
                        }}
                        style={{
                            marginLeft:'30%',
                            width:'45%',
                        }}
                    >
                        <Fade in={this.state.popup}>
                            <div className={classes.paper} >
                                <Container maxWidth="sm">
                                    <form className={classes.form} noValidate>
                                        <Grid container spacing={2}>

                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    name="firstName"
                                                    fullWidth
                                                    id="firstName"
                                                    defaultValue={GetUser.firstName}
                                                    label="First Name"
                                                    required
                                                    onChange={this.onRegisterInputChange}
                                                    autoFocus={true}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    name="lastName"
                                                    fullWidth
                                                    id="lastName"
                                                    defaultValue={GetUser.lastName}
                                                    label="Last Name"
                                                    onChange={this.onRegisterInputChange}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={12}>
                                                <TextField
                                                    name="email"
                                                    fullWidth
                                                    id="email"
                                                    label="Email ID"
                                                    type="email"
                                                    defaultValue={GetUser.email}
                                                    required
                                                    onChange={this.onRegisterInputChange}

                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12}>
                                                <TextField
                                                    name="username"
                                                    fullWidth
                                                    id="username"
                                                    label="Username"
                                                    defaultValue={GetUser.username}
                                                    required
                                                    disabled={disableUserName}
                                                    onChange={this.onRegisterInputChange}

                                                />
                                            </Grid>
                                            {heading !== 'Edit User Details' ?
                                                <Grid item xs={12} sm={12}>
                                                    <TextField
                                                        name="password"
                                                        fullWidth
                                                        id="password"
                                                        type="password"
                                                        label="Password"
                                                        required
                                                        onChange={this.onRegisterInputChange}

                                                    />
                                                </Grid> :
                                                <div> </div>
                                            }
                                            <Grid item xs={12} sm={12}>
                                                <FormLabel component="legend">Access</FormLabel>
                                            </Grid>
                                            <Grid item xs={12} sm={12}>
                                                <FormControlLabel
                                                    checked={this.state.isEdit}
                                                    control={<Checkbox color="primary" />}
                                                    label="Edit"
                                                    name="edit"
                                                    labelPlacement="start"
                                                    style={{
                                                        marginLeft:'-1px',

                                                    }}
                                                    onChange={(e) => {
                                                        this.setState({ isEdit: e.target.checked ,isView: !e.target.checked });
                                                    }}
                                                />
                                                <FormControlLabel
                                                    checked={this.state.isView}
                                                    control={<Checkbox color="primary" />}
                                                    label="View"
                                                    name="view"
                                                    labelPlacement="start"
                                                    onChange={(e) => {
                                                        this.setState({ isView: e.target.checked ,isEdit:!e.target.checked});
                                                    }}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={this.popupClose}
                                                >
                                                    Cancel
                                                </Button>
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                { heading === 'Add User' ?

                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        color="primary"
                                                        className={classes.submit}
                                                        onClick={this.onRegisterSubmit}
                                                    >
                                                        Add User
                                                    </Button>
                                                    :
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="primary"
                                                    className={classes.submit}
                                                    onClick={this.onUpdateUserSubmitClick}
                                                >
                                                    Update User
                                                </Button>

                                            }
                                            </Grid>



                                        </Grid>
                                    </form>

                                </Container>
                            </div>
                        </Fade>
                    </Modal>




                    <MaterialTable
                        title="Users"
                        columns={columns}
                        data={data}
                        components={{
                            Toolbar: props => (
                                <div style={{ backgroundColor: '#e8eaf5' }}>
                                    <MTableToolbar {...props} />
                                </div>
                            ),

                        }}

                        actions={[

                            {
                                icon:()=><img src={addUser}
                                              alt="add User"
                                              height="25px"
                                />,
                                tooltip: 'Add User',
                                isFreeAction: true,
                                onClick: () => {this.addUser()}
                            },
                            {
                                icon:()=><img src={edit} height="20px" />,
                                tooltip:'edit',
                                position:'row',
                                onClick: (event, rowData) => {this.fetchUserID(rowData.id)}
                            },
                            {
                                icon:()=><img src={deleteImg} height="20px"/>,
                                tooltip:'Delete',
                                position:'row',
                                onClick: (event, rowData) => {
                                    this.askForConfirmation(rowData.id)
                                }
                            },

                        ]}


                        options={{
                            search:true,
                            paging:false,
                            filtering:false,
                            maxBodyHeight: '480px',
                            actionsColumnIndex:-1,
                            headerStyle: {
                                width: 26,
                                whiteSpace: 'nowrap',
                                textAlign: 'center',
                                flexDirection: 'row',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                padding:'10px',
                                backgroundColor: '#01579b',
                                color: 'white',
                                border:'none',
                                fontWeight:'bold'
                            },
                            rowStyle: {
                                background: '#f5f5f5',
                                textAlign: 'center',
                                height:10,
                                padding:'5px',


                            },
                            cellStyle: {
                                borderRight: '1px solid lightgrey',
                                textAlign: 'center',
                            },

                        }}

                    />
                    <Snackbar
                        open={Boolean(open)}
                        anchorOrigin={{vertical,horizontal}}
                        autoHideDuration={3000}
                        onClose={() => this.setState({open: false,severity:'error'})}>
                        <MuiAlert style={{display:open?"inherit":"none"}} severity={severity}>
                            {m}
                        </MuiAlert>
                    </Snackbar>


                    <Dialog
                        open={Boolean(openDialog)}
                    >
                        <DialogContent>
                            <DialogContentText>
                                Do you want to delete user?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus onClick={() => {
                                this.setState({openDialog: false})
                                this.resetForm();
                            }} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={() => {
                                this.setState({openDialog: false})
                                this.deleteUser();
                            }} color="primary">
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>


                </Container>
            </MuiThemeProvider>




        );
    }

}

export default withStyles(styles)(AddUser);

