import React from "react";
import { Card } from 'primereact/card';

class TopMessages extends React.Component {
    render() {
        return <div className={"p-grid p-formgrid p-fluid p-align-stretch vertical-container"}>
                {[...Array(4)].map(_ =>
                    <div className="p-col-12 p-md-3 p-p-2 p-p-md-2 p-p-lg-3 box box-stretched">
                        <Card className={"card-hover p-bp-2"} title={"Gaming"} subTitle={"04-03-2021"} style={{height: "100%"}}>
                            <div style={{height: 150, overflow: "hidden"}}>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                            </div>
                        </Card>
                    </div>
                )}
        </div>
    }
}

export default TopMessages;