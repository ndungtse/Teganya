export const convert = (amount, from, to, rates) => (amount / rates[from]) * rates[to]

export const formatMoney = (amount, code) => `${code} ${amount.toFixed(2)}`
