// import react, { useEffect, useState } from "react"
import { Styler } from "./styles/Grid.styled";
// import { StyledModal } from "./styles/Modal.styled"

export default function Modal(props: any) {
    // const [isOn, setIsOn] = useState(props.trigger !== undefined);
    // useEffect(() => {
    //     console.log(isOn);
    // }, [props.trigger]);

    const handleClose = (event: any) => {
        // console.log(event.target.className.indexOf('modal-container'), event.target.className);
        if (event.target.className?.indexOf('modal-container') > -1) {
            props.close();
        }
    }

    return (props.trigger !== undefined) ? (
        <Styler className="modal-container" onClick={(event: any) => handleClose(event)} >
            <Styler xs={{ ps: "relative", wd: props.width, ht: props.height, top: "50px" }} className="modal-inner">
                {/* <button className="cls-btn" onClick={() => props.close()}>close me</button> */}
                {props.children}
            </Styler>
        </Styler>
    ) : "" as any;
}