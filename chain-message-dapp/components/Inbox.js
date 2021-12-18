import React, {Component} from 'react';

const myMessages = [{
    id: "0x12312312",
    from: "0xdspi29dfda",
    message: "This is a test.",
    time: Date.now() / 1000 - 24 * 60 * 60
}, {
    id: "0x331412",
    from: "0xhi01293df",
    message: "This is a test too.",
    time: Date.now() / 1000 - 100 * 60 * 60
}];

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
    }

    render() {
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
                {myMessages.map((message) => (
                    <li key={message.id}>
                        <button
                            className="text-black block bg-white shadow w-full py-2 px-4 flex justify-between rounded-md my-2 hover:bg-gray-100">
                        <span>
                            <span className="font-semibold mr-4">From: {message.from.substr(0, 6)}</span>
                            <span>{message.message}</span>
                        </span>
                            <span className="space-x-1">{dateString(message.time)}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>)
    }

}

export default Inbox;