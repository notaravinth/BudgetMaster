"use client";

import { useState, useEffect } from "react";

export default function Report() {
    const [transactions, setTransactions] = useState([]);
    const [timeframe, setTimeframe] = useState("month");
    const [categoryTotals, setCategoryTotals] = useState({});
    const [monthlySpending, setMonthlySpending] = useState([]);

    useEffect(() => {
        fetchTransactions();
    }, [timeframe]);

    const fetchTransactions = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/transactions/report?timeframe=${timeframe}`
            );

            if (!response.ok) throw new Error("Failed to fetch transactions");
            const data = await response.json();
            setTransactions(data);
            calculateCategoryTotals(data);
            calculateMonthlySpending(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const calculateCategoryTotals = (data) => {
        const totals = data.reduce((acc, transaction) => {
            if (transaction.type === "expense") {
                acc[transaction.category] =
                    (acc[transaction.category] || 0) + transaction.amount;
            }

            return acc;
        }, {});

        setCategoryTotals(totals);
    };

    const calculateMonthlySpending = (data) => {
        const monthly = data.reduce((acc, transaction) => {
            if (transaction.type === "expense") {
                const month = new Date(transaction.date).toLocaleString(
                    "default",
                    { month: "short" }
                );
                acc[month] = (acc[month] || 0) + transaction.amount;
            }
            return acc;
        }, {});
        setMonthlySpending(Object.entries(monthly));
    };

    const getTotalIncome = () => {
        return transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);
    };

    const getTotalExpenses = () => {
        return transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);
    };

    const getMaxSpendingCategory = () => {
        return Object.entries(categoryTotals)
            .sort(([, a], [, b]) => b - a)[0];
    };

    return (
        <main className="bg-gold-1 bg-cover bg-center bg-no-repeat h-screen overflow-scroll">
            <div className="px-8 py-8 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-black-3 font-bold text-3xl">
                        Financial Reports
                    </h1>
                    <select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="px-6 py-3 border-2 border-white rounded-lg text-base text-black-3 bg-[#ffffff] cursor-pointer"
                    >
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year">This Year</option>
                    </select>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-gold-5 rounded-[15px] p-6 text-center shadow-md">
                        <h3 className="text-yellow-3 text-base font-bold mb-4">Total Income</h3>
                        <span className="block text-[#2ecc71] text-2xl font-semibold ">
                            ${getTotalIncome().toFixed(2)}
                        </span>
                    </div>

                    <div className="bg-gold-5 rounded-[15px] p-6 text-center shadow-md">
                        <h3 className="text-yellow-3 text-base font-bold mb-4">Total Expenses</h3>
                        <span className="block text-[#e74c3c] text-2xl font-semibold">
                            ${getTotalExpenses().toFixed(2)}
                        </span>
                    </div>

                    <div className="bg-gold-5 rounded-[15px] p-6 text-center shadow-md">
                        <h3 className="text-yellow-3 text-base font-bold mb-4">Net Balance</h3>
                        <span className="block text-[#2B4865] text-2xl font-semibold">
                            ${(getTotalIncome() - getTotalExpenses()).toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="grid grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-gold-5 rounded-xl p-6 shadow-md">
                        <h3 className="text-black-3 font-bold text-center text-xl mb-6">
                            Spending by Category
                        </h3>

                        <div className="flex flex-col gap-4">
                            {Object.entries(categoryTotals).map(
                                ([category, amount]) => (
                                    <div key={category} className="w-full">
                                        <div className="flex justify-between mb-2 text-[#537188] text-[0.9rem]">
                                            <span>{category}</span>
                                            <span>${amount.toFixed(2)}</span>
                                        </div>

                                        <div className="h-2 bg-yellow-1 rounded-md overflow-hidden">
                                            <div
                                                className="h-full bg-[#5B8FB9] transition-all duration-300 ease-in-out"
                                                style={{
                                                    width: `${
                                                        (amount /
                                                            getTotalExpenses()) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    <div className="bg-gold-5 rounded-[15px] p-6 shadow-md">
                        <h3 className="text-black-3 font-bold text-center text-xl mb-6">Monthly Spending Trend</h3>
                        <div className="h-[200px] flex items-end justify-between pt-4">
                            {monthlySpending.map(([month, amount]) => (
                                <div
                                    key={month}
                                    className="flex flex-1 flex-col items-center gap-2"
                                >
                                    <div
                                        className="w-[30px] bg-[#5B8FB9] rounded-t-md transition-all duration-300 ease-in-out"
                                        style={{
                                            height: `${
                                                (amount /
                                                    Math.max(
                                                        ...monthlySpending.map(
                                                            ([, a]) => a
                                                        )
                                                    )) *
                                                100
                                            }%`,
                                        }}
                                    ></div>
                                    <span className="text-[#537188] text-sm">
                                        {month}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-gold-5 rounded-[15px] p-6 shadow-md">
                    <h3 className="text-black-3 font-bold text-center text-xl mb-6">
                        Key Insights
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-yellow-1 rounded-lg p-5">
                            <h4 className="text-black-2 font-bold text-base mb-3">
                                Highest Spending Category
                            </h4>
                            {getMaxSpendingCategory() && (
                                <p className="text-[#537188] text-lg">
                                    <strong className="text-[#2B4865]">
                                        {getMaxSpendingCategory()[0]}
                                    </strong>{" "}
                                    at ${getMaxSpendingCategory()[1].toFixed(2)}
                                </p>
                            )}
                        </div>
                        <div className="bg-yellow-1 rounded-lg p-5">
                            <h4 className="text-black-2 font-bold text-base mb-3">Savings Rate</h4>
                            <p className="text-black-3 text-lg">
                                {getTotalIncome()
                                    ? `${(
                                          ((getTotalIncome() - getTotalExpenses()) /
                                              getTotalIncome()) *
                                          100
                                      ).toFixed(1)}%`
                                    : "0%"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
