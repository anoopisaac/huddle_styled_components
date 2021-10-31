import { faCalendar, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { AppState } from "../common";
import { Styler } from "./styles/Grid.styled";

export class SideBar extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <Styler xs={{ bgc: "#f3f5fe", gtr: "30px 30px 30px 30px 30px 1fr", p: "10px" }} >
                {AppState.taskGroupNames.map(taskGrpItem =>
                    <Styler xs={{ gtc: "30px 1fr", ai: "center", p: "10px" }} key={taskGrpItem}>
                        <span><FontAwesomeIcon icon={faCalendar} className="awesome-icon" /></span>
                        <Styler xs={{ cr: "pointer" }} as="span" cr="pointer" className="txt">{taskGrpItem}</Styler>
                    </Styler>
                )
                }
            </Styler>
        );
    }
}