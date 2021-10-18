import { faCalendar, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Styler } from "./styles/Grid.styled";

export class SideBar extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <Styler bgc="#f3f5fe" gtr="30px 30px 30px 30px 1fr" p="10px">
                {['Today', 'Tomorrow', 'Next 7 days', 'Any day'].map(taskGrpItem =>
                    <Styler gtc="30px 1fr" ai="center">
                        <span><FontAwesomeIcon icon={faCalendar} className="awesome-icon" /></span>
                        <Styler as="span" cr="pointer">{taskGrpItem}</Styler>
                    </Styler>
                )
                }
            </Styler>
        );
    }
}