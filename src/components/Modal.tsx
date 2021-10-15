import react from "react"
import { StyledModal } from "./styles/Modal.styled"

export  default function Modal(props:any) {
    return (props.trigger!==undefined)? (
        <StyledModal className="container">
            <div className="inner">
                <button className="cls-btn" onClick={()=>props.setEnableTaskEdit(false)}>close me</button>
                {props.children}
            </div>
        </StyledModal>
    ):"" as any;
}