"use client";

import { useState, useEffect } from "react";

export default function BudgetReport() {
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
        <div className="px-8 py-8 max-w-5xl mx-auto">
              
            <div className="flex justify-between items-center mb-8">
                      
                <h1 className="text-[var(#2B4865)] text-2xl">
                    Financial Reports
                </h1>
                      
                <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="px-6 py-3 border-2 border-[var(--darker-blue)] rounded-lg text-base text-[var(--text-secondary)] bg-[var(--text-light)] cursor-pointer"
                >
                                            <option value="month">This Month</option>               
                            <option value="quarter">This Quarter</option>          
                    <option value="year">This Year</option>      
                </select>
                  
            </div>
              
            <div className="grid grid-cols-3 gap-6 mb-8">
                      
                <div className="summary-card income">
                                            <h3>Total Income</h3>          
                    <span className="amount">
                        ${getTotalIncome().toFixed(2)}
                    </span>
                          
                </div>
                      
                <div className="summary-card expenses">
                                            <h3>Total Expenses</h3>          
                    <span className="amount">
                        ${getTotalExpenses().toFixed(2)}
                    </span>
                          
                </div>
                      
                <div className="summary-card balance">
                                            <h3>Net Balance</h3>          
                    <span className="amount">
                        ${(getTotalIncome() - getTotalExpenses()).toFixed(2)}
                    </span>
                          
                </div>
                  
            </div>
              
            <div className="grid grid grid-cols-2 gap-6 mb-8">
                      
                <div className="bg-[var(--text-light)] rounded-xl p-6 shadow-md">
                              
                    <h3 className="text-[var(--text-primary)] text-xl mb-6">
                        Spending by Category
                    </h3>
                              
                    <div className="flex flex-col gap-4">
                                      
                        {Object.entries(categoryTotals).map(
                            ([category, amount]) => (
                                <div key={category} className="w-full">
                                                          
                                    <div className="flex justify-between mb-2 text-[var(--text-secondary)] text-[0.9rem]">
                                                                  
                                        <span>{category}</span>                                   
                                            <span>${amount.toFixed(2)}</span>           
                                                  
                                    </div>
                                                          
                                    <div className="h-2 bg-[var(--light-blue)] rounded-md overflow-hidden">
                                                                  
                                        <div
                                            className="h-full bg-[var(--accent-blue)] transition-all duration-300 ease-in-out"
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
                      
                <div className="chart-card">
                                            <h3>Monthly Spending Trend</h3>          
                    <div className="h-[200px] flex items-end justify-between pt-4">
                                      
                        {monthlySpending.map(([month, amount]) => (
                            <div
                                key={month}
                                className="flex flex-1 flex-col items-center gap-2"
                            >
                                                      
                                <div
                                    className="w-[30px] bg-[var(--accent-blue)] rounded-t-md transition-all duration-300 ease-in-out"
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
                                                      
                                <span className="text-[var(--text-secondary)] text-sm">
                                    {month}
                                </span>
                                                  
                            </div>
                        ))}
                                  
                    </div>
                          
                </div>
                  
            </div>
              
            <div className="bg-[var(--text-light)] rounded-xl p-6 shadow-md">
                      
                <h3 className="text-[var(--text-primary)] text-xl mb-6">
                    Key Insights
                </h3>
                      
                <div className="grid grid-cols-2 gap-6">
                              
                    <div className="bg-[var(--light-blue)] rounded-lg p-5">
                                      
                        <h4 className="text-[var(--text-primary)] text-base mb-3">
                            Highest Spending Category
                        </h4>
                                      
                        {getMaxSpendingCategory() && (
                            <p>
                                                      
                                <strong className="text-[var(--text-primary)]">
                                    {getMaxSpendingCategory()[0]}
                                </strong>{" "}
                                at ${getMaxSpendingCategory()[1].toFixed(2)}       
                                          
                            </p>
                        )}
                                  
                    </div>
                              
                    <div className="text-[var(--text-secondary)] text-[1.1rem]">
                                                    <h4>Savings Rate</h4>              
                        <p>
                                              
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
                       {" "}
        </div>
    );
}
