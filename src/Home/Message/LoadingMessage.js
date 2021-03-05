import React from "react";
import {Skeleton} from "primereact/skeleton";

class LoadingMessage extends React.Component {
    render() {
        return <div className="custom-skeleton p-p-4">
            <div className="p-d-flex p-jc-between p-mt-3">
                <Skeleton width="4rem" height="2rem"></Skeleton>
                <Skeleton width="4rem" height="2rem"></Skeleton>
            </div>

            <div className="p-d-flex p-mb-3 p-mt-3">
                <Skeleton shape="circle" size="4rem" className="p-mr-2"></Skeleton>
                <div>
                    <Skeleton width="10rem" className="p-mb-2"></Skeleton>
                    <Skeleton width="5rem" className="p-mb-2"></Skeleton>
                    <Skeleton height=".5rem"></Skeleton>
                </div>
            </div>
            <Skeleton width="100%" height="150px"></Skeleton>
            <div className="custom-skeleton p-p-4">
                <ul style={{listStyleType: "none"}} className="p-m-0 p-p-0">
                    <li className="p-mb-3">
                        <div className="p-d-flex">
                            <Skeleton shape="circle" size="4rem" className="p-mr-2"></Skeleton>
                            <div style={{ flex: '1' }}>
                                <Skeleton width="100%" className="p-mb-2"></Skeleton>
                                <Skeleton width="75%"></Skeleton>
                            </div>
                        </div>
                    </li>
                    <li className="p-mb-3">
                        <div className="p-d-flex">
                            <Skeleton shape="circle" size="4rem" className="p-mr-2"></Skeleton>
                            <div style={{ flex: '1' }}>
                                <Skeleton width="100%" className="p-mb-2"></Skeleton>
                                <Skeleton width="75%"></Skeleton>
                            </div>
                        </div>
                    </li>
                    <li className="p-mb-3">
                        <div className="p-d-flex">
                            <Skeleton shape="circle" size="4rem" className="p-mr-2"></Skeleton>
                            <div style={{ flex: '1' }}>
                                <Skeleton width="100%" className="p-mb-2"></Skeleton>
                                <Skeleton width="75%"></Skeleton>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="p-d-flex">
                            <Skeleton shape="circle" size="4rem" className="p-mr-2"></Skeleton>
                            <div style={{ flex: '1' }}>
                                <Skeleton width="100%" className="p-mb-2"></Skeleton>
                                <Skeleton width="75%"></Skeleton>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    }
}

export default LoadingMessage;