import React from "react";
import {withRouter} from "react-router";

class PageListener extends React.Component {
    componentDidMount() {
        this.unlisten = this.props.history.listen((location, action) => {
            console.log(location.pathname)
            this.props.connection.send('UpdatePage', location.pathname);
        });
    }

    render() {
        return null;
    }
}

export default withRouter(PageListener);
