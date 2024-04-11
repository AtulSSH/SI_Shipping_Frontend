import axios from "axios";
const BASE_URL = "http://localhost:8080";
// const BASE_URL = "https://smartshipweb.com/sisl-psc-fsi-backend";


const LOGIN_URL = BASE_URL + "/api/auth/signin"
const REGISTER_URL = BASE_URL + "/api/user/signup"
const AllVessels_URL = BASE_URL + "/api/vessel/getAllVessels"
const CURRENT_URL = BASE_URL + "/api/ship/getCurrent"
const getDetailedRecords_URL = BASE_URL + "/api/ship/getDetailedRecords/"
const getDetailedRecordsByFilter_URL = BASE_URL + "/api/ship/getDetailedRecordsByFilter"
const AllUsers_URL = BASE_URL + "/api/user/getAllUsers"
const updatePassword_URL = BASE_URL + "/api/user/updatePassword"
const getUserByID_URL = BASE_URL + "/api/user/getUserByID"
const updateUser_URL = BASE_URL + "/api/user/updateUser"
const suspendUserByID_URL = BASE_URL + "/api/user/suspendUserByID"
const HISTORICAL_URL = BASE_URL + "/api/ship/search"
const downloadSinglePDF_URL = BASE_URL + "/api/ship/downloadFile/singlereport/0"
const downloadMergePDF_URL = BASE_URL + "/api/ship/downloadFile/mergedreport/1"
const downloadZipPDF_URL = BASE_URL + "/api/ship/downloadFile/zippedreport/2"
const downloadSingleExcel_URL = BASE_URL + "/api/ship/downloadFile/0"
const downloadZipExcel_URL = BASE_URL + "/api/ship/downloadFile/2"
const searchHistoricalDataURL = BASE_URL + "/api/ship/getHistorical"
const getPreviousDataURL = BASE_URL + "/api/ship/getPreviousData"
const updateDetailedData_URL = BASE_URL+ "/api/ship/updateRecord";
const deleteRecord_URL = BASE_URL + "/api/ship/deleteRecord/";
const addNewRecord_URL = BASE_URL + "/api/ship/addNewRecord";
const downloadPDF_URL = BASE_URL + "/api/download/downloadPDF";
const downloadDOCS_URL = BASE_URL + "/api/download/downloadDocx";
const vesselCount_URL=BASE_URL+"/api/ship/vesselCount"


const asyncPost = async (url, onSuccess, onFailure, payload) => {
    await axios.post(url, payload)
        .then((response) => {
            if (response.status >= 200 && response.status < 300) {
                onSuccess(response)
            } else {
                onFailure(response)
            }
        })
        .catch((error) => {
            onFailure(error)
        })
        .then(() => {

        })
    ;
};


const get = (url, onSuccess, onFailure,header) => {

    axios.get(url,{headers:header})
        .then((response) => {
            if (response.status >= 200 && response.status < 300) {
                onSuccess(response)
            } else {
                // onFailure(error)
            }
        })
        .catch((error) => {
            onFailure(error)
        })
        .then(() => {
        })
};


const postWithToken = (url, onSuccess, onFailure, payload,header) => {

    axios.post(url,payload,{headers:header})
        // axios.post(url,payload,{ headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
        //    ,withCredentials:true})
        .then((response)=> {
            if (response.status >= 200 && response.status < 300) {
                onSuccess(response)
            } else {
                onFailure(response.status)
            }
        })
        .catch(()=> {
            //onFailure(error)
        })
        .then(()=> {

        })
    ;
};


const postDownloadFile = (url, onSuccess, onFailure, payload,header) => {

    axios.post(url,payload,{headers:header, responseType: 'arraybuffer'})
        //axios.post(url,payload,{ headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
        //   ,withCredentials:true,responseType: 'arraybuffer'})
        .then((response)=> {
            if (response.status >= 200 && response.status < 300) {
                onSuccess(response)
            } else {
                onFailure(response.status)
            }
        })
        .catch(()=> {
            //onFailure(error)
        })
        .then(()=> {
        })
    ;
};



/** POST REQUEST **/

export const validateUser = async (onSuccess, onFailure,payload) => {
    await asyncPost(LOGIN_URL, onSuccess, onFailure,payload)
};

export const updatePassword = async (onSuccess, onFailure,payload) => {
    await asyncPost(updatePassword_URL, onSuccess, onFailure,payload)
};

export const registerUser = (onSuccess, onFailure,payload,header) => {
    postWithToken(REGISTER_URL, onSuccess, onFailure,payload,header)
};

export const getPreviousData = (onSuccess, onFailure,payload,header) => {
    postWithToken(getPreviousDataURL, onSuccess, onFailure,payload,header)
};

export const suspendUserByID = (onSuccess, onFailure,payload,header) => {
    postWithToken(suspendUserByID_URL, onSuccess, onFailure,payload,header)
};

export const getHistoricalByFilter = (onSuccess, onFailure,payload,header) => {
    postWithToken(HISTORICAL_URL, onSuccess, onFailure,payload,header)
};

export const updateUser = (onSuccess, onFailure,payload,header) => {
    postWithToken(updateUser_URL, onSuccess, onFailure,payload,header)
};


export const downloadSinglePDF = (onSuccess, onFailure,payload,header) => {
    postDownloadFile(downloadSinglePDF_URL, onSuccess, onFailure,payload,header)
};


export const downloadSingleExcel = (onSuccess, onFailure,payload,header) => {
    postDownloadFile(downloadSingleExcel_URL, onSuccess, onFailure,payload,header)
};

export const downloadMergePDF = (onSuccess, onFailure,payload,header) => {
    postDownloadFile(downloadMergePDF_URL, onSuccess, onFailure,payload,header)
};

export const downloadZipPDF = (onSuccess, onFailure,payload,header) => {
    postDownloadFile(downloadZipPDF_URL, onSuccess, onFailure,payload,header)
};

export const downloadZipExcel = (onSuccess, onFailure,payload,header) => {
    postDownloadFile(downloadZipExcel_URL, onSuccess, onFailure,payload,header)
};

export const getUserByID = (onSuccess, onFailure,payload,header) => {
    postWithToken(getUserByID_URL, onSuccess, onFailure,payload,header)
};

export const getDetailedRecordsByFilter = (onSuccess, onFailure,payload,header) => {
    postWithToken(getDetailedRecordsByFilter_URL, onSuccess, onFailure,payload,header)
};

export const updateDetailedData = (onSuccess, onFailure,payload,header) => {
    postWithToken(updateDetailedData_URL, onSuccess, onFailure,payload,header)
};

export const downloadPDF = (onSuccess, onFailure,payload,header) => {
    postDownloadFile(downloadPDF_URL, onSuccess, onFailure,payload,header)
};

export const downloadDOCX = (onSuccess, onFailure,payload,header) => {
    postDownloadFile(downloadDOCS_URL, onSuccess, onFailure,payload,header)
};


export const addNewRecord = (onSuccess, onFailure,payload,header) => {
    postWithToken(addNewRecord_URL, onSuccess, onFailure,payload,header)
};


/** GET REQUEST **/

export const currentReport =(onSuccess, onFailure,header) => {
    get(CURRENT_URL, onSuccess, onFailure,header)
};

export const getAllUsers = (onSuccess, onFailure,header) => {
    get(AllUsers_URL, onSuccess, onFailure, header)

};

export const getAllVessels = (onSuccess, onFailure,header) => {
    get(AllVessels_URL, onSuccess, onFailure, header)

};

export const getDetailedRecords = (onSuccess, onFailure,header,id,status) => {
    let url;
    if(status){
        url = getDetailedRecords_URL+id+"?status="+status
    }else{
        url = getDetailedRecords_URL+id
    }
    get(url, onSuccess, onFailure, header)
};

export const deleteRecord = (onSuccess, onFailure,header,id) => {
    get(deleteRecord_URL+id, onSuccess, onFailure, header)
};

export const vesselCount = (onSuccess, onFailure,header) => {
    get(vesselCount_URL, onSuccess, onFailure, header)
};

export const getHistorical = (onSuccess, onFailure,header) => {
    get(searchHistoricalDataURL, onSuccess, onFailure,header)
};


