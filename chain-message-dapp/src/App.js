import './styles/App.css';
import React, {Component} from 'react';
import Inbox from './Inbox';
import MessagePurchase from './MessagePurchase';
import {connect} from 'react-redux';
import {setAccounts} from './redux/accounts/accounts';
import { ethers } from 'ethers';

import { ReactComponent as UserIcon } from './icons/user.svg';
import WalletConnectModal from "./WalletConnectModal";

class ConnectToWalletButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
    }

    setShow(newShow) {
        this.setState(() => ({
            show: newShow
        }));
    }

    render() {
        const {disabled} = this.props;
        const {show} = this.state;

        return (<>
            <WalletConnectModal show={show} onHide={() => this.setShow(false)}/>
            <button className={"bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 text-gray-300 px-3 py-2 rounded-lg transition"}
                    onClick={() => this.setShow(true)} disabled={disabled}>
                Connect to a Wallet
            </button>
        </>)
    }

}

function abbreviateAddress(addr) {
    return addr.substring(0, 6) + "..." + addr.substr(addr.length - 4, 4);
}

function navBar(accounts) {
    return (<nav className="bg-gray-900 border-b border-gray-700 shadow-lg absolute top-0 left-0 right-0">
        <div className="max-w-6xl mx-auto px-4 flex justify-between">
            <div>
                <a href="#" className="flex items-center py-4 px-2">
                    <span className="font-semibold text-gray-100 text-xl">Chain Message</span>
                </a>
            </div>
            <div className="hidden md:flex items-center space-x-1">
                {accounts.length ? <div className="inline-flex items-center bg-gray-800 text-gray-300 px-3 py-2 rounded-lg overflow-hidden">
                    <UserIcon className="h-5 w-5 mr-2"/>
                    {abbreviateAddress(accounts[0])}
                </div> : <ConnectToWalletButton disabled={!accounts}/>}
            </div>
        </div>
    </nav>);
}

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            connectingWallet: false
        };
        const {ethereum} = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            provider.listAccounts().then((accounts) => {
                this.props.setAccounts(accounts);
            });
        }
    }

    setConnectingWallet(newValue) {
        this.setState(() => ({
            connectingWallet: newValue
        }));
    }

    render() {
        const {accounts} = this.props;
        const {connectingWallet} = this.state;
        return (
            <>
                <WalletConnectModal show={connectingWallet} onHide={() => this.setConnectingWallet(false)}/>
                <div className="body text-gray-100 pt-16">
                    {navBar(accounts)}
                    <div className="max-w-6xl mx-auto p-4">
                        <div className="flex">
                            <Inbox className="w-2/3 mr-4"/>
                            <MessagePurchase className="w-1/3"/>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        accounts: state.accounts
    }
};
const mapDispatchToProps = (dispatch) => ({
    setAccounts: accounts => dispatch(setAccounts(accounts))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
