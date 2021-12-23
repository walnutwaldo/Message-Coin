import React, {Component} from "react";
import ReactDOM from "react-dom";

import ArrowLeftIcon from '../../public/icons/arrowLeft.svg';
import ExitIcon from '../../public/icons/exit.svg';

class Modal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isBrowser: false
        }
        this.modalRef = React.createRef();
    }

    componentDidMount() {
        this.setState({
            isBrowser: true
        });
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
        const {show, onHide, showBack, onBack, title, children, onTransitionEnd} = this.props;
        const {visible, isBrowser} = this.state;

        if (isBrowser) {
            return ReactDOM.createPortal(
                (
                    <div className={"fixed top-0 left-0 right-0 z-50 overflow-auto bg-black bg-opacity-10 backdrop-filter backdrop-blur-sm flex "
                    + `w-screen h-screen transition ${(visible || show) ? 'visible' : 'invisible'} `
                    + `${show ? 'opacity-100' : 'opacity-0'}`}
                         onClick={(event) => this.ifOutsideModal(event, onHide)}
                         onTransitionEnd={() => {
                             if (onTransitionEnd) onTransitionEnd();
                             this.setVisible(show)
                        }}
                    >
                        <div ref={this.modalRef} className={"relative w-full max-w-lg m-auto p-8 pt-4 bg-white text-gray-900 " +
                        "border-t-4 border-b-4 border-gray-700 flex-col flex shadow-xl transform transition-all transform " +
                        `${show ? 'scale-x-100' : 'scale-y-0'}`}>
                            <div>
                                <button className={`absolute top-4 left-4 hover:text-blue-200 transition ${showBack ? "visible": "hidden"}`} onClick={onBack}>
                                    <ArrowLeftIcon className={"h-6 w-6"}/>
                                </button>
                                <h3 className="text-xl font-semibold text-center">
                                    {title}
                                </h3>
                                <button className="absolute top-4 right-4 hover:text-gray-500 transition" onClick={onHide}>
                                    <ExitIcon className="h-6 w-6"/>
                                </button>
                            </div>
                            <div className={"mt-4"}>
                                {children}
                            </div>
                        </div>
                    </div>
                ),
                document.getElementById("modal-root")
            );
        } else {
            return null;
        }
    }

}

Modal.getInitialProps = async () => {
    return {
        onHide: () => {},
        onBack: () => {},
        showBack: false,
        show: true
    }
}

export default Modal;