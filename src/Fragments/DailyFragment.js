import React, {Component} from 'react';
import MaterialTable from 'material-table';
import {Button, Container, Grid, TextField} from "@material-ui/core";
import {createMuiTheme, ThemeProvider, withStyles} from '@material-ui/core/styles';
import {currentReport, downloadSingleExcel, downloadSinglePDF, getDetailedRecords, getPreviousData} from '../api';
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import excel from '../images/Images/icons8-microsoft-excel-64.png';
import pdf from '../images/Images/icons8-pdf-26.png';
import arrow from '../images/Images/icons8-expand-arrow-26.png';
import edit from '../images/edit.png'


const typographyTheme = createMuiTheme({
    typography: {
        font: '"Open Sans, sans-serif"',
        fontFamily: [
            'Open Sans',
        ].join(','),
    }
});

const styles = theme => ({
    table: {
        minWidth: 650,
    },

    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#01579b',
    },
});

const today = new Date();
class DailyFragment extends Component {
    constructor(props) {
        super(props);

        let store = JSON.parse(localStorage.getItem('token'));
        this.header = {}
        if (store !== null) {
            let tok = "Bearer " + store.token;

            this.header = {
                'Authorization': tok
            }
        }

        this.state = {
            data: [{
                id: null,
                vesselName: null,
                date: null,
                atSeaFrom: null,
                atSeaTo: null,
                atPort: null,
                srNo: null
            }],

            columns:
                [

                    {title: 'Sr No.', render: rowData => rowData.tableData.id + 1},
                    {title: 'Vessel Name', field: 'vesselName',
                        render: rowData => (
                            <div style={{
                                background: (rowData.atSeaFrom || rowData.atSeaTo) ? '#28a745' : '#dc3545',
                                color: 'white',
                                borderRadius: '.25rem',
                                borderTopLeftRadius: '0.25rem',
                                borderTopRightRadius: '0.25rem',
                                borderBottomRightRadius: '0.25rem',
                                borderBottomLeftRadius: '0.25rem',
                                padding: '.25em .4em',
                                fontSize: '75%',
                                fontWeight: '700',
                                lineHeight: '1',
                                width: '130px',
                                textAlign: 'center',
                                whiteSpace: 'nowrap',
                                verticalAlign: 'baseline',
                            }}>{rowData.vesselName}</div>


                        ),

                    },
                    {title: 'Received Date', field: 'date'},
                    {title: 'From Sea', field: 'atSeaFrom'},
                    {title: 'To Sea', field: 'atSeaTo'},
                    {title: 'Port', field: 'atPort'},

                ],

            table: {
                minWidth: 600,
            },
            loading: false,
            prevDate: '',
            status: "In progress,Closed,Open"

        };

    }

    componentDidMount = () => {
        this.getTodayData();
    }

    getTodayDate = () => {
        return today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
    }

    getTodayData = () => {
        currentReport(this.onSuccess, this.onFailure, this.header);
    }

    downloadSingleFile = (id, type) => {
        const payload = {
            id: id
        }
        if (type === 'pdf') {
            downloadSinglePDF(this.onDownloadSinglePDFSuccess, this.onDownloadSinglePDFFailure, payload, this.header);
        } else {
            downloadSingleExcel(this.onDownloadSingleExcelSuccess, this.onDownloadSingleExcelFailure, payload, this.header);
        }

    }

    saveFiles = (res) => {
        let fileName = res.headers["content-disposition"].split("filename=")[1];
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        document.removeChild(a);
    }

    parseDate = (string) => {
        if (string === null)
            return "";
        else {
            let a = new Date(string).toLocaleDateString();
            if (a === 'Invalid Date') return "";
            else return a;
        }
    }

    handleChange = (e) => {
        this.state.prevDate = e.target.value;
        this.onDateChanged();

    }

    onDateChanged = () => {
        this.setState({loading: true});
        const payload = {
            prevDate: this.state.prevDate
        }
        if (this.state.prevDate === this.getTodayDate()) {
            this.getTodayData();
        } else
            getPreviousData(this.onGetPrevDataSuccess, this.onGetPrevDataFailure, payload, this.header)
    }

    send = (rowData) => {

        const data = [...this.state.data];
        for (let i = 0; i < data.length; i++) {
            if (rowData.id === data[i].id) {
                if (!data[i].shipDetailData) {

                    if (rowData.id !== null) {
                        const onGetDetailedDataSuccess = this.onGetDetailedDataSuccessCallBack(rowData.id);
                        getDetailedRecords(onGetDetailedDataSuccess, this.onGetDetailedDataFailure, this.header, rowData.id);
                    }
                }
                break;
            }
        }
    }

    handleCloseLoading = () => {
        this.setState({loading: false});
    }

    onStatusChange = (e) => {
        this.setState({status: e.target.value})
    }

    onSuccess = (res) => {
        this.setState({data: res.data, loading: false});
    }

    onFailure = (err) => {

    }

    onDownloadSinglePDFSuccess = (res) => {
        this.saveFiles(res);
    }

    onDownloadSinglePDFFailure = (err) => {

    }

    onDownloadSingleExcelSuccess = (res) => {
        this.saveFiles(res);
    }

    onDownloadSingleExcelFailure = (err) => {

    }

    onGetPrevDataSuccess = (res) => {
        if (res.data) {
            this.setState({data: res.data, loading: false});
        } else {
            this.setState({loading: false});

        }

    }

    onGetPrevDataFailure = (err) => {
        this.setState({loading: false});

    }

    onGetDetailedDataSuccessCallBack = (rowDataId) => {
        return (res) => {

            if (res.data) {
                const data = [...this.state.data];
                for (let i = 0; i < data.length; i++) {
                    if (rowDataId === data[i].id) {

                        data[i] = {
                            ...data[i],
                            shipDetailData: res.data
                        }
                        break;

                    }
                }
                this.setState({
                    data,
                })
            }
        }
    }

    onGetDetailedDataFailure = (err) => {
        alert(err + "no record for this ship");
    }


    render() {
        const {data, columns, status} = this.state;
        const TODAY = this.getTodayDate();
        const {classes} = this.props;
        let statusArr = status.split(',');
        let cnt = 0
        data.forEach(item => {
            Object.entries(item).forEach((key) => {
                if (key[0] === "date") {
                    data[cnt].date = this.parseDate(key[1]);
                    cnt++;
                }
            })
        })


        return (
            <ThemeProvider theme={typographyTheme}>
                <Container maxWidth="lg" fixed style={{vh: '100%', marginBottom: '200px', fontFamily: 'Open Sans'}}>
                <div style={{backgroundColor: '#e8eaf5', height: '50px', fontFamily: 'Open Sans'}}>
                    <Grid container spacing={2} style={{marginBottom: '10px'}}>
                        <Grid item xs={12} sm={6}>
                            <label style={{fontSize: '20px', marginLeft: '10px', marginTop: '-5px'}}>Daily
                                Report</label>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <h2 style={{marginLeft: '190px', marginTop: '-2px'}}>10/19 Vessel has send PSC Report</h2>
                        </Grid>
                    </Grid>
                </div>

                <div style={{marginBottom: '1px', background: 'white'}}>
                    <Grid container spacing={1}>

                        <Grid item xs={12} sm={4}>
                            <FormLabel style={{marginLeft: '11px', color: '#37b159'}} component="legend">Select
                                Date</FormLabel>
                            <TextField
                                style={{marginLeft: '10px'}}
                                id="toDate"
                                type="date"
                                defaultValue={TODAY}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={this.handleChange}
                                name="prevDate"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormLabel component="legend"
                                       style={{marginBottom: '4px', marginLeft: '15px', color: '#37b159'}}>Select
                                Status</FormLabel>
                            <RadioGroup onChange={this.onStatusChange} row aria-label="position" name="position"
                                        defaultValue="In progress,Closed,Open">
                                <FormControlLabel
                                    value="In progress,Closed,Open"
                                    control={<Radio color="primary"/>}
                                    label="All"
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value="Closed,"
                                    control={<Radio color="primary"/>}
                                    label="Closed"
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value="In progress,Open"
                                    control={<Radio color="primary"/>}
                                    label="Not Closed"
                                    labelPlacement="end"
                                />
                            </RadioGroup>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormLabel component="legend"> </FormLabel>
                            <Button
                                style={{float: 'right', marginRight: '20px', marginTop: '10px'}}
                                textAlign="center"
                                variant="contained"
                                color="primary"
                            >
                                Generate PDF
                            </Button>
                        </Grid>
                    </Grid>

                </div>


                <MaterialTable
                    columns={columns}
                    data={data}

                    detailPanel={[
                        {
                            tooltip: 'Show Name',
                            icon: () => null,
                            openIcon: () => null,

                            render: rowData => {
                                return (
                                    <div style={{overflow: "auto", maxHeight: '150px'}}>
                                        <TableContainer component={Paper} style={{
                                            fontFamily:'Open Sans',
                                            fontSize:'20px'
                                        }}>
                                            <Table className={classes.table} aria-label="simple table">
                                                <TableHead >
                                                    <TableRow style={{fontFamily:'Open Sans',
                                                        fontSize:'20px',background:'#F5F5F5',}}>
                                                        <TableCell align="center">Sr No.</TableCell>
                                                        <TableCell align="center">PSC/FSI Checklist</TableCell>
                                                        <TableCell align="center">Description</TableCell>
                                                        <TableCell align="center">Date</TableCell>
                                                        <TableCell align="center">Status</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {rowData.shipDetailData && rowData.shipDetailData.map((row, index) => {
                                                        if (statusArr.includes(row.status)) {
                                                            return (<TableRow key={`ShipDetailedDataId-${row.id}`}>
                                                                <TableCell align="center" component="th" scope="row">
                                                                    {index + 1}
                                                                </TableCell>
                                                                <TableCell
                                                                    align="center">{row.checklistReference}</TableCell>
                                                                <TableCell align="center">
                                                                    <p
                                                                    style={{
                                                                        textAlign:'justify',
                                                                        width:'320px',
                                                                        fontFamily:'Open Sans',
                                                                        fontSize:'16px'
                                                                    }}
                                                                    >
                                                                        {row.description}
                                                                    </p>
                                                                </TableCell>
                                                                <TableCell
                                                                    align="center">{this.parseDate(row.targetDate)}</TableCell>
                                                                <TableCell align="center">{row.status}</TableCell>
                                                            </TableRow>)
                                                        } else {
                                                            return (<div> </div>)
                                                        }


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
                    actions={[
                        {
                            icon: () => <img src={pdf}
                                             height='20px'
                                             alt="pdf"
                            />,
                            tooltip: 'pdf',
                            position: 'row',
                            onClick: (event, rowData) => {
                                this.downloadSingleFile(rowData.id, 'pdf')
                            }
                        },
                        {
                            icon: () => <img src={excel}
                                             height='20px'
                            />,
                            tooltip: 'excel',
                            position: 'row',
                            onClick: (event, rowData) => {
                                this.downloadSingleFile(rowData.id, 'excel')
                            }
                        },
                        {
                            icon: () => <img src={edit}
                                             alt="edit"
                                             height="20px"
                            />,
                            tooltip: 'edit',
                            position: 'row',
                        },
                        {
                            icon: () => <img src={arrow}
                                             alt="expand"
                                             height="20px"
                            />,
                            tooltip: 'detailed info',
                            position: 'row',
                        },
                    ]}
                    options={{
                        actionsColumnIndex: -1,
                        toolbar: false,
                        paging: false,
                        filtering: false,
                        search: false,

                        headerStyle: {
                            fontFamily: 'Open Sans',
                            fontSize: '17px',
                            width: 26,
                            whiteSpace: 'nowrap',
                            textAlign: 'center',
                            flexDirection: 'row',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            paddingLeft: 5,
                            paddingRight: 5,
                            backgroundColor: '#01579b',
                            color: 'white',
                        },

                        rowStyle: {
                            textAlign: 'center',
                            fontSize: '18px'

                        },
                        cellStyle: {
                            borderRight: '1px solid lightgrey',
                            textAlign: 'center',
                            fontSize: '18px',
                        },

                    }}
                />

                <Backdrop className={classes.backdrop} open={this.state.loading} onClick={this.handleCloseLoading}>
                    <CircularProgress color="inherit"/>
                </Backdrop>


            </Container>
            </ThemeProvider>

        );
    }
}

export default withStyles(styles)(DailyFragment);
