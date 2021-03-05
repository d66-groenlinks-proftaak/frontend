import React from "react";
import {withRouter} from "react-router";

class PageListener extends React.Component {
    componentWillMount() {
        this.unlisten = this.props.history.listen((location, action) => {
            this.props.connection.send('UpdatePage', location.pathname);
        });
    }

    render() {
        return null;
    }
}

export default withRouter(PageListener);