export type UserInput = {
  name: string;
  phone: string;
};

export type User = {
  id: number;
  name: string;
  gender: "남" | "여";
  phone: string;
  membership: "회권" | "1개월권" | "3개월권" | "6개월권";
  restTicket: number;
  monthlyMemebershipStart: string;
  monthlyMemebershipEnd: string;
};
