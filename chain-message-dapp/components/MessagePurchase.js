import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setMessagesBalance, setEthBalance} from "../store/accounts/balance";
import {setPrice} from "../store/token/price";
import {updateSigner} from "../store/provider/signer";
import {ethers, BigNumber} from 'ethers';
import Modal from './Modal';

function formatEth(amt) {
    return (Number(amt) / (1e18)).toFixed(6);
}

class CustomButton extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<button className={"rounded-md px-4 py-3 text-sm font-semibold transition shadow " +
        "hover:shadow-lg" + " " + this.props.className + " " +
        "disabled:bg-gray-300 disabled:shadow-none disabled:text-gray-500 disabled:border-gray-400 disabled:opacity-50"} onClick={this.props.onClick} disabled={this.props.disabled}>
            {this.props.children}
        </button>)
    }

}

function processNumericInputField(value, maxvalue) {
    return Math.min(Math.max(0, Number(value.replace(/\D/,''))), maxvalue).toString();
}

class MessagePurchase extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showPurchase: false,
            showSend: false,
            purchaseAmount: 1,
            buying: false,
            errorString: ""
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

    updateEthBalance(account) {
        const {provider} = this.props;
        provider.getBalance(account).then((balance) => {
            this.props.setEthBalance(balance.toString());
        })
    }

    updatePrice() {
        if (!this.props.signer) return;
        const {messageCoinContract} = this.props.signer;

        messageCoinContract.cost().then((price) => {
            this.props.setPrice(price.toNumber());
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const {accounts, signer} = this.props;

        if (signer && !prevProps.signer) {
            this.updateMessagesBalance(accounts[0]);
            this.updateEthBalance(accounts[0]);
            this.updatePrice();
        }
    }

    setShowPurchase(v) {
        this.setState(() => ({showPurchase: v}));
    }

    setShowSend(v) {
        this.setState(() => ({showSend: v}));
    }

    buyMessages() {
        const { purchaseAmount } = this.state;
        const { price, signer } = this.props;

        if (Number(purchaseAmount) === 0) {
            this.setState({errorString: "Invalid purchase amount."});
        } else {
            const value = BigNumber.from(price.price).mul(BigNumber.from(purchaseAmount));
            this.setState({ buying: true, errorString: "" });
            signer.messageCoinContract.mint(purchaseAmount, { value: value }).then(() => {

                // A bit of an assumption but its probably okay
                const newMessagesBalance = BigNumber.from(this.props.balance.messages).add(BigNumber.from(purchaseAmount));
                this.props.setMessagesBalance(newMessagesBalance.toString());

                const newEthBalance = BigNumber.from(this.props.balance.eth).sub(value);
                this.props.setEthBalance(newEthBalance.toString());

                this.setState({
                    showPurchase: false,
                    purchaseAmount: 1
                });
            }).finally(() => {
                this.setState({
                    buying: false
                });
            });
        }
    }

    render() {
        const {accounts, balance, price} = this.props;
        const {showPurchase, showSend, purchaseAmount, buying, errorString} = this.state;

        const sufficientFunds = price.price * purchaseAmount <= Number(balance.eth);

        return (<>
            <Modal show={showPurchase} onHide={() => {
                this.setShowPurchase(false);
                this.setState({ errorString: false, buying: false });
            }} title={"Buy MXG"}>
                <div className={"align-center"}>
                    <form action="" className="flex justify-between rounded-md border border-gray-700 px-4 py-2">
                        <label className="text-gray-700" htmlFor="amount">Amount </label>
                        <input className="w-full text-right focus:border-none focus:outline-none" value={purchaseAmount} onChange={event => this.setState({
                            purchaseAmount: processNumericInputField(event.target.value, 1e6)
                        })}/>
                    </form>
                    <div className="flex justify-between mt-2">
                        <h5 className="font-semibold">Price</h5>
                        <p className="text-gray-600"> {price.priceSet ? `${price.price / (1e18)} ETH / MXG` : "Price not found"}</p>
                    </div>
                    <div className="flex justify-between">
                        <h5 className="font-semibold">Total Cost</h5>
                        <p className="text-black font-bold">{`${formatEth(price.price * purchaseAmount)} ETH`}</p>
                    </div>

                    <div className="w-full text-center">
                        <p className={`${sufficientFunds ? "text-gray-400" : "text-red-400"} mt-4`}>{`${formatEth(balance.eth)} ETH Available`}</p>
                    </div>
                    <CustomButton className={"w-full bg-emerald-400 border-2 border-emerald-400 hover:bg-white " +
                    "hover:text-emerald-400 text-gray-100 mt-2"} onClick={() => this.buyMessages()}
                                  disabled={buying || Number(purchaseAmount) === 0 || !sufficientFunds}>
                        {Number(purchaseAmount) === 0 ? "Invalid Amount" : (!sufficientFunds ? "Insufficient Funds" : "Buy")}
                    </CustomButton>
                    <p className={"text-red-500"}>{errorString && errorString}</p>
                </div>
            </Modal>
            <Modal show={showSend} onHide={() => this.setShowSend(false)} title={"Send Messages"}>
                Send
            </Modal>
            <div className={this.props.className}>
                <div className="w-full bg-white rounded-b-md p-4 text-gray-900 border-t-4 border-gray-700 shadow">
                    <h3 className="font-semibold">{accounts.length > 0 ? "Message Coin Balance" : "No wallet connected"}</h3>
                    <p className="mt-3 text-4xl font-bold text-gray-800">{balance.messages} MXG</p>
                    <div className="flex mt-4">
                        <CustomButton className={"bg-emerald-400 border-2 border-emerald-400 hover:bg-white " +
                        "hover:text-emerald-400 text-gray-100 w-1/2 mr-2"} onClick={() =>
                            this.setShowPurchase(true)
                        } disabled={accounts.length === 0}>Buy More</CustomButton>
                        <CustomButton className={"bg-white hover:bg-emerald-400 hover:text-white border-2 " +
                        "border-emerald-400 text-emerald-400 w-1/2 ml-2"} onClick={() =>
                            this.setShowSend(true)
                        } disabled={accounts.length === 0}>Send Message</CustomButton>
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

export default connect(mapStateToProps, mapDispatchToProps)(MessagePurchase);