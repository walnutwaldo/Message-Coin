import React, {Component} from 'react';
import Link from 'next/link';
import {connect} from 'react-redux';
import {setAccounts} from '../store/accounts/accounts';
import {setProvider} from "../store/provider/provider";
import {deleteSigner, updateSigner} from "../store/provider/signer";
import {setChain} from "../store/provider/chain"
import {abbreviateAddress} from "../utils/addressTools";

import WalletConnectModal from "./WalletConnectModal";

import UserIcon from '../public/icons/user.svg';
import {BigNumber, ethers} from "ethers";
import {VALID_CHAINS} from "./constants";

import ConnectWalletEvent from "../events/connectWallet";

class ConnectToWalletButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
    }

    componentDidMount() {
        ConnectWalletEvent.addListener(this.show.bind(this));
    }

    componentWillUnmount() {
        ConnectWalletEvent.removeListener(this.show.bind(this));
    }

    show() {
        this.setState({show: true});
    }

    hide() {
        this.setState({show: false})
    }

    render() {
        const {className} = this.props;
        const {show} = this.state;

        return (<div className={className}>
            <WalletConnectModal show={show} onHide={this.hide.bind(this)}/>
            <button
                className={"bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 text-gray-300 px-3 py-2 rounded-lg transition"}
                onClick={() => this.show.bind(this)}>
                Connect to a Wallet
            </button>
        </div>)
    }

}

class Navbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chain: -1
        }
    }

    componentDidMount() {
        let {provider, setProvider, setAccounts, setChain} = this.props;
        if (!provider && window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
            setProvider(provider);
            provider.listAccounts().then((accounts) => {
                setAccounts(accounts);
            });
            setChain(Number(window.ethereum.networkVersion))

            // detect Metamask account change
            window.ethereum.on('accountsChanged', function (accounts) {
                setAccounts(accounts || []);
            });

            // detect Network account change
            window.ethereum.on('chainChanged', function (networkId) {
                setChain(BigNumber.from(networkId).toNumber())
            }.bind(this));
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {accounts, provider, signer, updateSigner, deleteSigner, chain} = this.props;

        const validChain = VALID_CHAINS.includes(chain);
        if (accounts.length > 0 && (signer || {address: null}).address !== accounts[0] && validChain) {
            // Need to change account
            updateSigner(provider, accounts[0]);
        } else if ((accounts.length === 0 || !validChain) && signer) {
            // Need to remove the signer
            deleteSigner();
            console.log("deleted signer")
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

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => {
    return ({
        setAccounts: accounts => dispatch(setAccounts(accounts)),
        updateSigner: (provider, account) => updateSigner(dispatch, provider, account),
        deleteSigner: () => dispatch(deleteSigner()),
        setProvider: (provider) => {
            dispatch(setProvider(provider))
        },
        setChain: (chain) => dispatch(setChain(chain))
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);