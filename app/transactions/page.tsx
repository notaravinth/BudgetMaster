"use client"

import { useState, useEffect } from "react";

const Transactions = () => {
	const [transactions, setTransactions] = useState([]);
	const [showAddModal, setShowAddModal] = useState(false);
	const [filter, setFilter] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [newTransaction, setNewTransaction] = useState({
		description: '',
		amount: '',
		type: 'expense',
		category: '',
		date: new Date().toISOString().split('T')[0]
	});

	useEffect(() => {
		fetchTransactions();
	}, []);

	const fetchTransactions = async () => {
		try {
			const response = await fetch('http://localhost:5000/api/transactions');
			if (!response.ok) throw new Error('Failed to fetch transactions');
			const data = await response.json();
			setTransactions(data);
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch('http://localhost:5000/api/transactions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newTransaction),
			});

			if (!response.ok) throw new Error('Failed to add transaction');
			fetchTransactions();
			setShowAddModal(false);
			setNewTransaction({
				description: '',
				amount: '',
				type: 'expense',
				category: '',
				date: new Date().toISOString().split('T')[0]
			});
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const filteredTransactions = transactions
		.filter(transaction => {
			if (filter === 'all') return true;
			return transaction.type === filter;
		})
		.filter(transaction =>
			transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
		);

	const getTotalAmount = (type) => {
		return transactions
			.filter(t => t.type === type)
			.reduce((sum, t) => sum + t.amount, 0);
	};
	return (
		<main className="bg-gold-1 bg-cover bg-center bg-no-repeat h-screen overflow-scroll">
			<div className="px-8 py-8 max-w-[1200px] mx-auto">
				<div className="mb-8">
					<div className="bg-gold-4 rounded-[15px] p-8 shadow-md">
						<h2 className="text-black-3 text-[1.1rem] mb-4">Current Balance</h2>
						<div className="text-black-3 text-[2.5rem] font-semibold mb-6">
							${(getTotalAmount('income') - getTotalAmount('expense')).toFixed(2)}
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-2 p-4 rounded-[10px] bg-gold-5">
								<span className="text-black-3 text-[0.9rem]">Income</span>
								<span className="text-[1.25rem] font-semibold text-[#2ecc71]">${getTotalAmount('income').toFixed(2)}</span>
							</div>
							<div className="flex flex-col gap-2 p-4 rounded-[10px] bg-gold-5">
								<span className="text-black-3 text-[0.9rem]">Expenses</span>
								<span className="text-[1.25rem] font-semibold text-[#e74c3c]">${getTotalAmount('expense').toFixed(2)}</span>
							</div>
						</div>
					</div>
				</div>

				<div className="px-8 py-8 max-w-[1200px] mx-auto">
					<div className="flex justify-between items-center mb-8">
						<div className="flex gap-4 flex-1 max-w-[600px]">
							<input
								type="text"
								placeholder="Search transactions..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="flex-1 p-3 border-2 border-black-2 rounded-lg text-[1rem] text-black-1 focus:outline-none focus:border-black-2"
							/>
							<select
								value={filter}
								onChange={(e) => setFilter(e.target.value)}
								className="p-3 border-2 border-white rounded-lg text-[1rem] text-text-secondary bg-white cursor-pointer min-w-[120px]"
							>
								<option value="all">All</option>
								<option value="income">Income</option>
								<option value="expense">Expenses</option>
							</select>
						</div>
						<button className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700 transition duration-300" onClick={() => setShowAddModal(true)}>
							Add Transaction
						</button>
					</div>

					<div className="flex flex-col gap-4">
						{filteredTransactions.map((transaction) => (
							<div key={transaction._id} className={`bg-white rounded-[10px] p-5 shadow-md transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105 ${transaction.type}`}>
								<div className="flex justify-between items-center">
									<div className="flex flex-col gap-2">
										<h3 className="text-black-1 text-[1.1rem] m-0">{transaction.description}</h3>
										<span className="bg-white text-black-3 px-3 py-1 rounded-[15px] text-sm">{transaction.category}</span>
									</div>
									<div className="flex flex-col items-end gap-2">
										<span className={`font-semibold text-[1.1rem] ${transaction.type === 'income' ? "text-[#2ecc71]" : "text-[#e74c3c]"}`}>
                                            {transaction.type === 'income' ? '+' : '-'} ${Math.abs(transaction.amount).toFixed(2)}
										</span>
										<span className="text-slate-800 text-sm">{new Date(transaction.date).toLocaleDateString()}</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{showAddModal && (
					<div className="fixed inset-0 bg-gold-3 bg-opacity-40 flex justify-center items-start p-8 overflow-y-auto z-[1000]">
						<div className="bg-yellow-2 bg-opacity-95 rounded-[15px] p-8 w-full max-w-[500px] shadow-lg">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-black-3 font-bold text-2xl m-0">Add Transaction</h2>
								<button className="bg-transparent border-none text-black-3 text-2xl cursor-pointer p-2" onClick={() => setShowAddModal(false)}>×</button>
							</div>
							<form onSubmit={handleSubmit}>
								<div className="mb-5">
									<label className="block text-black-2 mb-2 font-medium">Description</label>
									<input
										type="text"
										value={newTransaction.description}
										onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
										required
										className="w-full p-3 border-2 border-white rounded-lg text-black-3 text-base focus:outline-none focus:border-black-3"
									/>
								</div>
								<div className="grid grid-cols-2 gap-4 mb-5">
									<div className="mb-5">
										<label className="block text-black-3 mb-2 font-medium">Amount</label>
										<input
											type="number"
											step="0.01"
											value={newTransaction.amount}
											onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
											required
											className="w-full p-3 border-2 border-white rounded-lg text-black-3 text-base focus:outline-none focus:border-black-3"
										/>
									</div>
									<div className="mb-5">
										<label className="block text-black-3 mb-2 font-medium">Type</label>
										<select
											value={newTransaction.type}
											onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
											className="w-full p-3 border-2 border-white rounded-lg text-black-3 text-base focus:outline-none focus:border-black-3"
										>
											<option value="expense">Expense</option>
											<option value="income">Income</option>
										</select>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4 mb-5">
									<div className="mb-5">
										<label className="block text-black-3 mb-2 font-medium">Category</label>
										<select
											value={newTransaction.category}
											onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
											required
											className="w-full p-3 border-2 border-white rounded-lg text-black-3 text-base focus:outline-none focus:border-black-3"
										>
											<option value="">Select Category</option>
											<option value="Food">Food</option>
											<option value="Transportation">Transportation</option>
											<option value="Housing">Housing</option>
											<option value="Utilities">Utilities</option>
											<option value="Entertainment">Entertainment</option>
											<option value="Healthcare">Healthcare</option>
											<option value="Shopping">Shopping</option>
											<option value="Other">Other</option>
										</select>
									</div>
									<div className="mb-5">
										<label className="block text-black-3 mb-2 font-medium">Date</label>
										<input
											type="date"
											value={newTransaction.date}
											onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
											required
											className="w-full p-3 border-2 border-white rounded-lg text-black-3 text-base focus:outline-none focus:border-black-3"
										/>
									</div>
								</div>
								<button type="submit" className="w-full p-4 bg-yellow-3 text-black border-none rounded-lg text-base font-medium cursor-pointer transition duration-200 ease-in-out hover:bg-yellow-4">Add Transaction</button>
							</form>
						</div>
					</div>
				)}
			</div>
		</main>
	);
};

export default Transactions;
