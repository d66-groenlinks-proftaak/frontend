import React from "react";

class Category extends React.Component {
    render() {
        return <li className={"category"} style={{fontSize: "1.5em", marginTop: 5, marginLeft: 0}}>
            <span className="fa-li">{this.props.icon}</span> {this.props.name}
        </li>
    }
}

export default Category;
