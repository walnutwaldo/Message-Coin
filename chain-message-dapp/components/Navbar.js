import React, {Component} from 'react';
import Link from 'next/link';
import {connect} from 'react-redux';
import {setAccounts} from '../store/accounts/accounts';
import {setProvider} from "../store/provider/provider";
import {updateSigner} from "../store/provider/signer";
import {abbreviateAddress} from "../utils/addressTools";

import WalletConnectModal from "./WalletConnectModal";

import UserIcon from '../public/icons/user.svg';
import {ethers} from "ethers";

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
        const {className} = this.props;
        const {show} = this.state;

        return (<div className={className}>
            <WalletConnectModal show={show} onHide={() => this.setShow(false)}/>
            <button className={"bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 text-gray-300 px-3 py-2 rounded-lg transition"}
                    onClick={() => this.setShow(true)}>
                Connect to a Wallet
            </button>
        </div>)
    }

}

class Navbar extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let {provider, setProvider, setAccounts} = this.props;
        if (!provider) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);
            provider.listAccounts().then((accounts) => {
                setAccounts(accounts);
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { accounts, provider, signer, updateSigner } = this.props;

        if (accounts.length > 0 && provider && (!signer || signer.address !== accounts[0] ) ) {
            updateSigner(provider, accounts[0]);
        }
    }

    render() {
        const {accounts} = this.props;
        const account = accounts[0];

        return (<nav className="bg-gray-900 border-b border-gray-700 shadow-lg absolute top-0 left-0 right-0">
            <div className="max-w-6xl mx-auto px-4 flex justify-between">
                <div>
                    <Link href="#">
                        <a className="flex items-center py-4 px-2">
                            <span className="font-semibold text-gray-100 text-xl">Chain Message</span>
                        </a>
                    </Link>
                </div>
                <div className="hidden md:flex items-center space-x-1">
                    <div className={"inline-flex items-center bg-gray-800 text-gray-300 " +
                    `px-3 py-2 rounded-lg overflow-hidden ${account ? "" : "hidden"}`}>
                        <UserIcon className="h-5 w-5 mr-2"/>
                        {abbreviateAddress(account || "")}
                    </div>
                    <ConnectToWalletButton className={account ? "hidden" : ""}/>
                </div>
            </div>
        </nav>);
    }

}

const mapStateToProps = (state) => {
    return {
        accounts: state.accounts,
        provider: state.provider
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
        setAccounts: accounts => dispatch(setAccounts(accounts)),
        updateSigner: (provider, account) => updateSigner(dispatch, provider, account),
        setProvider: (provider) => { dispatch(setProvider(provider)) }
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);