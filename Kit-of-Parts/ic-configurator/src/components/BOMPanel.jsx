import { PARTS } from './partsData'

export default function BOMPanel({ selectedVariants, visible, onClose }) {
  function getVariant(part) {
    const idx = selectedVariants[part.id] ?? 0
    return part.variants[idx]
  }

  function exportCSV() {
    const headers = ['Component', 'Type', 'Variant', 'Visible', 'Weight (kg)', 'Unit Cost (USD)']
    const rows = PARTS.map((part) => {
      const v = getVariant(part)
      return [
        part.id,
        v.meta,
        v.label,
        visible[part.id] ? 'Yes' : 'No',
        v.weight_kg,
        v.unit_cost_usd,
      ]
    })
    const totalWeight = PARTS.filter(p => visible[p.id]).reduce((sum, p) => sum + getVariant(p).weight_kg, 0)
    const totalCost = PARTS.filter(p => visible[p.id]).reduce((sum, p) => sum + getVariant(p).unit_cost_usd, 0)
    rows.push(['', '', '', 'TOTALS', totalWeight, totalCost])

    const csv = [headers, ...rows]
      .map((r) => r.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'IC-BOM.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const activeParts = PARTS.filter((p) => visible[p.id])
  const totalWeight = activeParts.reduce((sum, p) => sum + getVariant(p).weight_kg, 0)
  const totalCost = activeParts.reduce((sum, p) => sum + getVariant(p).unit_cost_usd, 0)

  return (
    <div className="bom-panel">
      <div className="bom-header">
        <span className="bom-title">Bill of Materials</span>
        <button className="bom-close" onClick={onClose}>✕</button>
      </div>

      <table className="bom-table">
        <thead>
          <tr>
            <th>Component</th>
            <th>Variant</th>
            <th>kg</th>
            <th>USD</th>
          </tr>
        </thead>
        <tbody>
          {PARTS.map((part) => {
            const v = getVariant(part)
            const isHidden = !visible[part.id]
            return (
              <tr key={part.id} className={isHidden ? 'bom-row--hidden' : ''}>
                <td>
                  <span className="bom-swatch" style={{ background: v.color }} />
                  {part.id}
                </td>
                <td className="bom-variant">{v.label}</td>
                <td className="bom-num">{v.weight_kg.toLocaleString()}</td>
                <td className="bom-num">{v.unit_cost_usd.toLocaleString()}</td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="bom-total">
            <td colSpan={2}>Active Totals ({activeParts.length} components)</td>
            <td className="bom-num">{totalWeight.toLocaleString()}</td>
            <td className="bom-num">${totalCost.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>

      <button className="bom-export" onClick={exportCSV}>
        Export CSV
      </button>
    </div>
  )
}
