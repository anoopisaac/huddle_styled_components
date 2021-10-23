import react from "react"
import { Styler } from "./styles/Grid.styled";
import { StyledModal } from "./styles/Modal.styled"

export default function Modal(props: any) {
    return (props.trigger !== undefined) ? (
        <Styler className="modal-container" >
            <Styler ps="relative" wd={props.width} ht={props.height} top="50px" className="modal-inner">
                {/* <button className="cls-btn" onClick={() => props.close()}>close me</button> */}
                {props.children}
            </Styler>
        </Styler>
    ) : "" as any;
}