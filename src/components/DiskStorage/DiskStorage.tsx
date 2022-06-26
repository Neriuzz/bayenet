import { useRef } from "react";

// Styles
import "./DiskStorage.scss";

import EventBus from "../../shared/EventBus";
const eventBus = EventBus.instance;

const DiskStorage = () => {
    const downloadRef = useRef<HTMLAnchorElement>(null);
    const uploadRef = useRef<HTMLInputElement>(null);

    const handleFileUploaded = async () => {
        // Exit if no ref or no files have been selected
        if (!uploadRef.current || !uploadRef.current.files) return;

        // Get the network
        const network = await uploadRef.current.files[0].text();

        // Tell renderer to load the network
        eventBus.emit("loadNetwork", JSON.parse(network));
    };

    const handleLoadNetwork = () => {
        // Return if no valid ref
        if (!uploadRef.current) return;

        // Simulate click on upload button
        uploadRef.current.click();
    };

    const handleSaveNetwork = () => {
        // Exit if no access to the ref
        if (!downloadRef.current) return;

        // Retrieve network from local storage
        const network = localStorage.getItem("network");

        // If doesn't exist, exit
        if (!network) return;

        // Otherwise, create blob of network
        const blob = new Blob([network], { type: "application/json" });

        // Setup anchor link attributes
        downloadRef.current.download = "network.json";
        downloadRef.current.href = window.URL.createObjectURL(blob);

        // Simulate click on link so network downloads
        downloadRef.current.click();
    };

    return (
        <div className="disk-storage-container">
            <div className="load">
                <input
                    ref={uploadRef}
                    type="file"
                    accept=".json,application/json"
                    style={{ display: "none" }}
                    onChange={handleFileUploaded}
                />
                <p className="load-warning">
                    Please make sure to save the current network before loading another one. All progress will be lost.
                </p>
                <button className="disk-storage-button" onClick={handleLoadNetwork}>
                    Load network from local files
                </button>
            </div>
            <div className="save">
                <button className="disk-storage-button" onClick={handleSaveNetwork}>
                    Save network to local files
                </button>
                <a ref={downloadRef} href="" style={{ display: "none" }}></a>
            </div>
        </div>
    );
};

export default DiskStorage;
