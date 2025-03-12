import { useState, useEffect } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { useGetAnnualStatistics, useGetMonthlyCategoryStatistics, useGetMonthlyDailyStatistics } from "@/lib/react-query/queriesAndMutations";

interface AnnualStatistics {
  expensesPerMonth: { [month: string]: number };
}

interface MonthlyCategoryStatistics {
  expensesByCategory: { [category: string]: number };
}

interface MonthlyDailyStatistics {
  expensesByDay: { [day: string]: number };
}

interface Statistics {
  annualStatistics: AnnualStatistics | null;
  monthlyCategoryStatistics: MonthlyCategoryStatistics | null;
  monthlyDailyStatistics: MonthlyDailyStatistics | null;
}

const transformDataForMuiPieChart = (data: {}, type: string) => {
  return Object.entries(data).map(([label, value], index) => {
    const numericValue = typeof value === 'number' ? value : Number(value);
    if (isNaN(numericValue)) {
      console.warn(`Value for label "${label}" is not a number. Defaulting to 0.`);
      return {
        id: index,
        value: 0,
        label: type === 'month' ? getMonthName(label) : getCategoryName(label),
      };
    }
    return {
      id: index,
      value: numericValue,
      label: type === 'month' ? getMonthName(label) : getCategoryName(label),
    };
  });
};

const getMonthName = (monthNumber: string) => {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return monthNames[parseInt(monthNumber, 10) - 1];
};

const getCategoryName = (categoryNumber: string) => {
  const categories = [
    "Groceries",
    "Household Items",
    "Personal Care",
    "Electronics",
    "Clothing and Accessories",
    "Baby Products",
    "Alcohol and Tobacco",
    "Books and Stationery",
    "Health and Wellness",
    "Other"
  ];
  return categories[parseInt(categoryNumber, 10)];
};

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

const transformDataForFullMonth = (data: { [x: string]: any; }, totalDays: number) => {
  const fullMonthData = Array.from({ length: totalDays }, (_, index) => {
    const day = (index + 1).toString();
    return {
      label: day,
      value: data[day] || 0,
    };
  });
  return fullMonthData;
};

const Home = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() zwraca miesiące od 0 do 11

  const [yearAnnual, setYearAnnual] = useState<number>(currentYear);
  const [monthCategory, setMonthCategory] = useState<{ year: number; month: number }>({
      year: currentYear,
      month: currentMonth,
  });
  const [monthDaily, setMonthDaily] = useState<{ year: number; month: number }>({
      year: currentYear,
      month: currentMonth,
  });
  const [statistics, setStatistics] = useState<Statistics>({
    annualStatistics: null,
    monthlyCategoryStatistics: null,
    monthlyDailyStatistics: null,
  });

  const { data: annualStatistics, isLoading: isLoadingAnnual } = useGetAnnualStatistics(yearAnnual);
  const { data: monthlyCategoryStatistics, isLoading: isLoadingMonthlyCategory } = useGetMonthlyCategoryStatistics(monthCategory.year, monthCategory.month);
  const { data: monthlyDailyStatistics, isLoading: isLoadingMonthlyDaily } = useGetMonthlyDailyStatistics(monthDaily.year, monthDaily.month);

  useEffect(() => {
    if (!isLoadingAnnual && annualStatistics) {
      setStatistics((prev) => ({ ...prev, annualStatistics }));
    }
  }, [annualStatistics, isLoadingAnnual]);

  useEffect(() => {
    if (!isLoadingMonthlyCategory && monthlyCategoryStatistics) {
      setStatistics((prev) => ({ ...prev, monthlyCategoryStatistics }));
    }
  }, [monthlyCategoryStatistics, isLoadingMonthlyCategory]);

  useEffect(() => {
    if (!isLoadingMonthlyDaily && monthlyDailyStatistics) {
      setStatistics((prev) => ({ ...prev, monthlyDailyStatistics }));
    }
  }, [monthlyDailyStatistics, isLoadingMonthlyDaily]);

  if (isLoadingAnnual || isLoadingMonthlyCategory || isLoadingMonthlyDaily) {
    return <div>Loading...</div>;
  }

  const expensesPerMonth = statistics.annualStatistics?.expensesPerMonth || {};
  const expensesByCategory = statistics.monthlyCategoryStatistics?.expensesByCategory || {};
  const expensesByDay = statistics.monthlyDailyStatistics?.expensesByDay || {};

  const annualDataMui = transformDataForMuiPieChart(expensesPerMonth, 'month');
  const monthlyCategoryDataMui = transformDataForMuiPieChart(expensesByCategory, 'category');

  const totalDaysInMonth = getDaysInMonth(monthDaily.year, monthDaily.month);
  const fullMonthData = transformDataForFullMonth(expensesByDay, totalDaysInMonth);

  const xAxisLabels = fullMonthData.map((item) => item.label);
  const seriesData = fullMonthData.map((item) => item.value);

  return (
    <div className="text-white">


      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', marginLeft: '40px' }}>
          <label htmlFor="yearAnnualPicker" style={{ marginRight: '10px' }}>Year for Annual Statistics: </label>
          <input
            id="yearAnnualPicker"
            type="number"
            value={yearAnnual}
            onChange={(e) => setYearAnnual(parseInt(e.target.value, 10))}
            min="1900"
            max="2050"
            style={{ padding: '5px', fontSize: '16px', color: 'black' }}
          />
        </div>
        <div style={{ width: '400px', height: '500px', margin: '0 auto' }}>
          <PieChart
            series={[
              {
                data: annualDataMui,
                outerRadius: 150,
              },
            ]}
            width={400}
            height={500}
            legend={{ position: { vertical: 'bottom', horizontal: 'middle' }, direction: 'row', labelStyle: { fill: 'white' } }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', marginLeft: '40px' }}>
          <label htmlFor="monthCategoryPicker" style={{ marginRight: '10px' }}>Month for Category Statistics: </label>
          <input
            id="monthCategoryPicker"
            type="month"
            value={`${monthCategory.year}-${String(monthCategory.month).padStart(2, '0')}`}
            onChange={(e) => {
              const [year, month] = e.target.value.split("-");
              setMonthCategory({ year: parseInt(year, 10), month: parseInt(month, 10) });
            }}
            style={{ padding: '5px', fontSize: '16px', color: 'black' }}
          />
        </div>
        <div style={{ width: '400px', height: '500px', margin: '0 auto' }}>

          <PieChart
            series={[
              {
                data: monthlyCategoryDataMui,
                outerRadius: 150,
              },
            ]}
            width={400}
            height={500}
            legend={{ position: { vertical: 'bottom', horizontal: 'middle' }, direction: 'row', labelStyle: { fill: 'white' } }}
          />
        </div>
      </div>

      <div style={{ width: '600px', height: '400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
          <label htmlFor="monthDailyPicker" style={{ marginRight: '10px' }}>Month for Daily Statistics: </label>
          <input
            id="monthDailyPicker"
            type="month"
            value={`${monthDaily.year}-${String(monthDaily.month).padStart(2, '0')}`}
            onChange={(e) => {
              const [year, month] = e.target.value.split("-");
              setMonthDaily({ year: parseInt(year, 10), month: parseInt(month, 10) });
            }}
            style={{ padding: '5px', fontSize: '16px', color: 'black' }}
          />
        </div>
        <BarChart
          xAxis={[
            {
              scaleType: 'band',
              data: xAxisLabels,
              label: 'Day',
              labelStyle: { fill: 'white' },
            },
          ]}
          series={[
            {
              data: seriesData,
              label: 'Expenses',
            },
          ]}
          width={700}
          height={500}
          legend={{ labelStyle: { fill: 'white' } }}
          sx={{
            "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
              strokeWidth: "1",
              fill: "white"
            },
            "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
              strokeWidth: "1",
              fill: "white"
            },
            "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
              stroke: "white",
              strokeWidth: 1
            },
            "& .MuiChartsAxis-left .MuiChartsAxis-line": {
              stroke: "white",
              strokeWidth: 1
            }
          }}
        />
      </div>
    </div>
  );
};

export default Home;
