import React, {Component} from 'react';
import {connect} from "react-redux";
import {abbreviateAddress} from "../utils/addressTools";

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function dateString(timeStamp) {
    let dt = new Date(timeStamp * 1000);
    let [year, month, day] = dt.toISOString().split('T')[0].split('-');
    return monthNames[Number(month) - 1].substr(0, 3) + " " + day + ", " + year;
}

class Inbox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: []
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {signer} = this.props;
        if (signer && !prevProps.signer) {
            const filter = signer.messageCoinContract.filters.Message(null, signer.address);
            signer.messageCoinContract.queryFilter(filter).then((messages) => {
                console.log(messages);
                this.setState({
                    messages: messages
                });
            });
        }
    }

    render() {
        const {messages} = this.state;

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
                {messages.map((message) => {
                    const id = message.transactionHash;
                    const [from, to, timeStamp, content] = message.args;
                    const time = timeStamp ? dateString(timeStamp) : "Jan 1, 2022";
                    return (
                    <li key={id}>
                        <button
                            className="text-black block bg-white shadow w-full py-2 px-4 rounded-md my-2 hover:bg-gray-100">
                            <div className="flex justify-between">
                                <span className="text-left font-semibold mr-4">From: {abbreviateAddress(from)}</span>
                                <span className="text-right space-x-1">{time}</span>
                            </div>
                            <div className="w-full text-left text-gray-500 text-sm">
                                <span className="text-left">{content}</span>
                            </div>
                        </button>
                    </li>
                )})}
            </ul>
        </div>)
    }

}

const mapStateToProps = (state) => ({
    signer: state.signer
});

const mapDispatchToProps = (dispatch) => ({

});


export default connect(mapStateToProps, mapDispatchToProps)(Inbox);