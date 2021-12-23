import React, {Component} from 'react';
import Modal from "./Modal";
import {connect} from "react-redux"

import CustomButton from "../shared/CustomButton";
import {BigNumber} from "ethers";
import {setMessagesBalance} from "../../store/accounts/balance";

function processAddressField(str) {
    if (str[0] !== '0') return "";
    if (str[1] !== 'x') return "0";
    return "0x" + str.substr(2).replace(/[^0-9a-fA-F]/, "").substr(0, 40);
}

class SendMessageModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showBuyOnClose: false,
            receivingAddress: "",
            message: "",
            sending: false
        }
    }

    sendMessage() {
        const {receivingAddress, message} = this.state;
        const contract = this.props.signer.messageCoinContract;
        this.setState({
            sending: true
        })

        contract.sendMessage(receivingAddress.toLowerCase(), message).then(() => {
            this.setState({
                message: "",
                receivingAddress: ""
            })
            this.props.onHide();

            const newMessagesBalance = BigNumber.from(this.props.balance.messages).sub(BigNumber.from(1));
            this.props.setMessagesBalance(newMessagesBalance.toString());

        }).finally(() => {
            this.setState({
                sending: false
            })
        });
    }

    render() {
        const {show, onHide, className, balance, showBuy} = this.props;
        const {showBuyOnClose, receivingAddress, message} = this.state;

        const sufficientBalance = (Number(balance.messages) !== 0);

        const buttonColor = "emerald-400";

        const validAddress = receivingAddress.match(/0x[0-9a-fA-F]{40}/);

        return (
            <Modal show={show} onHide={onHide} title={"Send Messages"} className={className} onTransitionEnd={() => {
                if (!show && showBuyOnClose) {
                    showBuy();
                    this.setState({
                        showBuyOnClose: false
                    })
                }
            }}>
                {!sufficientBalance && (<div className={"text-center text-sm mb-4"}>
                    <b>Tip: </b>
                    <span className={"font-semibold text-gray-700"}>
                    <a className={"underline decoration-2 underline-offset-1 text-emerald-500 " +
                    "decoration-emerald-500 hover:cursor-pointer"}
                       onClick={() => {
                           onHide();
                           this.setState({
                               showBuyOnClose: true
                           })
                       }}>
                        Purchase MXG tokens
                    </a> to start sending messages
                </span>
                </div>)}
                <div>
                    <div className={"rounded-md border border-gray-300 px-4 py-2 flex justify-between text-gray-600"}>
                        <h5 className="font-semibold">Message Balance</h5>
                        <p className="text-gray-600">{balance.messages} MXG</p>
                    </div>
                    <div
                        className={"mt-2 rounded-md border border-gray-300 px-4 py-2 flex justify-between text-gray-600"}>
                        <h5 className="font-semibold mr-2">To</h5>
                        <input className="w-full text-right focus:border-none focus:outline-none text-gray-500
                        overflow-ellipsis"
                               value={receivingAddress}
                               placeholder={"Enter address here"}
                               onChange={event => this.setState({
                                   receivingAddress: processAddressField(event.target.value)
                               })}
                        />
                    </div>
                    <div className={"mt-2 rounded-md border border-gray-300 px-4 py-2 text-gray-600"}>
                        <h5 className="font-semibold">Message</h5>
                        <form action="">
                        <textarea id="message-text" className="mt-1 w-full focus:border-none focus:outline-none"
                                  rows={10} name="message" placeholder="Type your message body here."
                                  value={message}
                                  onChange={event => {
                                      this.setState({message: event.target.value})
                                  }}>
                        </textarea>
                        </form>
                    </div>
                    <CustomButton className={`w-full bg-${buttonColor} border-2 border-${buttonColor} hover:bg-white ` +
                    `hover:text-${buttonColor} text-gray-100 mt-2`}
                                  disabled={!sufficientBalance || !validAddress || message === ""}
                                  onClick={() => {
                                      this.sendMessage();
                                  }}>
                        {sufficientBalance ? (
                            validAddress ? "Send" : "Please Enter a Valid Address"
                        ) : "Insufficient Message Balance"}
                    </CustomButton>
                </div>
            </Modal>)
    }

}

const mapStateToProps = (state) => ({
    signer: state.signer,
    balance: state.balance
})

const mapDispatchToProps = (dispatch) => ({
    setMessagesBalance: balance => dispatch(setMessagesBalance(balance))
})

export default connect(mapStateToProps, mapDispatchToProps)(SendMessageModal);