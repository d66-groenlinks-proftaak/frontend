import React from "react";
import { Menubar } from 'primereact/menubar';
import {Link} from "react-router-dom";

class index extends React.Component {
    render() {
        const menuItems = [
            {
                label:'File',
                icon:'pi pi-fw pi-file',
                items:[
                    {
                        label:'New',
                        icon:'pi pi-fw pi-plus',
                        items:[
                            {
                                label:'Bookmark',
                                icon:'pi pi-fw pi-bookmark'
                            },
                            {
                                label:'Video',
                                icon:'pi pi-fw pi-video'
                            },

                        ]
                    },
                    {
                        label:'Delete',
                        icon:'pi pi-fw pi-trash'
                    },
                    {
                        separator:true
                    },
                    {
                        label:'Export',
                        icon:'pi pi-fw pi-external-link'
                    }
                ]
            }
        ]

        return <Menubar start={ <Link to={"/"} style={{fontSize: "1.7em", color: "black", textDecoration: 'none'}} className={"p-p-3 p-text-bold"}>Ringkey</Link> } model={menuItems} />
    }
}

export default index;