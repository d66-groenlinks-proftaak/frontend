import {Link} from "react-router-dom";
import {Button} from "primereact/button";
import React from "react";

export default function Header() {
    return <div className="p-d-flex p-jc-between p-ai-center">
        <Link to={"/"}>
            <Button className={"p-button-info p-button-outlined"} label={"Terug"}
                    style={{float: "right"}}
                    icon="pi pi-arrow-left" iconPos="left"/>
        </Link>
    </div>
}
