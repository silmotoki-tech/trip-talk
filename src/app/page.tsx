import { loadScripts } from "@/lib/load-scripts";
import TripTalk from "@/components/trip-talk";
export default function Home() {
  return <TripTalk scripts={loadScripts()} />;
}
