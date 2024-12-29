import type { Route } from "./+types/home";
import LatexConverter from '~/components/LatexConverter';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Latex to Typst equation converter" },
    { name: "description", content: "Welcome to Latex to Typst equation converter!!" },
  ];
}

export default function Home() {
  return <LatexConverter />;
}
