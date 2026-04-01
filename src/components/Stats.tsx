import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/line-chart";
import { Badge } from "./ui/badge";
import { TrendingUp } from "lucide-react";

const listingGrowthData = [
  { week: "Week 1", listings: 120 },
  { week: "Week 2", listings: 250 },
  { week: "Week 3", listings: 480 },
  { week: "Week 4", listings: 850 },
];

const recoveryRateData = [
  { week: "Week 1", rate: 65 },
  { week: "Week 2", rate: 72 },
  { week: "Week 3", rate: 85 },
  { week: "Week 4", rate: 95 },
];

const listingGrowthConfig = {
  listings: {
    label: "New Listings",
    color: "#FF4D4D",
  },
} satisfies ChartConfig;

const recoveryRateConfig = {
  rate: {
    label: "Recovery Rate (%)",
    color: "#00D4FF",
  },
} satisfies ChartConfig;

export default function Stats() {
  const stats = [
    { label: "Marketplace", value: "10,000+", description: "Items listed by students this semester." },
    { label: "Recovery", value: "95%", description: "Success rate for lost items reported on campus." },
    { label: "Trust", value: "100%", description: "Verified student network with secure meetups." },
    { label: "Matching", value: "24/7", description: "AI-powered matching for lost & found items." },
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full glass border-white/10 text-[12px] font-medium text-white/50 mb-6 uppercase tracking-wider">
            ● Our Impact
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight">Campus Connectivity in Numbers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="glass p-8 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden animate-on-scroll"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="text-[12px] text-white/40 mb-2 uppercase tracking-widest">{stat.label}</div>
              <div className="text-5xl font-bold mb-4">{stat.value}</div>
              <p className="text-[13px] text-white/40 leading-relaxed">{stat.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-on-scroll">
          <Card className="glass border-white/10 rounded-[2rem] overflow-hidden relative">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Listing Growth</span>
                <Badge variant="outline" className="text-emerald-400 bg-emerald-400/10 border-none">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>42% Increase</span>
                </Badge>
              </CardTitle>
              <CardDescription className="text-white/40">Marketplace activity over the last 4 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={listingGrowthConfig}>
                <LineChart
                  accessibilityLayer
                  data={listingGrowthData}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="week"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: 'rgba(255,255,255,0.4)' }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey="listings"
                    type="monotone"
                    stroke="var(--color-listings)"
                    strokeWidth={3}
                    dot={true}
                    className="animate-dash-line"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="glass border-white/10 rounded-[2rem] overflow-hidden relative">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recovery Success</span>
                <Badge variant="outline" className="text-blue-400 bg-blue-400/10 border-none">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>15% Increase</span>
                </Badge>
              </CardTitle>
              <CardDescription className="text-white/40">Lost & Found efficiency over the last 4 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={recoveryRateConfig}>
                <LineChart
                  accessibilityLayer
                  data={recoveryRateData}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="week"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: 'rgba(255,255,255,0.4)' }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey="rate"
                    type="monotone"
                    stroke="var(--color-rate)"
                    strokeWidth={3}
                    dot={true}
                    className="animate-dash-line"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
