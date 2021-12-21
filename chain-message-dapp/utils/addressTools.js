export function abbreviateAddress(addr) {
    return addr.substring(0, 6) + "..." + addr.substr(addr.length - 4, 4);
}