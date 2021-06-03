import React from "react";
import {withRouter} from "react-router";
import {getGlobalConnection} from "../../Core/Global/global.selectors";
import {connect} from "react-redux";

class PageListener extends React.Component {
    componentDidMount() {
        this.unlisten = this.props.history.listen((location, action) => {
            this.props.connection.send('UpdatePage', location.pathname);
        });
    }

    render() {
        return null;
    }
}

const mapStateToProps = (state) => {
    return {connection: getGlobalConnection(state)}
}
export default connect(mapStateToProps)(withRouter(PageListener));
