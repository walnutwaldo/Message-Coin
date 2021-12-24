import {ethers} from "ethers";
import * as Constants from "../../components/constants";

const SET_SIGNER = 'SET_SIGNER'
const DELETE_SIGNER = 'DELETE_SIGNER'

export const defaultSigner = null;

export function setSigner(signer, address, mcc) {
    return {
        type: SET_SIGNER,
        signer: {
            signer,
            address,
            messageCoinContract: mcc
        }
    }
}

export function deleteSigner() {
    return {
        type: DELETE_SIGNER
    }
}

function signer(state=defaultSigner, action) {
    switch (action.type) {
        case SET_SIGNER:
            return action.signer
        case DELETE_SIGNER:
            return defaultSigner
        default:
            return state;
    }
}

export function updateSigner(dispatch, provider, address) {
    const signer = provider.getSigner(address);
    const messageCoinContract = new ethers.Contract(Constants.MESSAGE_COIN_CONTRACT_ADDRESS, Constants.MESSAGE_COIN_ABI, signer);
    dispatch(setSigner(signer, address, messageCoinContract));
}

export default signer;