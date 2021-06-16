import React, {useEffect} from "react";
import Category from "./Category";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import {connect} from "react-redux";
import {getGlobalConnection} from "../../../Core/Global/global.selectors";

class Categories extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: []
        }
    }

    componentDidMount() {
        this.props.connection.on("SendCategories", (retrievedCategories) => {
            console.log(retrievedCategories)
            this.setState({
                categories: retrievedCategories
            })
        })

        this.props.connection.send("GetCategories")
    }

    render() {
        return <div style={{fontSize: "0.7em", marginTop: 15, marginLeft: 30}}>
            <div style={{width: "100%", height: 39, marginBottom: 30}}/>
            <ul className={"fa-ul"} style={{padding: 0, marginLeft: 23}}>
                <span style={{
                    textTransform: "uppercase",
                    marginLeft: "-2em",
                    fontSize: "1.5em",
                    fontWeight: "bold"
                }}>GLOBAAL</span>
                <Category name={"Alle Berichten"}
                          icon={<FontAwesomeIcon style={{color: "black"}} icon={"comments"}/>}/>
                <Category name={"Mededelingen"}
                          icon={<FontAwesomeIcon style={{color: "black"}} icon={"bullhorn"}/>}/>
                <Category name={"Polls"}
                          icon={<FontAwesomeIcon style={{color: "black"}} icon={"poll-h"}/>}/>
                <Category name={"Webinars"}
                          icon={<FontAwesomeIcon style={{color: "black"}} icon={"video"}/>}/>
                <Category name={"Quizzes"}
                          icon={<FontAwesomeIcon style={{color: "black"}} icon={"question"}/>}/>
                <div style={{width: "100%", height: 25}}/>
                <span style={{
                    textTransform: "uppercase", marginLeft: "-2em",
                    fontSize: "1.5em", fontWeight: "bold"
                }}>THEMA'S</span>
                {this.state.categories.map(category => {
                    return <Category name={category.name}
                    icon={<FontAwesomeIcon style={{color: "black"}}
                    icon={category.icon} />}/>
                })}
            </ul>
        </div>
    }
    
}

const mapStateToProps = (state) => {
    return {
        connection: getGlobalConnection(state)
    }
}

export default connect(mapStateToProps)(Categories)
