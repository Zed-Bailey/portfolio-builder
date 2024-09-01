import { InvestmentEtf } from "~/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { formatNumber, formatMoney } from "accounting-js";
import { useState } from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { percentageOf } from "~/lib/utils";

export const AssetCard = ({ etf, investmentAmount, setField, onDelete }: {
    etf: InvestmentEtf,
    investmentAmount: number; setField: (key: string, value: any) => void, onDelete: () => void
}) => {

    const updateUnits = (value: string) => {
        let pct = Number.parseInt(value);
        if (!isNaN(pct) && etf.price) {
            pct /= 100;
            const pctUnits = (investmentAmount * pct) / etf.price;
            setField("units", pctUnits);
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-row items-center justify-between">
                    <CardTitle>
                        <Input value={etf.name} onChange={(e) => setField("name", e.target.value)} />
                    </CardTitle>
                    <Button className="hover:text-red-600" variant={"outline"} size={"icon"} onClick={onDelete}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent >
                <div className="flex flex-row flex-wrap items-center gap-2">
                    <div className="flex gap-1 items-center">
                        <p>I have</p>
                        <Input className="w-[150px] text-center" value={etf.units?.toFixed(2)} onChange={(e) => {
                            if (!isNaN(Number.parseFloat(e.target.value))) {
                                setField("units", Number.parseFloat(e.target.value))
                            }
                        }} />
                        <p>units</p>
                    </div>

                    <div className="flex gap-1 items-center">
                        <p>at price</p>
                        <Input className="w-[150px] text-center" value={etf.price} onChange={(e) => {
                            if (!isNaN(Number.parseFloat(e.target.value))) {
                                setField("price", Number.parseFloat(e.target.value))
                            }
                        }} />

                    </div>

                    <div className="flex gap-1 items-center">
                        <p>and a CPU of</p>
                        <Input className="w-[150px] text-center" value={etf.cpu} onChange={(e) => {
                            if (!isNaN(Number.parseFloat(e.target.value))) {
                                setField("cpu", Number.parseFloat(e.target.value))
                            }
                        }} />

                    </div>

                    <div className="flex flex-row flex-1 gap-1 items-center w-full">
                        <p className="min-w-fit"> with a </p>
                        <Select value={etf.distributionFrequencey} onValueChange={(e) => setField("distributionFrequencey", e)}>
                            <SelectTrigger >
                                <SelectValue placeholder="Distribution Frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="min-w-fit">distribution frequency</p>
                    </div>
                </div>

            </CardContent>

            <CardFooter>
                <CardDescription className="flex flex-row items-center gap-1">
                    {etf.units && etf.price ? <p className="min-w-fit">Total asset value: {formatMoney(etf.units * etf.price)} or </p> : null}
                    <Input className="w-20" defaultValue={percentageOf(((etf.units ?? 0) * (etf.price ?? 0)), investmentAmount)} onChange={(e) => updateUnits(e.target.value)} />
                    <p>% of investment</p>
                </CardDescription>
            </CardFooter>
        </Card>
    );
}