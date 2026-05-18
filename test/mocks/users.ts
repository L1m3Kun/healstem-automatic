import type { User } from "@/types";

export const MockUsers: User[] = [
  {
    id: 1,
    name: "홍길동",
    gender: "남",
    phone: "010-1***-5678",
    membership: "1개월권",
    restTicket: 0,
    monthlyMemebershipStart: "2025-01-01T00:00:00.000Z",
    monthlyMemebershipEnd: "2027-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "김영희",
    gender: "여",
    phone: "010-2***-5678",
    membership: "1개월권",
    restTicket: 0,
    monthlyMemebershipStart: "2025-01-01T00:00:00.000Z",
    monthlyMemebershipEnd: "2027-01-01T00:00:00.000Z",
  },
  {
    id: 3,
    name: "이영희",
    gender: "여",
    phone: "010-1***-9999",
    membership: "6개월권",
    restTicket: 0,
    monthlyMemebershipStart: "2025-01-01T00:00:00.000Z",
    monthlyMemebershipEnd: "2027-07-01T00:00:00.000Z",
  },
];
