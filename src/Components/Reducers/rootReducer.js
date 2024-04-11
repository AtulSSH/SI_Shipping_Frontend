import { combineReducers } from "redux";
const DEFAULT_REDUCER = (initstate, action)=>{

  return{
    key:"HELLOW WORLDD"
  }


}
const rootReducer = combineReducers({
  DEFAULT:DEFAULT_REDUCER
})

export default rootReducer;