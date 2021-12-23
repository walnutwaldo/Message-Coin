import React, {Component} from "react";

class CustomButton extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<button className={"rounded-md px-4 py-3 text-sm font-semibold transition shadow " +
        "hover:shadow-lg" + " " + this.props.className + " " +
        "disabled:bg-gray-300 disabled:shadow-none disabled:text-gray-500 disabled:border-gray-400 disabled:opacity-50"} onClick={this.props.onClick} disabled={this.props.disabled}>
            {this.props.children}
        </button>)
    }

}

export default CustomButton;