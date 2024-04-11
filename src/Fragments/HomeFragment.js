import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {Container} from "@material-ui/core";


class DailyFragment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "admin@gmail.com",
            password: "12345",
        };

    }

    render() {
        return (
            <Container>
                Home

            </Container>
        );
    }
}

export default DailyFragment;