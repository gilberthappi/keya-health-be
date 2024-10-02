const PaypackJs = require("paypack-js").default;
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
console.log(CLIENT_ID + "\n "+ CLIENT_SECRET);
const paypack = PaypackJs.config({
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
});
const createTransaction = async (type, amount, number) => {
  try {
    let transaction;
    const environment= "development";
    if (type === 'deposit') {
      transaction = await paypack.cashin({ number, amount, environment });
    } else if (type === 'withdrawal') {
      transaction = await paypack.cashout({ number, amount, environment });
    }
    console.log("transaction",transaction); 
    
    return transaction.data;
  } catch (error) {
    console.log("error: ", error);
    throw new Error('Paypack transaction failed');
  }
};

export default createTransaction
