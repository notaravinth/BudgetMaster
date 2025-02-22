import React from "react";

const Home = () => {
    return (
		<main className="bg-gold-1 bg-cover bg-center bg-no-repeat h-screen">
			<div className= "px-8 py-4 max-w-screen-xl mx-auto">
				<section className="text-center px-4 py-12 mb-12 bg-gold-2 rounded-[15px] shadow-md">
					<h1 className="text-[2.5rem] font-bold text-black-3 mb-4">Welcome to Your Personal Budget Tracker</h1>
					<p className="text-[1.2rem] font-medium text-black-3 max-w-[600px] mx-auto leading-[1.6]">
						Take control of your finances with easy expense tracking, budget planning, and insightful reports.
					</p>
				</section>

				<div className="grid grid-cols-auto-fit-250 gap-8 p-4">
					<div className="bg-gold-4 p-6 rounded-[10px] shadow-md transition-transform duration-200 ease-in-out hover:-translate-y-1">
						<h2 className="text-black-2 text-[1.25rem] mb-2">Track Transactions</h2>
						<p className="text-slate-800 leading-[1.5]">Record and categorize your income and expenses easily.</p>
					</div>
					<div className="bg-gold-4 p-6 rounded-[10px] shadow-md transition-transform duration-200 ease-in-out hover:-translate-y-1">
						<h2 className="text-black-2 text-[1.25rem] mb-2">Set Savings Goals</h2>
						<p className="text-slate-800 leading-[1.5]">Add and manage savings for different categories.</p>
					</div>
					<div className="bg-gold-4 p-6 rounded-[10px] shadow-md transition-transform duration-200 ease-in-out hover:-translate-y-1">
						<h2 className="text-black-2 text-[1.25rem] mb-2">Set Budgets</h2>
						<p className="text-slate-800 leading-[1.5]">Create and manage budgets for different categories.</p>
					</div>
					<div className="bg-gold-4 p-6 rounded-[10px] shadow-md transition-transform duration-200 ease-in-out hover:-translate-y-1">
						<h2 className="text-black-2 text-[1.25rem] mb-2">View Reports</h2>
						<p className="text-slate-800 leading-[1.5]">Analyze your spending patterns with detailed reports and charts.</p>
					</div>
				</div>
			</div>
    	</main>
	);
};

export default Home;
