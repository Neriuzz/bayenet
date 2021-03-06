// Icons
import { MdZoomOutMap } from "react-icons/md";
import { IoIosInformationCircle } from "react-icons/io";
import { CgScrollV } from "react-icons/cg";
import { AiOutlineEyeInvisible } from "react-icons/ai";

// Styles
import "./App.scss";

// Components
import Canvas from "../Canvas/Canvas";
import Sidebar from "../Sidebar/Sidebar";

// Event bus to listen for messages from the renderer
import EventBus, { CameraEvent, NetworkEvent } from "../../shared/EventBus";
import { useState } from "react";
import InformationModal from "../InformationModal/InformationModal";
const eventBus = EventBus.instance;

const App = () => {
    const [showModal, setShowModal] = useState(false);

    const resetCameraZoom = () => {
        eventBus.emit(CameraEvent.RESET_ZOOM);
    };

    const invertCameraScroll = () => {
        eventBus.emit(CameraEvent.INVERT_SCROLL);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const clearEvidence = () => {
        eventBus.emit(NetworkEvent.CLEAR_EVIDENCE);
        eventBus.emit(NetworkEvent.EVIDENCE_CLEARED);
    };

    return (
        <>
            <div className="buttons">
                <IoIosInformationCircle
                    className="button"
                    size="35px"
                    onClick={openModal}
                    title={"Show information modal"}
                />
                <MdZoomOutMap className="button" size="30px" onClick={resetCameraZoom} title={"Reset zoom"} />
                <CgScrollV className="button" size="30px" onClick={invertCameraScroll} title={"Invert scroll"} />
                <AiOutlineEyeInvisible
                    className="button"
                    size="30px"
                    onClick={clearEvidence}
                    title={"Clear all evidence from the network"}
                />
            </div>
            {showModal && <InformationModal setShowModal={setShowModal} />}
            <Canvas />
            {!showModal && <Sidebar />}
        </>
    );
};

export default App;
