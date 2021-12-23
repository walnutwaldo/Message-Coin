import React, {Component} from 'react';
import {connect} from 'react-redux';

import {setAccounts} from "../store/accounts/accounts";

import Modal from "./modals/Modal";

import MetamaskIcon from '../public/icons/metamask.svg';

import MetaMaskOnboarding from '@metamask/onboarding';

let metaMaskOnboarding;
function setMetaMaskOnboarding() {
    metaMaskOnboarding = new MetaMaskOnboarding();
}

class Button extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<button
            className="border border-gray-700 shadow rounded-md filter drop-shadow p-4 w-full text-left bg-white hover:bg-gray-100 hover:shadow-md transition inline-flex items-center text-md"
            onClick={this.props.onClick}
        >
            {this.props.children}
        </button>);
    }

}

class WalletConnectModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalScreen: ""
        }
    }

    componentDidMount() {
        if (!metaMaskOnboarding) {
            setMetaMaskOnboarding();
        }
    }

    setModalScreen(value) {
        this.setState(() => ({
            modalScreen: value
        }));
    }

    tryConnectMetamask(onHide) {
        if (!metaMaskOnboarding) return;
        if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
            this.setModalScreen("Install Metamask");
        } else {
            if (window) {
                const {ethereum} = window;
                try {
                    ethereum.request({method: 'eth_requestAccounts'}).then(accounts => {
                        this.props.setAccounts(accounts);
                        onHide();
                    })
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

    installMetamask() {
        if (!metaMaskOnboarding) return;
        metaMaskOnboarding.startOnboarding();
    }

    render() {
        const {show, onHide} = this.props;
        const {modalScreen} = this.state;

        return (
            <Modal show={show} onHide={() => {
                this.setModalScreen("");
                onHide();
            }} title={
                modalScreen || "Choose a wallet provider"
            } showBack={
                !!modalScreen
            } onBack={
                () => this.setModalScreen("")
            }>
                {<ul>
                    {!modalScreen && (<li>
                        <Button onClick={() => this.tryConnectMetamask(onHide)}>
                            <MetamaskIcon className="inline mr-4 w-8 h-8"/> Metamask
                        </Button>
                    </li>)
                    }
                    {modalScreen === "Install Metamask" && <li>
                        <Button onClick={() => this.installMetamask()}>
                            <MetamaskIcon className="inline mr-4 w-8 h-8"/> Install Metamask
                        </Button>
                    </li>}
                </ul>}
            </Modal>
        )
    }

}

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
    setAccounts: (accounts) => dispatch(setAccounts(accounts))
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletConnectModal);