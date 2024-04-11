import React, {Component} from 'react';
import MaterialTable from 'material-table';

import {addNewRecord, deleteRecord, getAllVessels, getDetailedRecordsByFilter, updateDetailedData} from '../api';

import {Button, Container, Grid} from '@material-ui/core';
import {createMuiTheme, ThemeProvider, withStyles} from '@material-ui/core/styles';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";


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

const today = new Date();
const TODAY = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();

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
        padding: theme.spacing(1, 1, 1),
        outline: 'none',
        width: '65%'

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
    formControl: {
        margin: theme.spacing(1),
        minWidth: 150,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    menuPaper: {
        maxHeight: 200
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#01579b',
    },
});



class EditFragment extends Component {
    constructor(props) {
        super(props);

        let store = JSON.parse(localStorage.getItem('token'));
        this.header = {}
        this.privilege = '';
        this.username = '';
        if (store !== null) {
            let tok = "Bearer " + store.token;
            this.privilege = store.privilege;
            this.username = store.username;
            this.header = {
                'Authorization': tok
            }
        }

        this.state = {

            data: [{
                id: null,
                checklistReference: null,
                description: null,
                targetDate: null,
                status: null,
                shipMetaId:null

            }],

            columns:
                [
                    {title: 'Sr No.',width:'3px', render: rowData => <div>{rowData.id !== null ?rowData.tableData.id + 1:''}</div> },
                    {title: 'Checklist Reference',width:'5px', field:'checklistReference'},
                    {title: 'Description', height:'20px',width:'700px', field: 'description'},
                    {title: 'Target Date(DD/MM/YYYY)',width:'200px',height:'20px', field: 'targetDate',type:"date"},
                    {title: 'Status',width:'200px',height:'20px', field: 'status',lookup:{'Open':'Open','Closed':'Closed','In progress':'In progress'}},
                ],

            table: {
                minWidth: 650,
            },
            popup: false,
            Options: [],
            selectedDate:TODAY,
            selectedOption:'Elegant',
            shipMetaId:null,
            loading:false

        };
        this.tableRef = React.createRef();
    }

    componentDidMount = () => {
        this.getTodayDate();
        this.popupShow();
        this.getHistoricalData()

    }

    onSuccess = (res) => {
        if (res.data) {
            this.setState({data: res.data});
        }
    }


    getHistoricalData = () => {
        this.setState({loading:true})
        const payload = {
            "receivedDate": this.state.selectedDate,
            "vesselName": this.state.selectedOption,
        }
        getDetailedRecordsByFilter(this.onReceivedDataSuccess, this.onReceivedDataFailure, payload, this.header);
    }

    parseDate = (string) => {
        if (string === null)
            return "";
        else {
            let a = new Date(string).toLocaleDateString('en-GB');
            if (a === 'Invalid Date') return "";
            else return a;
        }
    }

    handleCloseLoading = () => {
        this.setState({loading: false});
    }


    onReceivedDataSuccess = (res) => {
        if(res.data) {
            this.setState({
                data: res.data,
                loading:false
            });
            this.state.shipMetaId = res.data[0].shipMetaId;
        }

    }

    onReceivedDataFailure = (err) => {

        this.setState({loading:false});
    }


    popupClose = () => {
        this.setState({popup: false});
    }

    popupShow = () => {
        getAllVessels(this.onGetAllVesselsSuccess, this.onGetAllVesselsFailure, this.header);
    }


    onGetAllVesselsSuccess = (res) => {
        const options = res.data.map(d => ({
            "value": d.id,
            "label": d.vesselName,
        }))
        this.setState({Options: options, selectedVessel: options});

    }

    onGetAllVesselsFailure = (err) => {

    }

    handleSelectChange = (rowData) => {
        this.setState({selectedData: rowData});
    }


    onSelect = (e) => {
        this.setState({ selectedOption:e.target.value });
    };

    getTodayDate = () => {
        this.setState({selectedDate:TODAY})
    }

    getPreviousDate = () => {
        return today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + ((today.getDate() - 3 % 30) < 10 ? '0' : '') + (today.getDate() - 3 % 30)
    }

    handleRowUpdate=(newData, oldData, resolve)=>{
        this.correctDateFormat(newData);
        updateDetailedData(this.updateDetailedDataSuccess,this.updateDetailedDataFailure,newData,this.header)
        resolve();

    }

    correctDateFormat = (newData)=>{
        if(newData.targetDate && (Object.prototype.toString.call(newData.targetDate) === '[object Date]')){
            const df = new DateFnsUtils();
            const formattedDate =  df.format(newData.targetDate,"dd-MMM-yyyy");
            newData.targetDate = formattedDate;
        }
    }


    updateDetailedDataSuccess=(res)=>{
        if(res.data){
            this.getHistoricalData();
        }
    }
    updateDetailedDataFailure=(err)=>{

    }

    handleRowAdd=(newData,resolve)=>{
        newData.shipMetaId = this.state.shipMetaId;
        this.correctDateFormat(newData);
        addNewRecord(this.addNewRecordSuccess,this.addNewRecordFailure,newData,this.header);
        resolve();
    }

    addNewRecordSuccess=(res)=>{
        if(res.data){
            this.getHistoricalData();
        }
    }

    addNewRecordFailure=(err)=>{

    }

    handleRowDelete=(oldData,resolve)=>{
        deleteRecord(this.deleteRecordSuccess,this.deleteRecordFailure,this.header,oldData.id);
        resolve();
    }

    deleteRecordSuccess=(res)=>{
        if(res.data){
            this.getHistoricalData();
        }
    }

    deleteRecordFailure=(err)=>{

    }

    handleChange=(e)=>{
        this.setState({selectedDate:e}) ;
    }

    render() {
        const {classes} = this.props;
        const {data, columns} = {...this.state};
        return (

                <Container  fixed style={{vh: '100%', marginBottom: '200px',width:'100%'}}>
                {/*<MuiThemeProvider theme={theme}>*/}
                    <ThemeProvider theme={theme}>
                    <div style={{
                                background: 'white',
                                position: 'relative',
                                zIndex: 999
                            }}>

                                <Grid container spacing={1} justify="flex-end"  style={{marginLeft:'24px'}}>
                                    <Grid item xs={12} sm={2} >
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                autoOk
                                                style={{marginRight:'20px',marginTop:'9px'}}
                                                disableToolbar
                                                variant="inline"
                                                format="dd-MM-yyyy"
                                                margin="normal"
                                                id="date-picker-inline1"
                                                value={this.state.selectedDate}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                                onChange={this.handleChange}
                                            />
                                        </MuiPickersUtilsProvider>

                                    </Grid>

                                    <Grid item xs={12} sm={2}>
                                        <FormControl className={classes.formControl}>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={this.state.selectedOption}
                                            onChange={this.onSelect}
                                            MenuProps={{ classes: { paper: classes.menuPaper } }}
                                        >
                                            {this.state.Options.map((item)=>(
                                            <MenuItem key={item.label} value={item.label}>{item.label}</MenuItem>
                                            ))}

                                        </Select>
                                        </FormControl>
                                    </Grid>


                                    <Grid item xs={12} sm={2} >
                                        <Button
                                            style={{marginRight:'-10px',background:'#01579b',width:'100px',marginTop:'5px'}}
                                            variant="contained"
                                            color="primary"
                                            className={classes.submit}
                                            onClick={this.getHistoricalData}
                                        >
                                            Submit
                                        </Button>
                                    </Grid>


                                </Grid>
                            </div>


                        <MaterialTable

                            tableRef={this.tableRef}
                            data={data}
                            columns={columns}
                            title="Edit Report"

                            editable={this.privilege == '0' && this.username !=='SISL' ? {
                                onRowUpdate: (newData, oldData) =>
                                new Promise((resolve) => {
                                this.handleRowUpdate(newData, oldData, resolve);
                            }),
                                onRowAdd:(newData)=>
                                new Promise((resolve) => {
                                this.handleRowAdd(newData, resolve)
                            }),

                                onRowDelete: (oldData) =>
                                new Promise((resolve) => {
                                this.handleRowDelete(oldData, resolve)
                            }),
                            } : {}}

                            options={{
                                addRowPosition:"first",
                                search: false,
                                selection: false,
                                paging: false,
                                toolbar:true,
                                filtering: false,
                                padding:"dense",
                                maxBodyHeight: '480px',
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
                                    fontWeight:'bold'
                                },
                                actionsColumnIndex: -1,
                                rowStyle: {
                                    background: '#f5f5f5',
                                    textAlign: 'center',
                                    height:10,
                                    padding:'5px'

                                },
                                cellStyle: {
                                    padding:0,
                                    borderLeft: '1px solid lightgrey',
                                    borderRight: '1px solid lightgrey',
                                    textAlign: 'center',
                                },

                            }}
                        />

                {/*</MuiThemeProvider>*/}
                    </ThemeProvider>
                    <Backdrop className={classes.backdrop} transitionDuration={200} open={this.state.loading} onClick={this.handleCloseLoading}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
    </Container>

        );
    }
}

export default withStyles(styles)(EditFragment);
