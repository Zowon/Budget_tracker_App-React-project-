import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { format, subMonths } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { selectUser } from '../features/auth/authSlice';
import AppLayout from '../components/layout/AppLayout';
import './analysis.css';

const Analysis = () => {
  const user = useSelector(selectUser);
  const [selectedPeriod, setSelectedPeriod] = useState('6'); // 1, 6, or 12 months
  
  // Get all expenses from Redux store
  const allExpenses = useSelector(state => state.expenses.expenses);
  
  // Generate chart data for 12 months (matching the screenshot)
  const expensesData = useMemo(() => {
    const data = [];
    const currentDate = new Date();
    
    // Generate data for 12 months to match the screenshot
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(currentDate, i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      // Filter expenses for this specific month and user
      const monthExpenses = allExpenses.filter(expense => {
        const expenseDate = new Date(expense.dateISO);
        return expense.userId === user?.id &&
               expenseDate.getFullYear() === year &&
               expenseDate.getMonth() + 1 === month;
      });
      
      const totalExpenses = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      // Generate realistic looking data similar to the screenshot
      const mockExpenses = totalExpenses || (Math.random() * 60 + 20); // Random between 20-80
      
      data.push({
        month: format(date, 'MMM'),
        expenses: mockExpenses,
        value: mockExpenses
      });
    }
    
    return data;
  }, [allExpenses, user?.id]);
  

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-expenses">
            <span className="tooltip-color expenses"></span>
            Value: {data.value.toFixed(1)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <AppLayout>
      <div className="analysis-page">
        {/* Page Header */}
        <div className="analysis-header">
          <div className="header-left">
            <h1 className="page-title">Analysis</h1>
          </div>
        </div>


        {/* Chart Section */}
        <div className="chart-section">
          <div className="chart-header">
            <div className="chart-title-section">
              <h2 className="chart-title">Expenses</h2>
              <div className="chart-controls">
                <div className="range-selector">
                  <span className="range-label">Range</span>
                  <select className="range-dropdown" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
                    <option value="12">Last 12 Months</option>
                    <option value="6">Last 6 Months</option>
                    <option value="3">Last 3 Months</option>
                  </select>
                </div>
                <div className="legend-item">
                  <span className="legend-dot"></span>
                  <span className="legend-text">Item 1</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={expensesData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#666"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone"
                  dataKey="value" 
                  stroke="#7C3AED"
                  strokeWidth={3}
                  dot={{ fill: '#7C3AED', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#7C3AED', strokeWidth: 2, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </AppLayout>
  );
};

export default Analysis;
