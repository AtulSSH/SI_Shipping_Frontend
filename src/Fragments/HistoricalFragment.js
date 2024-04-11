import 'date-fns';
import React, {Component} from 'react';
import MaterialTable from 'material-table';
import pdf from '../images/Images/icons8-pdf-26.png';
import word from '../images/word.png';
import {
    downloadDOCX,
    downloadPDF,
    getAllVessels,
    getDetailedRecords,
    getHistorical,
    getHistoricalByFilter,
    vesselCount
} from '../api';

import {Button, Container, Grid} from '@material-ui/core';
import {createMuiTheme, MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import './style.css';
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import MultiSelect from "react-multi-select-component";
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
        width: 100,
    },
    group: {
        width: 'auto',
        height: 'auto',
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'row',

    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#01579b',
    },
});

class HistoricalFragment extends Component {
    constructor(props) {

        super(props);
        let store = JSON.parse(localStorage.getItem('token'));
        this.header = {}
        this.username='';
        if (store !== null) {
            let tok = "Bearer " + store.token;
            this.username= store.username;
            this.header = {
                'Authorization': tok
            }
        }
        this.state = {

            check: true,
            data: [],

            columns:
                [
                    {title: 'Vessel Name', field: 'vesselName',width:'auto'},
                    {title: 'Report Date', field: 'reportDate',width:'auto'},
                    {title: 'Received Date', field:'receivedDate',width:'auto'}

                ],

            table: {
                minWidth: 650,
            },
            searchData:
                {
                    vesselName: null,
                    startDate: null,
                    endDate: null

                },
            startDate: null,
            endDate: null,
            popup: false,
            downloadID: {},
            selectedData: [],
            dialog: false,
            pdf: {
                merge: null,
                zipFile: null
            },
            excel: {
                zipFile: null
            },
            Options: [],
            selectedVessel: [],
            status: "In progress,Closed,Open",
            vesselCount: 0,
            statusOptions : [
                { label: "Open", value: "Open" },
                { label: "Closed", value: "Closed" },
                { label: "In progress", value: "In progress" },

            ],
            selectedStatus:[
                { label: "Open", value: "Open" },
                { label: "Closed", value: "Closed" },
                { label: "In progress", value: "In progress" },
            ],
            dailyCount:0,
            totalCount:0,
            shipDetailData:[],
            loading:false
        };


    }


    getTodayDate = () => {
        this.setState({startDate:TODAY,endDate:TODAY})
    }


    getHistoricalDataByFilter = () => {
        const {searchData, selectedVessel} = this.state;
        this.setState({loading:true})
        let array = [];
        selectedVessel.map(data => {
            array.push(data.label)
        });

        const payload = {
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            vesselNames: array
        };

        getHistoricalByFilter(this.onGetHistoricalByFilterSuccess, this.onHistoricalByFilterFailure, payload, this.header);
    }

    onGetHistoricalByFilterSuccess = (res) => {
        if (res.status === 200) {

            if(res.data){
                res.data.forEach(x=>{
                    let reportDate = x.reportDate;
                    let receivedDate = x.receivedDate;
                    x["reportDate"] = this.parseDate(reportDate);
                    x["receivedDate"]=this.parseDate(receivedDate);

                })
                this.setState({data: res.data,loading:false});
            }else{
                this.setState({data: [],loading:false});
            }



        }
    }

    onHistoricalByFilterFailure = (err) => {

        this.setState({loading:false});
    }

    handleChangeFrom = (e) => {
            this.setState({startDate:e});
    }

    handleChangeTo = (e) => {
        this.setState({endDate:e}) ;
    }

    componentDidMount = () => {
        this.getTodayDate();
        getAllVessels(this.onGetAllVesselsSuccess, this.onGetAllVesselsFailure, this.header);
        vesselCount(this.onGetVesselCount, this.onGetVesselCountFailure, this.header);
        this.getHistoricalData();

    }
    onGetVesselCount = (res) => {

        if (res.status === 200) {
            this.setState({
                dailyCount: res.data[0]['Daily'],
                totalCount: res.data[0]['Total']

            })
        }

    }

    onGetVesselCountFailure = (err) => {


    }

    onSuccess = (res) => {
        if (res.status === 200) {
            this.setState({data: res.data});
        }

    }

    getHistoricalData = () => {
        getHistorical(this.onReceivedDataSuccess, this.onReceivedDataFailure,this.header);

    }

    onReceivedDataSuccess = (res) => {
        if (res.status === 200) {

            if(res.data){
                res.data.forEach(x=>{
                    let reportDate = x.reportDate;
                    let receivedDate = x.receivedDate;
                    x["reportDate"] = this.parseDate(reportDate);
                    x["receivedDate"]=this.parseDate(receivedDate);

                })
                this.setState({data: res.data});
            }else{
                this.setState({data: []});
            }
        }
    }

    onReceivedDataFailure = (err) => {

    }


    onDownloadFileSuccess = (res) => {
        if (res.status === 200) {

        }

    }

    onDownloadFileFailure = (err) => {


    }

    popupShow = () => {
        getAllVessels(this.onGetAllVesselsSuccess, this.onGetAllVesselsFailure, this.header);
    }

    onGetAllVesselsSuccess = (res) => {
        const options = [];
        res.data.forEach(d => {
            options.push({
                "value": d.id,
                "label": d.vesselName,
            })
        })
        this.setState({Options: options,selectedVessel:options});

    }

    onGetAllVesselsFailure = (err) => {

    }

    handleSelectChange = (rowData) => {
        this.setState({selectedData: rowData});
    }


    radioChange = (e) => {
        if (e.target.value === '1') {
            this.state.pdf.merge = '1'
            this.state.pdf.zipFile = null

        } else {
            this.state.pdf.zipFile = '2'
            this.state.pdf.merge = null
        }
    }

    saveDoc = (res) => {
        let fileName = res.headers["content-disposition"].split("filename=")[1];
        const url = window.URL.createObjectURL(new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.documen'}));
        const a = document.createElement('a');

        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', fileName);
        document.body.appendChild(a);

        a.click();
        document.removeChild(a);
        this.setState({loading:false});
    }

    saveFiles = (res) => {

        let fileName = res.headers["content-disposition"].split("filename=")[1];
        const url = window.URL.createObjectURL(new Blob([res.data], {type: 'text/pdf'}));
        const a = document.createElement('a');

        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', fileName);
        document.body.appendChild(a);

        a.click();
        document.removeChild(a);
        this.setState({loading:false});
    }


    onStatusChange = (e) => {
        this.setState({selectedStatus: e})
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

    onSelect=(selectedItem)=> {
        this.setState({selectedVessel:selectedItem});

    }

    handleCloseLoading = () => {
        this.setState({loading: false});
    }

    send=(rowData)=>{
        this.setState({loading:true});
        let selStatus = []
        this.state.selectedStatus.forEach(x=>{
            selStatus.push(x.value);
        })
        getDetailedRecords(this.onGetDetailedDataSuccess, this.onGetDetailedDataFailure, this.header, rowData.id,selStatus.join(","));
    }

    onGetDetailedDataSuccess=(res)=>{
        this.setState({shipDetailData:res.data,loading:false});
    }

    onGetDetailedDataFailure=(err)=>{
        this.setState({loading:false});
    }

    downloadPDF = () => {
        this.setState({loading:true})
        let id = []
        this.state.data.map((item) => {
            if (item.id) {
                id.push(item.id);
            }
        })
        let array=[]
        this.state.selectedStatus.map(item =>{
            array.push(item.label);
        })

        const payload = {
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            id: id,
            status:array

        };
        downloadPDF(this.downloadPDFSuccess, this.downloadPDFFailure, payload, this.header);

    }

    downloadPDFSuccess = (res) => {
        this.setState({loading:false});
        if (res) {
            this.saveFiles(res);
        } else {

        }
    }

    downloadPDFFailure = (err) => {

        this.setState({loading:false});
    }

    downloadDocx = () => {
        this.setState({loading:true})
        let id = []
        this.state.data.map((item) => {
            if (item.id) {
                id.push(item.id);
            }
        })
        let array=[]
        this.state.selectedStatus.map(item =>{
            array.push(item.label);
        })

        const payload = {
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            id: id,
            status:array

        };
        downloadDOCX((res)=>{
            this.setState({loading:false});
            if (res) {
                this.saveDoc(res);
            } else {

            }
        }, ()=>{
            this.setState({loading:false});
        }, payload, this.header);

    }

    render() {
        const {classes} = this.props;
        const {data, columns,selectedStatus} = this.state;
        let statusArr = []
        if(selectedStatus) {
            selectedStatus.map(item => {
                statusArr.push(item.label);
            })
        }



        return (

            <Container maxWidth="lg" fixed style={{vh: '100%', marginBottom: '200px'}}>
                <MuiThemeProvider theme={theme}>

                    <div style={{
                            background: 'white',
                            marginBottom:'-35px'

                        }}>
                            <Grid container spacing={0}>

                                <Grid item xs={12} sm={4}>
                                    <h3 style={{marginLeft: '10px'}}>
                                        Report</h3>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <h2 style={{marginLeft: '50px'}}>{this.state.dailyCount}/{this.state.totalCount} Vessel has send PSC Report</h2>
                                </Grid>

                                <Grid item xs={12} sm={1} >
                                    { this.username !=='SISL'&&
                                        <img src={word}
                                             style={{cursor: 'pointer',marginLeft:'38px',marginTop:'7px'}}
                                             height="35px"
                                             alt="word"
                                             onClick={this.downloadDocx}
                                        />
                                    }


                                </Grid>

                                <Grid item xs={12} sm={1} style={{marginTop:'9px',float:'left'}}>
                                    <img src={pdf}
                                         style={{cursor: 'pointer'}}
                                         height="28px"
                                         alt="pdf"
                                         onClick={this.downloadPDF}
                                    />
                                </Grid>

                            </Grid>
                        </div>


                        <div style={{background: 'white',marginBottom:'2px'}}>
                                <Grid container  spacing={3} justify="space-evenly" alignItems="flex-end">
                                    <Grid item xs={12} sm={2}>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                    autoOk
                                                    style={{marginLeft: '8px',marginBottom:'1px'}}
                                                    disableToolbar
                                                    variant="inline"
                                                    format="dd-MM-yyyy"
                                                    margin="normal"
                                                    id="date-picker-inline1"
                                                    label="From"
                                                    value={this.state.startDate}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                    onChange={this.handleChangeFrom}
                                                />
                                        </MuiPickersUtilsProvider>
                                    </Grid>

                                    <Grid item xs={12} sm={2}>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                    autoOk
                                                    style={{marginBottom:'1px',marginLeft: '8px'}}
                                                    disableToolbar
                                                    variant="inline"
                                                    format="dd-MM-yyyy"
                                                    margin="normal"
                                                    id="date-picker-inline2"
                                                    label="To"
                                                    value={this.state.endDate}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                    onChange={this.handleChangeTo}
                                                />
                                        </MuiPickersUtilsProvider>
                                    </Grid>

                                    <Grid item xs={12} sm={3} style={{zIndex:999}}>
                                        <MultiSelect
                                            options={this.state.statusOptions}
                                            value={this.state.selectedStatus}
                                            onChange={this.onStatusChange}
                                            labelledBy={"Select Status"}
                                            disableSearch={true}
                                            overrideStrings={{allItemsAreSelected: "All Status are selected",
                                                selectSomeItems: "Select Status"
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={3} style={{zIndex:999}} >

                                        <MultiSelect
                                                options={this.state.Options}
                                                value={this.state.selectedVessel}
                                                onChange={this.onSelect}
                                                labelledBy={"Select Vessel"}
                                                overrideStrings={{allItemsAreSelected: "All Vessels are selected",
                                                    selectSomeItems: "Select Vessel"
                                                }}
                                                disableSearch={true}

                                            />

                                    </Grid>
                                    <Grid item xs={12} sm={2}>

                                        <Button
                                            style={{background:'#01579b',width:'100px'}}
                                            variant="contained"
                                            color="primary"
                                            onClick={this.getHistoricalDataByFilter}
                                        >
                                            Submit
                                        </Button>
                                    </Grid>

                                </Grid>

                            </div>


                        <MaterialTable

                            columns={columns}
                            data={data}
                            selection={false}
                            onSelectionChange={selection => {
                                this.handleSelectChange(selection);
                            }}
                            detailPanel={[
                                {
                                    icon: () => null,
                                    openIcon: () => null,
                                    render: rowData => {
                                        return (
                                            <div>
                                                <TableContainer component={Paper} style={{
                                                    fontSize: '20px',
                                                }}>
                                                    <Table className={classes.table} aria-label="simple table">
                                                        <TableHead>
                                                            <TableRow key={"-1"} style={{
                                                                fontSize: '20px', background: '#F5F5F5',fontWeight:'bold'
                                                            }}>
                                                                <TableCell padding={'none'} style={{fontWeight:'bold'}} align="center">Sr No.</TableCell>
                                                                <TableCell padding={'none'} style={{fontWeight:'bold'}} align="center">PSC/FSI
                                                                    Checklist</TableCell>
                                                                <TableCell padding={'none'} style={{fontWeight:'bold'}} align="center">Description</TableCell>
                                                                <TableCell padding={'none'} style={{fontWeight:'bold'}} align="center">Target Date</TableCell>
                                                                <TableCell padding={'none'} style={{fontWeight:'bold'}} align="center">Status</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {this.state.shipDetailData.map((row, index) => {
                                                                    return (<TableRow
                                                                        key={`ShipDetailedDataId-${row.id}`}>
                                                                        <TableCell padding={'none'} align="center" component="th"
                                                                                   scope="row">
                                                                            {index + 1}
                                                                        </TableCell>
                                                                        <TableCell padding={'none'}
                                                                                   align="center">{row.checklistReference}</TableCell>
                                                                        <TableCell padding={'none'}  style={{width:'10%'}} align="center">
                                                                            <p
                                                                                style={{
                                                                                    textAlign: 'justify',
                                                                                    width: '350px',
                                                                                    fontSize: '14px',
                                                                                }}
                                                                            >
                                                                                {row.description}
                                                                            </p>
                                                                        </TableCell>
                                                                        <TableCell padding={'none'}
                                                                                   align="center">{row.targetDate}</TableCell>
                                                                        <TableCell padding={'none'}
                                                                                   align="center">{row.status}</TableCell>
                                                                    </TableRow>)
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </div>
                                        )
                                    },
                                },

                            ]}
                            onRowClick={(event, rowData, togglePanel) => {
                                this.send(rowData);
                                togglePanel()
                            }}
                            options={{
                                toolbar: false,
                                search: false,
                                paging: false,
                                filtering: false,
                                detailPanelType:'single',
                                actionsColumnIndex: -1,
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
                                    overflowX:'hidden'

                                },
                                cellStyle: {
                                    padding:5,
                                    borderRight: '1px solid lightgrey',
                                    textAlign: 'center',
                                    overflowX: 'history',
                                    fontWeight: 'bold'
                                },


                            }}

                        />


                </MuiThemeProvider>
                <Backdrop className={classes.backdrop} transitionDuration={200} open={this.state.loading} onClick={this.handleCloseLoading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Container>
        );
    }
}

export default withStyles(styles)(HistoricalFragment);
