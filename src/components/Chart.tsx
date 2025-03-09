import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Chart.js 필수 요소 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// 데이터 타입 정의
type EmployeesData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
};

// 샘플 데이터
const data: EmployeesData = {
  labels: ["Engineering", "Marketing", "Sales", "HR", "Finance"],
  datasets: [
    {
      label: "Employees",
      data: [40, 25, 30, 15, 20],
      backgroundColor: "rgba(75, 192, 192, 0.6)",
    },
  ],
};

// ✅ 차트 옵션 타입을 명확하게 지정 (Bar 차트에 맞게 설정)
const options: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: { display: true, text: "부서별 인원 수" },
  },
  scales: {
    x: { type: "category" }, // X축은 범주형 (CategoryScale)
    y: { type: "linear", beginAtZero: true }, // Y축은 연속형 (LinearScale)
  },
};

export function EmployeesBarChart() {
  return <Bar data={data} options={options} />;
}
