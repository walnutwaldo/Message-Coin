import React, {Component} from 'react';
import Link from 'next/link';
import {connect} from 'react-redux';
import {setAccounts} from '../store/accounts/accounts';

import {ethers} from 'ethers';

import WalletConnectModal from "./WalletConnectModal";

import UserIcon from '../public/icons/user.svg';

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
        const {show} = this.state;

        return (<>
            <WalletConnectModal show={show} onHide={() => this.setShow(false)}/>
            <button className={"bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 text-gray-300 px-3 py-2 rounded-lg transition"}
                    onClick={() => this.setShow(true)}>
                Connect to a Wallet
            </button>
        </>)
    }

}

function abbreviateAddress(addr) {
    return addr.substring(0, 6) + "..." + addr.substr(addr.length - 4, 4);
}

class Navbar extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {ethereum} = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            provider.listAccounts().then((accounts) => {
                this.props.setAccounts(accounts);
            });
        }
    }

    render() {
        const {accounts} = this.props;

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
                    {accounts.length ? <div className="inline-flex items-center bg-gray-800 text-gray-300 px-3 py-2 rounded-lg overflow-hidden">
                        <UserIcon className="h-5 w-5 mr-2"/>
                        {abbreviateAddress(accounts[0])}
                    </div> : <ConnectToWalletButton/>}
                </div>
            </div>
        </nav>);
    }

}

const mapStateToProps = (state) => {
    return {
        accounts: state.accounts
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
        setAccounts: accounts => dispatch(setAccounts(accounts))
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);