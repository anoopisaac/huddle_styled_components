import react from "react"
import { StyledModal } from "./styles/Modal.styled"

export  default function Modal(props) {
    return (props.trigger)? (
        <StyledModal className="container">
            <div className="inner">
                <button className="cls-btn">close me</button>
                {props.children}
            </div>
        </StyledModal>
    ):"";
}