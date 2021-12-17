import React, {Component} from 'react';
import {connect} from 'react-redux';
import {ReactComponent as MetamaskIcon} from "./icons/metamask.svg";

import {setAccounts} from "./redux/accounts/accounts";

import Modal from "./Modal";

import MetaMaskOnboarding from '@metamask/onboarding';

const metaMaskOnboarding = new MetaMaskOnboarding();

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

    setModalScreen(value) {
        this.setState(() => ({
            modalScreen: value
        }));
    }

    async tryConnectMetamask(onHide, setAccounts) {
        if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
            this.setModalScreen("Install Metamask");
        } else {
            const {ethereum} = window;
            try {
                const accounts = await ethereum.request({method: 'eth_requestAccounts'});
                setAccounts(accounts);
                onHide();
            } catch (error) {
                console.error(error);
            }
        }
    }

    installMetamask() {
        metaMaskOnboarding.startOnboarding();
    }

    render() {
        const {show, onHide, setAccounts} = this.props;
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
                <ul>
                    {!modalScreen && (<li>
                        <Button onClick={() => this.tryConnectMetamask(onHide, setAccounts)}>
                            <MetamaskIcon className="inline mr-4 w-8 h-8"/> Metamask
                        </Button>
                    </li>)
                    }
                    {modalScreen === "Install Metamask" && <li>
                        <Button onClick={() => this.installMetamask()}>
                            <MetamaskIcon className="inline mr-4 w-8 h-8"/> Install Metamask
                        </Button>
                    </li>}
                </ul>
            </Modal>
        )
    }

}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({
    setAccounts: (accounts) => dispatch(setAccounts(accounts))
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletConnectModal);