import { faAngleDown, faAngleUp, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { timeStamp } from "console";
import React from "react";
import { Subscription } from "rxjs";
import { AppState, Tag } from "../common";
import { messageService } from "../Message";
import { getState } from "../StateService";
import { Styler } from "./styles/Grid.styled";
import { Todo } from "./Todo1";

export class SideBar extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <Styler xs={{ gtr: "max-content max-content", bgc: "#eaeaea", bdrr: "1px solid #d1d1d1" }}>
                <Styler xs={{ gtr: "30px 30px 30px 30px 30px 1fr", p: "10px" }} >
                    {AppState.taskGroupNames.map(taskGrpItem =>
                        <Styler xs={{ gtc: "30px 1fr", ai: "center" }} key={taskGrpItem}>
                            <span><FontAwesomeIcon icon={faCalendar} className="awesome-icon" /></span>
                            <Styler xs={{ cr: "pointer" }} as="span" cr="pointer" className="txt">{taskGrpItem}</Styler>
                        </Styler>
                    )
                    }
                </Styler>
                <MasterTags style={{ color: "red" }} todo>

                </MasterTags>
            </Styler>

        );
    }
}


class MasterTags extends React.Component<any> {
    subscription: Subscription | undefined;
    appState!: AppState;
    tagsOpen = false;
    constructor(props: any) {
        super(props);
    }
    componentDidMount() {
        this.appState = getState();
        this.subscription = messageService.getMessage().subscribe(data => {
            console.log(this.appState?.selectedTaskGroup.tasks, "eeeee");
            this.setState({});
        })
    }
    componentWillUnmount() {

    }
    render() {
        return (
            <Styler xs={{ gar: "max-content" }}>
                <Styler xs={{ gtc: "1fr 1fr", p: "5px 10px", ht: "20px" }}>
                    <Styler className="txt" as="span" xs={{ jus: "left", als: "center" }}>Tags</Styler>
                    < FontAwesomeIcon icon={this.tagsOpen === true ? faAngleUp : faAngleDown} className="awesome-icon" style={{ cursor: "pointer", justifySelf: "end", alignSelf: "center" }} onClick={() => this.toggleTag()} />
                </Styler>
                {this.tagsOpen === true &&
                    <Styler xs={{ bgc: "#c5c5c5", pi: "center start", gar: "max-content", bxs: "inset -1px 0px 5px #9d9d9d" }}>
                        <Styler xs={{ d: "grid", p: "0px 10px", ht: "40px", wd: "100%", bs: "border-box", bb: "1px solid #eeeeee" }}>
                            <input type="text" name="" id="" className="form-control add-task" placeholder="Add Task" style={{ height: "25px", alignSelf: "center", backgroundColor: "#f6f6f6", paddingLeft: "5px" }}
                                onKeyDown={(e: any) => {
                                    if (e.code === "Enter") {
                                        this.addNewTag(e.target.value);
                                        e.target.value = ""
                                    }
                                }}
                            />
                        </Styler>
                        {this.appState.tags.map((itemTag: Tag) => {
                            return <Styler xs={{ d: "grid", p: "0px 10px", ht: "30px", wd: "100%", bs: "border-box", bb: "1px solid #eeeeee", ai: "center" }}>
                                <Styler className="txt" as="span">{itemTag.name}</Styler>
                            </Styler>
                        })}
                    </Styler>
                }
            </Styler>
        );
    }
    private addNewTag(name: string): void {
        this.appState.tags.push({ name, _isSelected: false });
        this.setState({})
    }
    private toggleTag(): void {
        this.tagsOpen = this.tagsOpen === true ? false : true;
        this.setState({})
    }
}

export default MasterTags;