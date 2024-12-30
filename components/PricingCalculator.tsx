'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { calculateSellingPrice, calculateBulkPrice, formatCurrency, PricingTier } from '../utils/calculations'

export default function PricingCalculator() {
  const [baseCost, setBaseCost] = useState(10)
  const [profitMargin, setProfitMargin] = useState(30)
  const [operationalCosts, setOperationalCosts] = useState(15)
  const [isOperationalCostsPercentage, setIsOperationalCostsPercentage] = useState(true)
  const [creditCardFee, setCreditCardFee] = useState(2.9)
  const [seasonalDiscount, setSeasonalDiscount] = useState(0)
  const [taxRate, setTaxRate] = useState(8.25)
  const [applySeasonalDiscount, setApplySeasonalDiscount] = useState(false)
  const [bulkPricingTiers, setBulkPricingTiers] = useState<PricingTier[]>([
    { quantity: 10, discount: 5 },
    { quantity: 50, discount: 10 },
    { quantity: 100, discount: 15 },
  ])

  const baseSellingPrice = calculateSellingPrice(
    baseCost,
    profitMargin,
    operationalCosts,
    isOperationalCostsPercentage,
    creditCardFee,
    applySeasonalDiscount ? seasonalDiscount : 0,
    taxRate
  )

  const handleBulkTierChange = (index: number, field: 'quantity' | 'discount', value: number) => {
    const newTiers = [...bulkPricingTiers]
    newTiers[index][field] = value
    setBulkPricingTiers(newTiers)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <Image
            src="/logo_green.svg"
            alt="Logo"
            width={40}
            height={40}
            className="dark:invert justify-self-center"
          />
          <CardTitle className='text-gray-800'>Simule o valor ideal do produto</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="baseCost">Custo base (R$)</Label>
              <Input
                id="baseCost"
                type="number"
                value={baseCost}
                onChange={(e) => setBaseCost(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="profitMargin">Margem de Lucro Desejada (%)</Label>
              <Input
                id="profitMargin"
                type="number"
                value={profitMargin}
                onChange={(e) => setProfitMargin(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="operationalCosts">
                Custos Operacionais ({isOperationalCostsPercentage ? '%' : 'R$'})
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="operationalCosts"
                  type="number"
                  value={operationalCosts}
                  onChange={(e) => setOperationalCosts(Number(e.target.value))}
                />
                <Switch
                  checked={isOperationalCostsPercentage}
                  onCheckedChange={setIsOperationalCostsPercentage}
                />
                <span className="text-sm">{isOperationalCostsPercentage ? '%' : 'R$'}</span>
              </div>
            </div>
            <div>
              <Label htmlFor="creditCardFee">Taxa de Cartão de Crédito (%)</Label>
              <Input
                id="creditCardFee"
                type="number"
                value={creditCardFee}
                onChange={(e) => setCreditCardFee(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="taxRate">Taxa de imposto (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="seasonalDiscount">Desconto Sazonal (%)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="seasonalDiscount"
                  type="number"
                  value={seasonalDiscount}
                  onChange={(e) => setSeasonalDiscount(Number(e.target.value))}
                  disabled={!applySeasonalDiscount}
                />
                <Switch
                  checked={applySeasonalDiscount}
                  onCheckedChange={setApplySeasonalDiscount}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Níveis de Preço para venda em lote</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Desconto (%)</TableHead>
                  <TableHead>Preço</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bulkPricingTiers.map((tier, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        type="number"
                        value={tier.quantity}
                        onChange={(e) => handleBulkTierChange(index, 'quantity', Number(e.target.value))}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={tier.discount}
                        onChange={(e) => handleBulkTierChange(index, 'discount', Number(e.target.value))}
                      />
                    </TableCell>
                    <TableCell>
                      {formatCurrency(calculateBulkPrice(baseSellingPrice, tier.quantity, bulkPricingTiers))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              onClick={() => setBulkPricingTiers([...bulkPricingTiers, { quantity: 0, discount: 0 }])}
              className="mt-2"
            >
              Adicionar Nível
            </Button>
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-semibold">Resultados</h3>
            <p className="text-lg">
              Seu preço base de venda é: <strong>{formatCurrency(baseSellingPrice)}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Lucro: {formatCurrency(baseSellingPrice - baseCost)} ({((baseSellingPrice - baseCost) / baseSellingPrice * 100).toFixed(2)}%)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

