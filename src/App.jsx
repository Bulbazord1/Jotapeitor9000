import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const formatNumber = (value) =>
  new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(parseFloat(value));

export default function CalculadoraCostos() {
  const [fob, setFob] = useState(0);
  const [flete, setFlete] = useState(0);
  const [tipoCambio, setTipoCambio] = useState(1150);
  const [margenDeseado, setMargenDeseado] = useState(30);
  const [ventaManual, setVentaManual] = useState(0);
  const [resultado, setResultado] = useState(null);

  const calcular = () => {
    const seguro = (fob + flete) * 0.01;
    const valorAduana = fob + flete + seguro;
    const derechos = valorAduana * 0.18;
    const tasa = valorAduana * 0.03;
    const baseIVA = valorAduana + derechos + tasa;
    const iva = baseIVA * 0.21;
    const ivaAdic = baseIVA * 0.20;
    const ganancias = baseIVA * 0.06;
    const iibb = baseIVA * 0.025;
    const tasaSim = 10;
    const totalAduanaUSD = derechos + tasa + iva + ivaAdic + ganancias + iibb + tasaSim;
    const totalAduanaARS = totalAduanaUSD * tipoCambio;

    const deposito = 1300;
    const honorarios = 300;
    const gastosOperativos = 250;
    const acarreo = 250;
    const forwarder = 1100;
    const depositoIVA = deposito * 1.21;
    const honorariosIVA = honorarios * 1.21;
    const operativosIVA = gastosOperativos * 1.21;
    const acarreoIVA = acarreo * 1.21;
    const forwarderIVA = forwarder * 1.21;

    const totalDespachoUSD = fob + flete + depositoIVA + honorariosIVA + operativosIVA + acarreoIVA + forwarderIVA;
    const totalDespachoARS = totalDespachoUSD * tipoCambio;
    const cashflowTotalUSD = totalAduanaUSD + totalDespachoUSD;
    const cashflowTotalARS = cashflowTotalUSD * tipoCambio;

    setResultado((prev) => {
      const utilidad = calcularUtilidad(cashflowTotalUSD);
      return {
        derechos: { usd: formatNumber(derechos), ars: formatNumber(derechos * tipoCambio) },
        tasa: { usd: formatNumber(tasa), ars: formatNumber(tasa * tipoCambio) },
        iva: { usd: formatNumber(iva), ars: formatNumber(iva * tipoCambio) },
        ivaAdic: { usd: formatNumber(ivaAdic), ars: formatNumber(ivaAdic * tipoCambio) },
        ganancias: { usd: formatNumber(ganancias), ars: formatNumber(ganancias * tipoCambio) },
        iibb: { usd: formatNumber(iibb), ars: formatNumber(iibb * tipoCambio) },
        tasaSim: { usd: formatNumber(tasaSim), ars: formatNumber(tasaSim * tipoCambio) },
        totalAduana: { usd: formatNumber(totalAduanaUSD), ars: formatNumber(totalAduanaARS) },
        despacho: {
          fob: { usd: formatNumber(fob), ars: formatNumber(fob * tipoCambio) },
          flete: { usd: formatNumber(flete), ars: formatNumber(flete * tipoCambio) },
          deposito: { usd: formatNumber(depositoIVA), ars: formatNumber(depositoIVA * tipoCambio) },
          honorarios: { usd: formatNumber(honorariosIVA), ars: formatNumber(honorariosIVA * tipoCambio) },
          operativos: { usd: formatNumber(operativosIVA), ars: formatNumber(operativosIVA * tipoCambio) },
          acarreo: { usd: formatNumber(acarreoIVA), ars: formatNumber(acarreoIVA * tipoCambio) },
          forwarder: { usd: formatNumber(forwarderIVA), ars: formatNumber(forwarderIVA * tipoCambio) },
          total: { usd: formatNumber(totalDespachoUSD), ars: formatNumber(totalDespachoARS) }
        },
        cashflow: {
          usd: formatNumber(cashflowTotalUSD),
          ars: formatNumber(cashflowTotalARS)
        },
        utilidad
      };
    });
  };

  const calcularUtilidad = (cashflowUSD) => {
    const ventaSugeridaUSD = cashflowUSD * (1 + margenDeseado / 100);
    const ventaSugeridaARS = ventaSugeridaUSD * tipoCambio;
    const ivaVentaSugerida = ventaSugeridaUSD * 0.21;
    const precioFinalSugerido = ventaSugeridaUSD + ivaVentaSugerida;
    const gananciaBrutaSugerida = ventaSugeridaUSD - cashflowUSD;
    const gananciaNetaSugerida = gananciaBrutaSugerida * 0.698;

    const ventaManualIVA = ventaManual * 1.21;
    const gananciaBrutaManual = ventaManual - cashflowUSD;
    const gananciaNetaManual = gananciaBrutaManual * 0.698;

    return {
      margen: margenDeseado,
      ventaSugeridaUSD: formatNumber(ventaSugeridaUSD),
      ventaSugeridaARS: formatNumber(ventaSugeridaARS),
      precioFinalSugerido: formatNumber(precioFinalSugerido),
      gananciaBrutaSugerida: formatNumber(gananciaBrutaSugerida),
      gananciaNetaSugerida: formatNumber(gananciaNetaSugerida),
      ventaManual: formatNumber(ventaManual),
      ventaManualIVA: formatNumber(ventaManualIVA),
      gananciaBrutaManual: formatNumber(gananciaBrutaManual),
      gananciaNetaManual: formatNumber(gananciaNetaManual)
    };
  };

  const recalcularUtilidad = () => {
    if (!resultado?.cashflow?.usd) return;
    const cashflowUSD = parseFloat(resultado.cashflow.usd.replace(/\./g, '').replace(/,/g, '.'));
    const utilidad = calcularUtilidad(cashflowUSD);
    setResultado((prev) => ({ ...prev, utilidad }));
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded shadow-lg ring-1 ring-slate-200">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Calculadora de Costos</h1>
        <p className="text-slate-500 text-sm">Herramienta para estimar costos de importación con márgenes de utilidad</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6 grid gap-4 md:grid-cols-2">
          <div>
            <Label>Valor FOB (USD)</Label>
            <Input type="number" value={fob} onChange={(e) => setFob(parseFloat(e.target.value))} />
          </div>
          <div>
            <Label>Flete internacional (USD)</Label>
            <Input type="number" value={flete} onChange={(e) => setFlete(parseFloat(e.target.value))} />
          </div>
          <div>
            <Label>Tipo de cambio (ARS/USD)</Label>
            <Input type="number" value={tipoCambio} onChange={(e) => setTipoCambio(parseFloat(e.target.value))} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4 mb-8">
        <Button size="lg" onClick={calcular}>Calcular</Button>
      </div>

      {resultado && (
        <Card className="mb-10">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Costos en Aduana</h2>
            <Separator />
            {Object.entries(resultado).filter(([k]) =>
              ["derechos", "tasa", "iva", "ivaAdic", "ganancias", "iibb", "tasaSim"].includes(k)
            ).map(([key, val]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize text-sm text-gray-600">{key.replace(/([A-Z])/g, " $1")}</span>
                <span className="font-mono text-sm">{val.usd} USD / {val.ars} ARS</span>
              </div>
            ))}
            <div className="flex justify-between font-semibold text-base mt-2 text-green-700">
              <span>Total Aduana:</span>
              <span>{resultado.totalAduana.usd} USD / {resultado.totalAduana.ars} ARS</span>
            </div>

            <h2 className="text-xl font-semibold text-gray-800">Gastos de Despacho</h2>
            <Separator />
            {Object.entries(resultado.despacho).filter(([k]) => k !== "total").map(([key, val]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize text-sm text-gray-600">{key.replace(/([A-Z])/g, " $1")}</span>
                <span className="font-mono text-sm">{val.usd} USD / {val.ars} ARS</span>
              </div>
            ))}
            <div className="flex justify-between font-semibold text-base mt-2 text-green-700">
              <span>Total Despacho:</span>
              <span>{resultado.despacho.total.usd} USD / {resultado.despacho.total.ars} ARS</span>
            </div>

            <h2 className="text-xl font-semibold text-gray-800">Cashflow Total</h2>
            <Separator />
            <div className="flex justify-between text-blue-800 font-bold text-lg">
              <span>Total:</span>
              <span>{resultado.cashflow.usd} USD / {resultado.cashflow.ars} ARS</span>
            </div>

            <h2 className="text-xl font-semibold text-gray-800">Utilidad y Precio de Venta</h2>
            <Separator />
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Margen deseado (%)</Label>
                <Input type="number" value={margenDeseado} onChange={(e) => setMargenDeseado(parseFloat(e.target.value))} />
              </div>
              <div>
                <Label>Precio de venta manual (USD sin IVA)</Label>
                <Input type="number" value={ventaManual} onChange={(e) => setVentaManual(parseFloat(e.target.value))} />
              </div>
            </div>
            <div className="flex justify-end mb-4">
              <Button onClick={recalcularUtilidad}>Recalcular utilidad</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Precio según margen deseado</h3>
                <div className="flex justify-between"><span>Venta sugerida:</span><span>{resultado.utilidad.ventaSugeridaUSD} USD</span></div>
                <div className="flex justify-between"><span>Con IVA:</span><span>{resultado.utilidad.precioFinalSugerido} USD</span></div>
                <div className="flex justify-between text-green-700"><span>Ganancia neta:</span><span>{resultado.utilidad.gananciaNetaSugerida} USD</span></div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Precio según valor manual</h3>
                <div className="flex justify-between"><span>Con IVA:</span><span>{resultado.utilidad.ventaManualIVA} USD</span></div>
                <div className="flex justify-between"><span>Ganancia neta:</span><span>{resultado.utilidad.gananciaNetaManual} USD</span></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
