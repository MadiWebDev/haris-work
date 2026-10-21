import type { Metadata } from "next";
import Landing from "./Landing";

export const metadata: Metadata = {
  title: "HarisPortfolio — MineConnect Platform",
  description:
    "Portfolio of Haris — full-stack developer and digital coordinator who built the MineConnect nonprofit technology ecosystem for Canada's mining community.",
};

export default function Home() {
  return <Landing />;
}