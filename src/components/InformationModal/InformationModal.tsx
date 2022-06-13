import { MouseEvent, useRef } from "react";
import { createPortal } from "react-dom";
import { IoIosClose } from "react-icons/io";
import { BsHandIndexThumbFill, BsShiftFill } from "react-icons/bs";
import { CgScrollV } from "react-icons/cg";

import "./InformationModal.scss";

interface InformationalModalProps {
    setShowModal: (value: React.SetStateAction<boolean>) => void;
}

const InformationModal = ({ setShowModal }: InformationalModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const closeModal = (event: MouseEvent) => {
        if (event.target === modalRef.current) setShowModal(false);
    };

    return createPortal(
        <div className="modal-container" ref={modalRef} onClick={closeModal}>
            <div className="information-modal">
                <IoIosClose
                    className="information-modal-close-button button"
                    size="60px"
                    onClick={() => setShowModal(false)}
                />

                <div className="information">
                    <BsHandIndexThumbFill className="double-click" />
                    <p>Double click the board to create a new node.</p>
                </div>
                <div className="information">
                    <BsHandIndexThumbFill className="pan" />
                    <p>Click and drag the board to pan.</p>
                </div>
                <div className="information">
                    <CgScrollV />
                    <p>Scroll to zoom in/out.</p>
                </div>
                <div className="information">
                    <BsShiftFill className="shift" />
                    <p>Shift-click on a node to create a new edge.</p>
                </div>
                <div className="information">
                    <BsHandIndexThumbFill className="click" />
                    <p>Click on a node to select it.</p>
                </div>
            </div>
        </div>,
        document.getElementById("information-modal-portal")!
    );
};

export default InformationModal;
