import type { MetaFunction } from "@remix-run/node";
import React, { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import { formatMoney } from "accounting-js";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { InvestmentEtf } from "~/types";
import AssetCard from "~/components/AssetCard";
import { useFormInput, useSelectInput } from "~/lib/utils";
import Overview from "~/components/Overview";
import { useToast } from "~/hooks/use-toast";
import { v4 } from "uuid";

export const meta: MetaFunction = () => {
  return [
    { title: "Zeds Portfolio Builder" },
  ];
};

const Index = () => {
  const [total, setTotal] = useState<number>();
  const [savedAssets, setSavedAssets] = useState<InvestmentEtf[]>([]);
  const { toast } = useToast();

  const addAssets = (asset: InvestmentEtf) => {
    setSavedAssets((prev) => [...prev, asset])
  }

  const updateAsset = (key: string, value: unknown, id: string) => {
    setSavedAssets((prev) => ([
      ...prev.map((a) => {
        if (a.uuid !== id) return a;
        return {
          ...a,
          [key]: value
        }
      })
    ]))
  }

  const removeAsset = (id: string) => {
    setSavedAssets((prev) => ([
      ...prev.filter((a) => a.uuid !== id)
    ]))
  }

  useEffect(() => {
    if (window.localStorage.getItem('savedAssets')) {
      setSavedAssets(JSON.parse(window.localStorage.getItem('savedAssets') ?? '[]'));
    }
    if (window.localStorage.getItem('investmentAmount')) {
      setTotal(Number.parseInt(window.localStorage.getItem('investmentAmount') ?? '0'));
    }

  }, []);

  useEffect(() => {
    const interval = setTimeout(() => {
      window.localStorage.setItem('savedAssets', JSON.stringify(savedAssets));
      toast({
        title: "Saved changes"
      })
    }, 2500);
    return () => clearTimeout(interval);
  }, [savedAssets]);

  useEffect(() => {
    if (total) {
      window.localStorage.setItem("investmentAmount", `${total}`);

    }
  }, [total])


  return (
    <div className="font-sans p-4">
      <Input type="text" placeholder="Total investment amount"
        onChange={(e) => {
          if (isNaN(Number(e.target.value))) {
            setTotal(0)
          } else {
            setTotal(Number(e.target.value))
          }
        }} />

      <div className="flex w-full justify-center mt-5 items-end">
        <p className=" mr-3 font-semibold">I want to invest</p>
        <p className="text-4xl font-thin">{formatMoney(total ?? 0)}</p>
      </div>


      <h2 className="text-3xl">My Investments</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl::grid-cols-3 gap-4 my-6">
        {
          savedAssets.map((asset) => (
            <AssetCard key={asset.uuid}
              etf={asset}
              investmentAmount={total ?? 0}
              setField={(k, v) => updateAsset(k, v, asset.uuid)}
              onDelete={() => removeAsset(asset.uuid)}
            />))
        }
      </div>

      <AddInvestment onAdd={addAssets}>
        <Button>Add New investment</Button>
      </AddInvestment>

      <div className="my-10">
        <h2 className="text-3xl">Portfolio Overview</h2>
        <Overview etfs={savedAssets} investmentAmount={total ?? 0} />
      </div>

    </div>
  );
}



const AddInvestment = ({ onAdd, children }: { onAdd: (investment: InvestmentEtf) => void } & React.PropsWithChildren) => {

  const nameProps = useFormInput("");
  const distributionProps = useSelectInput("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(
      nameProps.value !== ""
      && distributionProps.value !== ""
    )
  }, [nameProps, distributionProps])



  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          Add new Asset
        </DialogHeader>
        <div className="flex flex-col space-y-3">
          <label>
            Asset Name
            <Input {...nameProps} />
          </label>

          <label>
            Distribution frequency
            <Select {...distributionProps}>
              <SelectTrigger >
                <SelectValue placeholder="Distribution Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </div>

        <DialogFooter>
          <div className="flex items-center space-x-3">
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
            <DialogClose asChild disabled={!isValid}>
              <Button disabled={!isValid} variant="default" onClick={() => onAdd({
                name: nameProps.value,
                distributionFrequencey: distributionProps.value,
                uuid: v4(),
              })}>Add</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Index;