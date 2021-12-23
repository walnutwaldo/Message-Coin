import React, {Component} from 'react';
import {connect} from "react-redux";
import {abbreviateAddress} from "../utils/addressTools";

import CopyIcon from "../public/icons/copy.svg";
import CheckIcon from "../public/icons/check.svg";
import {setMessages} from "../store/messages/messages";

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function dateString(timeStamp) {
    let dt = new Date(timeStamp * 1000);
    let [year, month, day] = dt.toISOString().split('T')[0].split('-');
    return monthNames[Number(month) - 1].substr(0, 3) + " " + day + ", " + year;
}

class EmptyInboxDisplay extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<div className={"text-black block bg-white shadow w-full " +
        "py-2 px-4 rounded-md my-2 text-center"}>
            <b>Your Inbox is Empty</b><br/>
            You have no messages yet.
            <p className={"text-gray-700"}>
                Try sending your first message to someone.
            </p>
        </div>);
    }

}

class MessageCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showCheck: false
        }
    }

    render() {
        const {message} = this.props;
        const {showCheck} = this.state;

        const [from, to, timeStamp, content] = message.args;
        const time = timeStamp ? dateString(timeStamp) : "Jan 1, 2022";

        return (
                <div
                    className="text-black block bg-white shadow w-full py-2 px-4 rounded-md my-2">
                    <div className="flex justify-between">
                                <span className="text-left font-semibold mr-4 flex">
                                    From: {abbreviateAddress(from)}
                                    <button onClick={showCheck ? () => {} : () => {
                                        navigator.clipboard.writeText(from);
                                        this.setState({showCheck: true});
                                        setTimeout(() => this.setState({
                                            showCheck: false
                                        }), 2000)
                                    }} className={`my-auto rounded-md border ${showCheck ? "border-emerald-400" : "border-gray-200"} bg-gray-200 w-5 h-5 ml-2 p-px transition`}>
                                        {showCheck ? <CheckIcon className={"text-emerald-400"}/> : <CopyIcon className={"text-gray-700"}/>}
                                    </button>
                                </span>
                        <span className="text-right space-x-1">{time}</span>
                    </div>
                    <div className="w-full text-left text-gray-500 text-sm">
                        <span className="text-left">{content}</span>
                    </div>
                </div>);
    }

}

class Inbox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: []
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {signer, setMessages} = this.props;

        if (signer && !prevProps.signer) {
            const filter = signer.messageCoinContract.filters.Message(null, signer.address);
            signer.messageCoinContract.queryFilter(filter).then((messages) => {
                setMessages(messages.reverse());
            });
        }
    }

    render() {
        const { messages } = this.props;

        return (<div className={this.props.className}>
            <div className="text-white block bg-gray-700 w-full py-2 px-4 rounded-md flex justify-between">
            <span className="font-semibold">
                Inbox
            </span>
                <span className="space-x-1">
                Date
            </span>
            </div>
            <ul className="width-full">
                {messages.length === 0 && <EmptyInboxDisplay/>}
                {messages.map((message) => {
                    const id = message.transactionHash;

                    return (<li key={id}>
                        <MessageCard message={message}/>
                    </li>);
                })}
            </ul>
        </div>)
    }

}

const mapStateToProps = (state) => ({
    signer: state.signer,
    messages: state.messages
});

const mapDispatchToProps = (dispatch) => ({
    setMessages: (messages) => dispatch(setMessages(messages))
});


export default connect(mapStateToProps, mapDispatchToProps)(Inbox);