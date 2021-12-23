export function formatWithCommas(val) {
    if (val === null) {
        return "";
    }
    if (val % 1 === 0) {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
        const decimals = Number((val % 1).toFixed(6)).toString().substr(1);
        return formatWithCommas(Math.floor(val)) + decimals;
    }
}