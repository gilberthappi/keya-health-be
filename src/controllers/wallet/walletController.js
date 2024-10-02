// controllers/walletController.js
// import { Wallet } from "../../models";

// export const getWallet = async (req, res) => {
//   try {
//     const wallet = await Wallet.findOne({ user: req.userId });
//     if (!wallet) {
//       return res.status(404).json({ msg: 'Wallet not found' });
//     }
//     res.json(wallet);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };
// export const addTransaction = async (req, res) => {
//   const { type, amount } = req.body;
//   try {
//     let wallet = await Wallet.findOne({ user: req.userId });
//     if (!wallet) {
//       wallet = new Wallet({ user: req.userId, balance: 0, transactions: [] });
//     }

//     if (type === 'withdrawal' && wallet.balance < amount) {
//       return res.status(400).json({ msg: 'Insufficient balance' });
//     }

//     wallet.transactions.push({ type, amount });
//     wallet.balance += type === 'deposit' ? amount : -amount;

//     await wallet.save();
//     res.json(wallet);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };

// controllers/walletController.js
import { Wallet } from "../../models";
import createTransaction from "../../utils/paypack";

export const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.userId });
    if (!wallet) {
      return res.status(404).json({ msg: 'Wallet not found' });
    }
    res.json(wallet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const addTransaction = async (req, res) => {
  const { type, amount, number} = req.body;
  // console.log(req.body, type, amount, number);
  
  try {
    let wallet = await Wallet.findOne({ user: req.userId });
    if (!wallet) {
      wallet = new Wallet({ user: req.userId, balance: 0, transactions: [] });
    }

    if (type === 'withdrawal' && wallet.balance < amount) {
      return res.status(400).json({ msg: 'Insufficient balance' });
    }

    const paypackTransaction = await createTransaction(type, amount, number);

    wallet.transactions.push({ type, amount, paypackTransactionId: paypackTransaction.id });
    wallet.balance += type === 'deposit' ? amount : -amount;

    await wallet.save();
    res.json(wallet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
