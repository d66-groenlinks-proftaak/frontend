import React, {useEffect, useState} from "react";

import {getAuthAuthenticating, getAuthError} from "../../../Core/Authentication/authentication.selectors";
import {getGlobalConnection} from "../../../Core/Global/global.selectors";
import {connect} from "react-redux";
import { RadioButton } from 'primereact/radiobutton';
import {Checkbox} from "primereact/checkbox";
import {Button} from "primereact/button";
import {Card} from "primereact/card";
import { ProgressBar } from 'primereact/progressbar';
function Poll(props) {

    const [showResults,setShowResults] = useState(false);
    const [poll, setPoll] = useState({
        name: "Klopt dit?",
        multipleOptions : false,
        options : [{
            name:"Ja"
        },{
            name:"Nee"
        }]
    });
    const [currentOptions, setCurrentOptions] = useState(null);
    const [currentCbOptions, setCurrentCbOptions] = useState([]);
    const [pollResults, setPollResults] = useState({
        name:"Klopt dit?",
        votes: [{
            polloption: "Ja",
            votecount : 63
        },{
            polloption: "Nee",
            votecount: 37
        }]
        });

    /*
    useEffect(() => {
        props.connection.send("GetLatestPoll");
    }, []);

    useEffect(() => {
        props.connection.on("ReceiveLatestPoll", (recPoll) => {
            setPoll(recPoll);
        });
        return function cleanup() {
            props.connection.off("ReceiveLatestPoll");
        };

    },[]);

    useEffect(() =>{
        props.connection.on("ReceivePollResults", (recPollResults)=>{
            setPollResults(recPollResults)
        });
        return function cleanup(){
            props.constructor.off("ReceivePollResults");
        }
    },[]);
    */

    const votePoll = () =>{
        /*
        let optionsToSend = [];

        if(poll.multipleOptions){
            currentCbOptions.map((option) =>
            optionsToSend.push(option.id));
        }
        else{
            optionsToSend[0] = currentOptions.id;
        }
        props.connection.send("VoteOnPoll", {VoteOptions : optionsToSend});*/
        setShowResults(true);
    }

    const onOptionChange = (e) => {
        let selectedOptions = [...currentCbOptions];
        if(e.checked)
            selectedOptions.push(e.value);
        else
            selectedOptions.splice(selectedOptions.indexOf(e.value), 1);
        setCurrentCbOptions(selectedOptions);
    }
    const returnResults = () =>{
        if(pollResults.name != undefined){
            return <Card style={{width:"100%"}}>
                <label>{pollResults.name}</label>
                <br/>
                {pollResults.votes.map((vote) =>  <div>
                        <label>{vote.polloption}</label>
                        <ProgressBar value={vote.votecount}></ProgressBar>
                    </div>
                )}
            </Card>
        }

    }
    const returnPoll = () =>{
        if(poll.options != undefined){
           return <Card style={{width:"100%"}}>
                <label>{poll.name}</label>
                <br/>
               { poll.multipleOptions ? <div>
                   {poll.options.map((option) =>
                       <div> <Checkbox checked={currentCbOptions.includes(option)} value={option} onChange={onOptionChange} />
                           <label> {option.name}</label>
                       </div>)}
               </div> : <div>
                   {poll.options.map((option) =>
                       <div> <RadioButton checked={currentOptions === option} value={option} onChange={(e) => setCurrentOptions(option)}/>
                           <label> {option.name}</label>
                       </div>)}
               </div> }
                <Button style={{margin:"10px"}}label={"Stemmen"} onClick={() => votePoll()}/>
            </Card>
        }
    }

    if(showResults === false){
        return (
            <div>
                {returnPoll()}
            </div>
        );
    }
    else{
        return (
            <div>
                {returnResults()}
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        error: getAuthError(state),
        loggingIn: getAuthAuthenticating(state),
        connection: getGlobalConnection(state),
    };
};

export default connect(mapStateToProps)(Poll);