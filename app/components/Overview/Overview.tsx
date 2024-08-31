import { Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "../ui/chart"
import { InvestmentEtf } from "~/types"
import { useMemo } from "react"
import { formatMoney, formatNumber } from 'accounting-js';


export const Overview = ({ etfs, investmentAmount }: { etfs: InvestmentEtf[], investmentAmount: number }) => {
    const totalAssetValue = useMemo(() => {
        return etfs.map((a) => {
            if (a.price && a.units) {
                return a.price * a.units;
            }
            return 0
        }).reduce((a, b) => a + b, 0);
    }, [etfs]);

    const { monthlyDistribution, quarterlyDistribution } = useMemo(() => {
        const m = etfs.map((a) => {
            if (a.price && a.units && a.cpu && a.distributionFrequencey === "monthly") {
                return a.units * (a.cpu / 100);
            }
            return 0
        }).reduce((a, b) => a + b, 0);

        const q = etfs.map((a) => {
            if (a.price && a.units && a.cpu && a.distributionFrequencey === "quarterly") {
                return a.units * (a.cpu / 100);
            }
            return 0
        }).reduce((a, b) => a + b, 0);

        return {
            monthlyDistribution: m,
            quarterlyDistribution: q
        }
    }, [etfs]);

    const allocationPct = useMemo(() => {
        return (totalAssetValue / investmentAmount) * 100;
    }, [totalAssetValue, investmentAmount]);

    return (
        <div className="flex flex-row items-center gap-4 justify-center mt-10">
            <div className="self-start">
                <AllocationChart etfs={etfs} />
            </div>


            <div className="flex flex-col h-full w-full max-w-screen-sm justify-start self-start gap-4">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Total value of assets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-thin">{formatMoney(totalAssetValue)}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Portfolio %</CardTitle>
                        <CardDescription>Percentage of portfolio that has been allocated</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {<p className={`text-4xl font-thin ${allocationPct > 100 ? 'text-red-500 font-bold' : 'text-green-500'}`}>{formatNumber(isNaN(allocationPct) ? 0 : allocationPct)}%</p>}
                    </CardContent>
                    <CardFooter>
                        {
                            100 - allocationPct >= 0 ?
                                <CardDescription>
                                    Remaining {formatNumber(100 - allocationPct)}% to allocate or {formatMoney(investmentAmount - totalAssetValue)}
                                </CardDescription>
                                : null
                        }
                    </CardFooter>
                </Card>

                <div className="flex flex-row items-center justify-start w-full h-32 gap-4">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Quarterly Distributions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-thin">{formatMoney(quarterlyDistribution)}</p>
                        </CardContent>
                    </Card>
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Monthly Distributions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-thin">{formatMoney(monthlyDistribution)}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    );
}


const AllocationChart = ({ etfs }: { etfs: InvestmentEtf[] }) => {
    const cData = etfs.map((e) => ({
        asset: e.name,
        allocation: e.price && e.units ? Number((e.price * e.units).toFixed(2)) : '0',
        fill: `var(--color-${e.name})` // TODO: kebab case name
    }));

    const chartConfig = {
        allocation: {
            label: "Allocation",
        },
    } satisfies ChartConfig

    cData.forEach((d, index) => {
        chartConfig[d.asset] = {
            label: d.asset,
            color: `hsl(var(--chart-${(index % 5 + index) + 1}))`
        }
    })

    return (
        <Card className="flex flex-col w-[400px] h-96">
            <CardHeader className="items-center pb-0">
                <CardTitle>Investment Allocation</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square  pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                >
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={cData} dataKey="allocation" label nameKey="asset" />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}