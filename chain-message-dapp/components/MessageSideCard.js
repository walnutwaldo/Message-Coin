import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setMessagesBalance, setEthBalance} from "../store/accounts/balance";
import {setPrice} from "../store/messages/price";
import CustomButton from "./shared/CustomButton";

import PurchaseMessagesModal from "./modals/PurchaseMessagesModal";
import SendMessageModal from "./modals/SendMessageModal";
import {formatWithCommas} from "../utils/numberFormat";
import {VALID_CHAINS} from "./constants";
import ConnectWalletEvent from "../events/connectWallet";

class MessageSideCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showPurchase: false,
            showSend: false,
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {signer, setMessagesBalance} = this.props;

        const signerRemoved = !signer && prevProps.signer;
        if (signerRemoved) {
            setMessagesBalance(0);
            return;
        }

        const needUpdate = signer && (
            !prevProps.signer ||
            signer.address !== prevProps.signer.address
        )

        if (needUpdate) {
            this.updateMessagesBalance(signer.address);
        }
    }

    updateMessagesBalance(account) {
        if (!this.props.signer) return;
        const {messageCoinContract} = this.props.signer;

        if (!messageCoinContract) return;
        messageCoinContract.balanceOf(account).then((balance) => {
            this.props.setMessagesBalance(balance.toString());
        });
    }

    setShowPurchase(v) {
        this.setState(() => ({showPurchase: v}));
    }

    setShowSend(v) {
        this.setState(() => ({showSend: v}));
    }

    connectToRinkeby() {
        window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x4" }]
        });
    }

    render() {
        const {accounts, balance, signer, chain} = this.props;
        const {showPurchase, showSend} = this.state;

        let tipMessage = "";
        if (accounts.length === 0) {
            tipMessage = tipMessage = (<span>
                <span className={"underline underline-offset-1 decoration-emerald-400 text-emerald-400 hover:cursor-pointer font-semibold"}
                      onClick={() => {
                          ConnectWalletEvent.dispatch();
                      }}>
                    Connect a Wallet
                </span> to start sending messages.
            </span>);
        } else if (!VALID_CHAINS.includes(chain)) {
            tipMessage = (<span>
                <span className={"underline underline-offset-1 decoration-emerald-400 text-emerald-400 hover:cursor-pointer font-semibold"}
                onClick={() => this.connectToRinkeby()}>
                    Connect to Rinkeby
                </span> to start sending messages.
            </span>);
        }

        return (<>
            <PurchaseMessagesModal show={showPurchase} onHide={() => this.setShowPurchase(false)}/>
            <SendMessageModal show={showSend} onHide={() => this.setShowSend(false)}
                              showBuy={() => this.setShowPurchase(true)}/>
            <div className={this.props.className}>
                <div className="w-full bg-white rounded-b-md p-4 text-gray-900 border-t-4 border-gray-700 shadow">
                    <h3 className="font-semibold">{accounts.length > 0 ? "Message Coin Balance" : "No wallet connected"}</h3>
                    <p className="mt-3 text-4xl font-bold text-gray-800">{formatWithCommas(balance.messages)} MXG</p>
                    <div className={"mt-4"}>
                        <p className={"text-sm text-center text-gray-500 mb-2"}>{tipMessage}</p>
                        <div className="flex">
                            <CustomButton className={"bg-emerald-400 border-2 border-emerald-400 hover:bg-white " +
                            "hover:text-emerald-400 text-gray-100 w-1/2 mr-2"} onClick={() =>
                                this.setShowPurchase(true)
                            } disabled={!signer}>Buy More</CustomButton>
                            <CustomButton className={"bg-white hover:bg-emerald-400 hover:text-white border-2 " +
                            "border-emerald-400 text-emerald-400 w-1/2 ml-2"} onClick={() =>
                                this.setShowSend(true)
                            } disabled={!signer}>Send Message</CustomButton>
                        </div>
                    </div>
                </div>
            </div>
        </>)
    }

}

const mapStateToProps = state => state;

const mapDispatchToProps = (dispatch) => (
{
    setMessagesBalance: balance => dispatch(setMessagesBalance(balance)),
    setEthBalance: balance => dispatch(setEthBalance(balance)),
    setPrice: price => dispatch(setPrice(price))
}
);

export default connect(mapStateToProps, mapDispatchToProps)(MessageSideCard);