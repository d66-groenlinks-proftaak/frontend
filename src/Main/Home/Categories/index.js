import React from "react";
import Category from "./Category";
import {faComments, faVirus, faCity, faTrash, faAdjust, faBullhorn, faPollH, faVideo, faQuestion} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

class Categories extends React.Component {
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
                          icon={<FontAwesomeIcon style={{color: "black"}} icon={faComments}/>}/>
                <Category name={"Mededelingen"}
                          icon={<FontAwesomeIcon style={{color: "black"}} icon={faBullhorn}/>}/>
                <Category name={"Polls"}
                          icon={<FontAwesomeIcon style={{color: "black"}} icon={faPollH}/>}/>
                <Category name={"Webinars"}
                          icon={<FontAwesomeIcon style={{color: "black"}} icon={faVideo}/>}/>
                <Category name={"Quizzes"}
                          icon={<FontAwesomeIcon style={{color: "black"}} icon={faQuestion}/>}/>
                <div style={{width: "100%", height: 25}}/>
                <span style={{
                    textTransform: "uppercase", marginLeft: "-2em",
                    fontSize: "1.5em", fontWeight: "bold"
                }}>THEMA'S</span>
                <Category name={"Corona"}
                          icon={<FontAwesomeIcon style={{color: "black"}} icon={faVirus}/>}/>
                <Category name={"Gemeente"}
                          icon={<FontAwesomeIcon style={{color: "black"}} icon={faCity}/>}/>
                <Category name={"Afval"}
                          icon={<FontAwesomeIcon style={{color: "black"}} icon={faTrash}/>}/>
                <Category name={"Racisme"}
                          icon={<FontAwesomeIcon style={{color: "black"}} icon={faAdjust}/>}/>
            </ul>
        </div>
    }
}

export default Categories;
