import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as Constants from './constants';
import {setMessagesBalance} from "./redux/accounts/balance";
import {setPrice} from "./redux/token/price";
import {ethers, BigNumber} from 'ethers';
import Modal from './Modal';

class CustomButton extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<button className={"rounded-md px-4 py-3 text-sm font-semibold transition shadow " +
        "hover:shadow-lg" + " " + this.props.className} onClick={this.props.onClick} disabled={this.props.disabled}>
            {this.props.children}
        </button>)
    }

}

const provider = new ethers.providers.Web3Provider(window.ethereum);

function processNumericInputField(value, maxvalue) {
    return Math.min(Math.max(0, Number(value.replace(/\D/,''))), maxvalue).toString();
}

class MessagePurchase extends Component {

    constructor(props) {
        super(props);

        provider.listAccounts().then((accounts) => {
            if (accounts.length > 0) {
                this.updateSigner(accounts[0]);
                this.updateBalance(accounts[0]);
                this.updatePrice();
            }
        });

        this.state = {
            showPurchase: false,
            showSend: false,
            purchaseAmount: 1,
            buying: false,
            errorString: ""
        }
    }

    updateSigner(account) {
        this.signer = provider.getSigner(account);
        this.messageCoinContract = new ethers.Contract(Constants.MESSAGE_COIN_CONTRACT_ADDRESS, Constants.MESSAGE_COIN_ABI, this.signer);
    }

    updateBalance(account) {
        this.messageCoinContract.balanceOf(account).then((balance) => {
            console.log("New balance is " + balance);
            this.props.setBalance(balance.toString());
        });
    }

    updatePrice() {
        this.messageCoinContract.cost().then((price) => {
            this.props.setPrice(price.toNumber());
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const {accounts} = this.props;
        const prevAccounts = prevProps.accounts;
        if ((prevAccounts.length > 0) !== (accounts.length > 0) || prevProps.accounts[0] !== this.props.accounts[0]) {
            this.updateSigner(accounts[0]);
            this.updateBalance(accounts[0]);
        }
        if (this.props.price.priceSet && accounts.length > 0) {
            this.updateSigner(accounts[0]);
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
        const { price } = this.props;

        if (Number(purchaseAmount) === 0) {
            this.setState({errorString: "Invalid purchase amount."});
        } else {
            const value = BigNumber.from(price.price).mul(BigNumber.from(purchaseAmount));
            this.setState({ buying: true, errorString: "" });
            this.messageCoinContract.mint(purchaseAmount, { value: value }).then(() => {

                // A bit of an assumption but its probably okay
                const newBalance = BigNumber.from(this.props.balance).add(BigNumber.from(purchaseAmount));
                this.props.setBalance(newBalance.toString());

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
                        <p className="text-black font-bold">{`${price.price * purchaseAmount / (1e18)} ETH`}</p>
                    </div>
                    <CustomButton className={"w-full bg-green-400 border-2 border-green-400 hover:bg-white " +
                    "hover:text-green-400 text-gray-100 mt-3"} onClick={() => this.buyMessages()}
                                  disabled={buying || Number(purchaseAmount) === 0}>
                        Buy
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
                    <p className="mt-3 text-4xl font-bold text-gray-800">{balance} MXG</p>
                    <div className="flex mt-4">
                        <CustomButton className={"bg-green-400 border-2 border-green-400 hover:bg-white " +
                        "hover:text-green-400 text-gray-100 w-1/2 mr-2"} onClick={() =>
                            this.setShowPurchase(true)
                        } disabled={accounts.length === 0}>Buy More</CustomButton>
                        <CustomButton className={"bg-white hover:bg-green-400 hover:text-white border-2 " +
                        "border-green-400 text-green-400 w-1/2 ml-2"} onClick={() =>
                            this.setShowSend(true)
                        } disabled={accounts.length === 0}>Send Message</CustomButton>
                    </div>
                </div>
            </div>
        </>)
    }

}

const mapStateToProps = (state) => (
{
    accounts: state.accounts,
    balance: state.balance,
    price: state.price
}
);

const mapDispatchToProps = (dispatch) => (
{
    setBalance: balance => dispatch(setMessagesBalance(balance)),
    setPrice: price => dispatch(setPrice(price))
}
);

export default connect(mapStateToProps, mapDispatchToProps)(MessagePurchase);