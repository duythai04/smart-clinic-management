export interface Patient {
  id: string;
  name: string;
  gender: "Nam" | "Nữ";
  birthDate: string;
  phone: string;
  address: string;
  status: "Đang khám" | "Chờ khám" | "Hoàn thành";
}

export const patients: Patient[] = [
  {
    id: "BN0001",
    name: "Nguyễn Văn An",
    gender: "Nam",
    birthDate: "1995-05-12",
    phone: "0981234567",
    address: "Hà Nội",
    status: "Đang khám",
  },
  {
    id: "BN0002",
    name: "Trần Thị Bình",
    gender: "Nữ",
    birthDate: "1998-08-21",
    phone: "0972345678",
    address: "Hà Nội",
    status: "Chờ khám",
  },
  {
    id: "BN0003",
    name: "Lê Văn Cường",
    gender: "Nam",
    birthDate: "1987-03-14",
    phone: "0963456789",
    address: "Bắc Ninh",
    status: "Hoàn thành",
  },
  {
    id: "BN0004",
    name: "Phạm Thị Dung",
    gender: "Nữ",
    birthDate: "2000-11-05",
    phone: "0914567890",
    address: "Hưng Yên",
    status: "Chờ khám",
  },
];

export const revenueData = [
  { name: "T2", revenue: 12000000 },
  { name: "T3", revenue: 18500000 },
  { name: "T4", revenue: 15000000 },
  { name: "T5", revenue: 22000000 },
  { name: "T6", revenue: 19500000 },
  { name: "T7", revenue: 28500000 },
  { name: "CN", revenue: 17000000 },
];

export const appointments = [
  {
    id: "LH001",
    patient: "Nguyễn Văn An",
    doctor: "BS. Trần Minh Đức",
    department: "Nội tổng quát",
    time: "08:00",
    status: "Đang khám",
  },
  {
    id: "LH002",
    patient: "Trần Thị Bình",
    doctor: "BS. Nguyễn Thu Hà",
    department: "Tai Mũi Họng",
    time: "08:30",
    status: "Chờ khám",
  },
  {
    id: "LH003",
    patient: "Lê Văn Cường",
    doctor: "BS. Phạm Quốc Huy",
    department: "Tim mạch",
    time: "09:00",
    status: "Hoàn thành",
  },
];
