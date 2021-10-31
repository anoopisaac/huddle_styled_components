// Editable.js
import { render } from "@testing-library/react";
import React, { useEffect, useRef, useState } from "react";
import { Styler } from "./styles/Grid.styled";

// Component accept text, placeholder values and also pass what type of Input - input, textarea so that we can use it for styling accordingly
class Editable extends React.Component {
    // Manage the state whether to show the label or the input box. By default, label will be shown.
    // Exercise: It can be made dynamic by accepting initial state as props outside the component 
    editRef: any;
    isEditing = false;
    constructor(public props: any) {
        super(props);
        this.editRef = React.createRef();
        this.state = {
        }
    }

    // // Event handler while pressing any key while editing
    handleKeyDown = (event: any) => {
        // Handle when key is pressed
    };

    componentDidMount() {
        document.addEventListener("click", this.handleClick);

    }
    handleClick = (e: any) => {
        if (this.editRef?.current !== undefined && this.editRef?.current !== null) {
            if (this.editRef.current.contains(e.target)) {
                if (this.isEditing === false) {
                    this.isEditing = true;
                    this.setState({});
                }
            } else {
                if (this.isEditing === true) {
                    this.isEditing = false;
                    this.props.update();
                    this.setState({});
                }
            }

        }

    }
    componentWillUnmount() {
        document.removeEventListener("click", this.handleClick);
        return () => document.removeEventListener("click", this.handleClick);
    }

    render() {
        return (
            <Styler
                onKeyDown={(e: any) => this.handleKeyDown(e)}
                ref={this.editRef}
                xs={this.props.xs}
            >
                {this.isEditing && this.props.children}
                {!this.isEditing &&
                    <Styler as="span" xs={{ wd: "100%", ellipsis: "" }} className="txt">
                        {this.props.text}
                    </Styler>
                }
            </Styler>
        )
    }

}


export default Editable;