import React, {useState} from "react";
import {getAuthAuthenticating, getAuthError} from "../../../Core/Authentication/authentication.selectors";
import {getGlobalConnection} from "../../../Core/Global/global.selectors";
import {connect} from "react-redux";
import {Checkbox} from "primereact/checkbox";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Calendar} from "primereact/calendar";

function CreatePoll(props) {

    const [currentOptions, setCurrentOptions] = useState(["", ""]);
    const [checked, setChecked] = useState(false);
    const [pollName, setPollName] = useState ("");
    const [date, setDate] = useState(null)
    const [nameError, setNameError] = useState(false);
    const [dateError, setDateError] = useState(false);
    const [optionError, setOptionError] = useState(["",""]);

    const setOptionValue = (index, value) =>{
        let newOptions = [...currentOptions];
        newOptions[index] = value;
        setCurrentOptions(newOptions);
    }
    const appendInput = () =>{
        let newOptions = [...currentOptions,""];
        setCurrentOptions(newOptions);
        let newOptionError = [...optionError,""];
        setOptionError(newOptionError);
    }
    const removeInput = (index) => {
        let newOptions = [...currentOptions];
        newOptions.splice(index, 1);
        setCurrentOptions(newOptions);
        let newOptionError = [...optionError];
        newOptionError.splice(index, 1);
        setOptionError(newOptionError);
    }
    const checkNameError = () => {
        let error = false;
        if (pollName.length <= 1)
        {
            error = true;
            setNameError("De pollnaam moet langer zijn dan 2 tekens");
        }
        else if (pollName.length >= 50)
        {
            error = true;
            setNameError("De pollnaam moet korter zijn dan 50 tekens");
        }
        else
            setNameError("");

        return error;
    };
    const checkDateError = () =>{
        let error = false;
        if(date === null)
        {
            error = true;
            setDateError("Vul een einddatum in.")
        }
        else
            setDateError("")
        return error;
    }
    const checkOptionError = () =>{
        let error = false;
        let newOptionsError = [...optionError];
        currentOptions.map((option, index) => {
            if(option.length < 1){
                newOptionsError[index] = "Optie mag niet leeg zijn.";
                error = true;
            }
            else
            {
                newOptionsError[index] = "";
            }
        });
        setOptionError(newOptionsError);

        return error;
    }
    const checkError = () => {
        console.log(checkNameError(), checkDateError(), checkOptionError())
        if(!checkNameError() && !checkDateError() && !checkOptionError())
            return true;
        else
            return false;
    }
    const createPoll = () => {
        if(checkError()){
            props.connection.send("CreatePoll", {
                PollName: pollName,
                PollOptions : currentOptions,
                MultipleOptions : checked,
                ExpirationDate : date
            });
        }
    }


    return(
        <div>
            <label>Pollnaam: </label>
            <br/>
            <InputText value={pollName} onChange={(e) => setPollName( e.target.value)} />
            <div>{nameError ? (
                <span style={{ width: "100%", color: "red" }}> {nameError} </span>
            ) : (
                <span>&nbsp;</span>
            )} </div>
            <div>
                {currentOptions.map((option, index) =>
                    <div>
                        <InputText placeholder={"Poll optie"} value={option} onChange={(e) => setOptionValue( index, e.target.value)} />
                        <Button className="p-button-danger" icon="pi pi-times" onClick={ () => removeInput(index)}/>
                        <div>{optionError[index] ? (
                            <span style={{ width: "100%", color: "red" }}> {optionError[index]} </span>
                        ) : (
                            <span>&nbsp;</span>
                        )}</div>
                    </div>
                )}
            </div>
            <Button label="Nieuwe optie toevoegen" onClick={ () => appendInput() }/>
            <br/><br/>
            <Checkbox checked={checked} onChange={e => setChecked(e.checked)} />
            <label> Meerdere opties mogelijk. </label>
            <br/><br/>
            <div>
                <label>Afloopdatum:</label> <br/>
                <Calendar value={date} onChange={(e) => setDate(e.value)} showTime />
                <div>{dateError ? (
                    <span style={{ width: "100%", color: "red" }}> {dateError} </span>
                ) : (
                    <span>&nbsp;</span>
                )}</div>
            </div>
            <Button label="Aanmaken" onClick={ () => createPoll() }/>
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

export default connect(mapStateToProps)(CreatePoll);