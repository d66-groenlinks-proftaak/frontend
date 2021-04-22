import React, {useEffect, useState} from "react";

import {getAuthAuthenticating, getAuthError} from "../../../Core/Authentication/authentication.selectors";
import {getGlobalConnection} from "../../../Core/Global/global.selectors";
import {connect} from "react-redux";
import { RadioButton } from 'primereact/radiobutton';
import {Checkbox} from "primereact/checkbox";
import {Button} from "primereact/button";
import {Card} from "primereact/card";

function Poll(props) {
    const [poll, setPoll] = useState({});
    const [currentOptions, setCurrentOptions] = useState(null);

    useEffect(() => {
        props.connection.on("ReceiveLatestPoll", (recPoll) => {
            setPoll(recPoll);
        });
        console.log(poll);
        return function cleanup() {
            props.connection.off("ReceiveLatestPoll");
        };
    });

    useEffect(() => {
        props.connection.send("GetLatestPoll");
    }, []);

    const returnPollOptions = () =>{
        if(poll.options != undefined){
            if(poll.multipleOptions === true) {
                return <div>
                    {poll.options.map((option) =>
                        <div> <Checkbox checked={currentOptions.includes(option)} value={option} onChange={(e) => setCurrentOptions(option)} />
                            <label> {option.name}</label>
                        </div>)}
                </div>
            }
            else{
                return<div>
                    {poll.options.map((option) =>
                        <div> <RadioButton checked={currentOptions === option} value={option} onChange={(e) => setCurrentOptions(option)}/>
                            <label> {option.name}</label>
                        </div>)}
                </div>

            }
        }
    }
    const votePoll = () =>{

    }
    return (
        <div>
            <Card>
                <label>{poll.name}</label>
                <br/>
                {returnPollOptions()}
                <Button label={"Stemmen"} onClick={() => votePoll()}/>
            </Card>

        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        error: getAuthError(state),
        loggingIn: getAuthAuthenticating(state),
        connection: getGlobalConnection(state),
    };
};

export default connect(mapStateToProps)(Poll);