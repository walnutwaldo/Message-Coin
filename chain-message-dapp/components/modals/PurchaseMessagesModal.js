import React, {Component} from "react";
import Modal from "./Modal";
import {BigNumber} from "ethers";
import {setEthBalance, setMessagesBalance} from "../../store/accounts/balance";
import {setPrice} from "../../store/messages/price";
import {connect} from "react-redux";
import CustomButton from "../shared/CustomButton";
import {formatWithCommas} from "../../utils/numberFormat";

function parseNumericInputField(value, maxvalue) {
    const strippedString = value.replace(/\D/g, "");
    if (strippedString === "") return null;
    return Math.min(Math.max(0, Number(strippedString)), maxvalue);
}

class PurchaseMessagesModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            purchaseAmount: "",
            buying: false,
            errorString: ""
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {signer} = this.props;

        if (signer && !prevProps.signer) {
            this.updateEthBalance(signer.address);
            this.updatePrice();
        }
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

    buyMessages() {
        const { price, signer } = this.props;
        const { purchaseAmount } = this.state;

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
                    purchaseAmount: ""
                });
            }).finally(() => {
                this.setState({
                    buying: false
                });
            });
        }
    }

    render() {
        const {show, onHide, className, price, balance} = this.props;
        const { purchaseAmount, buying, errorString } = this.state;

        const sufficientFunds = price.price * purchaseAmount <= Number(balance.eth);

        return (<Modal show={show} onHide={() => {
            onHide();
            this.setState({ errorString: false, buying: false });
        }} title={"Buy MXG"} className={className}>
            <div className={"align-center"}>
                <form action="" className="flex justify-between rounded-md border border-gray-700 px-4 py-2">
                    <label className="text-black"htmlFor="amount">Amount</label>
                    <input className="w-full text-right focus:border-none focus:outline-none text-gray-500"
                           placeholder={"Enter amount here"}
                           value={formatWithCommas(purchaseAmount)}
                           onChange={event => this.setState({
                               purchaseAmount: parseNumericInputField(event.target.value, 1e6)
                           })}
                    />
                </form>
                <div className="flex justify-between mt-2">
                    <h5 className="font-semibold">Price</h5>
                    <p className="text-black"> {price.priceSet ? `${price.price / (1e18)} ETH / MXG` : "Price not found"}</p>
                </div>
                <div className="flex justify-between">
                    <h5 className="font-semibold">Total Cost</h5>
                    <p className="text-black font-bold">{`${formatWithCommas(price.price * purchaseAmount / (1e18))} ETH`}</p>
                </div>

                <div className="w-full text-center">
                    <p className={`${sufficientFunds ? "text-gray-400" : "text-red-400"} mt-4`}>
                        {balance.eth > 0 ? `${formatWithCommas(balance.eth / (1e18))} ETH Available` : "No ETH in Wallet"}
                    </p>
                </div>
                <CustomButton className={"w-full bg-emerald-400 border-2 border-emerald-400 hover:bg-white " +
                "hover:text-emerald-400 text-gray-100 mt-2"} onClick={() => this.buyMessages()}
                              disabled={buying || Number(purchaseAmount) === 0 || !sufficientFunds}>
                    {Number(purchaseAmount) === 0 ? "Invalid Amount" : (!sufficientFunds ? "Insufficient Funds" : "Buy")}
                </CustomButton>
                <p className={"text-red-500"}>{errorString && errorString}</p>
            </div>
        </Modal>);
    }

}

const mapStateToProps = state => ({
    provider: state.provider,
    signer: state.signer,
    price: state.price,
    balance: state.balance
});

const mapDispatchToProps = (dispatch) => (
    {
        setMessagesBalance: balance => dispatch(setMessagesBalance(balance)),
        setEthBalance: balance => dispatch(setEthBalance(balance)),
        setPrice: price => dispatch(setPrice(price))
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseMessagesModal);