import React from "react";
import {styles} from "@material-ui/pickers/views/Clock/Clock";


export default function CustomFooter({title = "Powered by Smart Ship Hub Pte. Ltd."})

{
    return (
        <div style={{
            position: "fixed",
            left: "0px",
            right: "0px",
            bottom: "0px",
            height: "31px",
            width:'100%',
        }}>
            <div style={{
                textAlign:"center",
                color:"white",
                width:"100%",
                height:"100%",
                backgroundColor: "#403E40"
            }}>
                <div className="headerBackground" style={{
                    display:"flex",
                    textAlign: "right",
                    flexDirection: "column",
                    padding: "0px",
                    marginTop:'5px',
                }} >
                    <span style={{marginTop:'5px',marginRight:'25px'}}>{title}</span>
                </div>


            </div>

        </div>
    );
}
