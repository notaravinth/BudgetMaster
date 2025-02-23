"use client"

import { useState, useEffect } from "react";

export default function Budget() {
    const [budgets, setBudgets] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [totalBudgeted, setTotalBudgeted] = useState(0);
    const [newBudget, setNewBudget] = useState({
        category: '',
        amount: '',
        period: 'monthly',
        description: ''
    });

    useEffect(() => {
        fetchBudgets();
    }, []);

    useEffect(() => {
        const total = budgets.reduce((sum, budget) => sum + budget.amount, 0);
        setTotalBudgeted(total);
    }, [budgets]);

    const fetchBudgets = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/budgets');
            if (!response.ok) throw new Error('Failed to fetch budgets');
            const data = await response.json();
            setBudgets(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/api/budgets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBudget),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            fetchBudgets();
            setShowAddModal(false);
            setNewBudget({
                category: '',
                amount: '',
                period: 'monthly',
                description: ''
            });
        } catch (error) {
            alert(error.message);
            console.error('Error:', error);
        }
    };

    return (
        <main className="bg-gold-1 bg-cover bg-center bg-no-repeat h-screen overflow-scroll">
            <div className="px-4 md:px-8 p-8 max-w-[1200px] mx-auto">
                <div className="mb-8">
                    <div className="bg-gold-4 rounded-xl p-8 shadow-md">
                        <h2 className="text-black-3 text-base mb-4">Total Monthly Budget</h2>
                        <span className="block text-black-3 text-4xl font-semibold mb-6">${totalBudgeted.toFixed(2)}</span>
                    </div>
                </div>

                <div className="budgets-section">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-black-3 font-bold text-2xl">Budget Categories</h2>
                        <button className="bg-gray-600 text-xl text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700 transition duration-300" onClick={() => setShowAddModal(true)}>
                            Add Budget
                        </button>
                    </div>

                    <div className="grid grid-cols-auto-fill-300 gap-6">
                        {budgets.map((budget) => (
                            <div key={budget._id} className="bg-white rounded-[10px] p-5 shadow-md transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-black-1 text-xl m-0">{budget.category}</h3>
                                    <span className="bg-white text-black-3 px-3 py-1 rounded-[15px] text-sm">{budget.period}</span>
                                </div>
                                <div className="mb-4">
                                    <span className="block text-black-2 text-4xl font-semibold mb-6">${budget.amount.toFixed(2)}</span>
                                </div>
                                {budget.description && (
                                    <p className="text-black-2 text-[0.9rem] my-4 leading-6">{budget.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {showAddModal && (
                    <div className="fixed inset-0 bg-gold-3 bg-opacity-40 flex justify-center items-start p-8 overflow-y-auto z-[1000]">
                        <div className="bg-yellow-2 bg-opacity-95 rounded-[15px] p-8 w-full max-w-[500px] shadow-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-black-3 font-bold text-2xl m-0">Add Budget</h2>
                                <button className="bg-transparent border-none text-black-3 text-2xl cursor-pointer p-2" onClick={() => setShowAddModal(false)}>×</button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-5">
                                    <label>Category</label>
                                    <select
                                        value={newBudget.category}
                                        onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
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
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div className="mb-5">
                                        <label>Amount</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={newBudget.amount}
                                            onChange={(e) => setNewBudget({...newBudget, amount: Number(e.target.value)})}
                                            required
                                            className="w-full p-3 border-2 border-white rounded-lg text-black-3 text-base focus:outline-none focus:border-black-3"
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label>Period</label>
                                        <select
                                            value={newBudget.period}
                                            onChange={(e) => setNewBudget({...newBudget, period: e.target.value})}
                                            className="w-full p-3 border-2 border-white rounded-lg text-black-3 text-base focus:outline-none focus:border-black-3"
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-5">
                                    <label>Description (Optional)</label>
                                    <textarea
                                        value={newBudget.description}
                                        onChange={(e) => setNewBudget({...newBudget, description: e.target.value})}
                                        placeholder="Add a description for this budget"
                                        className="w-full p-3 border-2 border-white rounded-lg text-black-3 text-base focus:outline-none focus:border-black-3"
                                    />
                                </div>
                                <button type="submit" className="w-full p-4 bg-yellow-3 text-black border-none rounded-lg text-base font-medium cursor-pointer transition duration-200 ease-in-out hover:bg-yellow-4">Add Budget</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
