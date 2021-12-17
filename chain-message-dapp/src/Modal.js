import React, {Component} from "react";
import ReactDOM from "react-dom";

import {ReactComponent as ArrowLeftIcon} from "./icons/arrowLeft.svg";
import {ReactComponent as ExitIcon} from "./icons/exitIcon.svg";

class Modal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
        this.modalRef = React.createRef();
    }

    setVisible(newVisible) {
        this.setState(() => ({
            visible: newVisible
        }));
    }

    ifOutsideModal(clickEvent, action) {
        if (!this.modalRef.current.contains(clickEvent.target)) {
            action();
        }
    }

    render() {
        const {show, onHide, showBack, onBack, title, children} = this.props;
        const {visible} = this.state;

        const body = (
            <div className={"fixed pin z-50 overflow-auto bg-black bg-opacity-10 backdrop-filter backdrop-blur-sm flex "
                + `w-screen h-screen transition ${(visible || show) ? 'visible' : 'invisible'} `
                + `${show ? 'opacity-100' : 'opacity-0'}`}
                 onClick={(event) => this.ifOutsideModal(event, onHide)} onTransitionEnd={() => {
                this.setVisible(show)
            }}>
                <div ref={this.modalRef} className={"relative w-full max-w-md m-auto p-8 pt-4 bg-white text-gray-900 " +
                    "border-t-4 border-b-4 border-gray-700 flex-col flex shadow-xl transform transition-all transform " +
                    `${show ? 'scale-x-100' : 'scale-y-0'}`}>
                    <div>
                        <button className={`absolute top-4 left-4 hover:text-blue-200 transition ${showBack ? "visible": "hidden"}`} onClick={onBack}>
                            <ArrowLeftIcon className={"h-6 w-6"}/>
                        </button>
                        <h3 className="text-xl font-semibold text-center">
                            {title}
                        </h3>
                        <button className="absolute top-4 right-4 hover:text-blue-200 transition" onClick={onHide}>
                            <ExitIcon className="h-6 w-6"/>
                        </button>
                    </div>
                    <div className={"mt-4"}>
                        {children}
                    </div>
                </div>
            </div>
        );

        return ReactDOM.createPortal(
            body,
            document.querySelector("#modal")
        );
    }

}

Modal.defaultProps = {
    onHide: () => {},
    onBack: () => {},
    showBack: false,
    show: true
}

export default Modal;