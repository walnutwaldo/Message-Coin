export const CONNECT_WALLET_REQUEST = "connectWalletRequest";

const ConnectWalletEvent = {
    addListener(callback) {
        document.addEventListener(CONNECT_WALLET_REQUEST, callback);
    },
    dispatch() {
        document.dispatchEvent(new CustomEvent(CONNECT_WALLET_REQUEST, {}));
    },
    removeListener(callback) {
        document.removeEventListener(CONNECT_WALLET_REQUEST, callback);
    },
};

export default ConnectWalletEvent;