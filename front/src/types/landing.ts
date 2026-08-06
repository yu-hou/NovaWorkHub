export type FeedbackItem = {
  quote: string;
  author: string;
};

export type LoopStep = {
  index: string;
  title: string;
  description: string;
  icon: "course" | "live" | "trophy";
};

export type SupportItem = {
  label: string;
  title: string;
  description: string;
  icon: "chat" | "folder" | "pin";
  featured?: boolean;
};

export type BenefitRow =
  | { kind: "group"; label: string }
  | { kind: "row"; feature: string; free: string; annual: string };

export type Founder = {
  name: string;
  photo: string;
  photoAlt: string;
  tone: "blue" | "orange";
  roles: string[];
};

export type Partner = {
  name: string;
  logo: string;
};
