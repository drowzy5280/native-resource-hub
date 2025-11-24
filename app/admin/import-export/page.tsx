'use client'

import { useState } from 'react'
import Link from 'next/link'

type EntityType = 'resources' | 'scholarships' | 'tribes'

export default function ImportExportPage() {
  const [selectedType, setSelectedType] = useState<EntityType>('resources')
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [result, setResult] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'text/csv') {
      setImportFile(file)
    } else {
      alert('Please select a CSV file')
    }
  }

  const handleImport = async () => {
    if (!importFile) return

    setImporting(true)
    setResult(null)

    try {
      const fileContent = await importFile.text()

      const response = await fetch(`/api/admin/import/${selectedType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/csv' },
        body: fileContent,
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          type: 'success',
          message: `Successfully imported ${data.imported} ${selectedType}. ${data.failed > 0 ? `Failed: ${data.failed}` : ''}`,
        })
        setImportFile(null)
      } else {
        setResult({
          type: 'error',
          message: data.error || 'Import failed',
        })
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: 'An error occurred during import',
      })
    } finally {
      setImporting(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    setResult(null)

    try {
      const response = await fetch(`/api/admin/export/${selectedType}`)

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${selectedType}-export-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        setResult({
          type: 'success',
          message: `${selectedType} exported successfully`,
        })
      } else {
        setResult({
          type: 'error',
          message: 'Export failed',
        })
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: 'An error occurred during export',
      })
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-earth-brown">Import / Export Data</h1>
        <p className="mt-2 text-earth-brown/70">
          Bulk import and export data in CSV format
        </p>
      </div>

      {/* Entity Type Selector */}
      <div className="bg-white rounded-earth-lg shadow-sm border border-earth-sand/30 p-6">
        <label className="block text-sm font-medium text-earth-brown mb-3">
          Select Data Type
        </label>
        <div className="flex gap-4">
          {(['resources', 'scholarships', 'tribes'] as EntityType[]).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-3 rounded-earth font-medium transition-colors ${
                selectedType === type
                  ? 'bg-earth-teal text-white'
                  : 'bg-earth-sand/20 text-earth-brown hover:bg-earth-sand/30'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white rounded-earth-lg shadow-sm border border-earth-sand/30 p-6">
        <h2 className="text-xl font-bold text-earth-brown mb-4">Import from CSV</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-earth-brown mb-2">
              Select CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="block w-full text-sm text-earth-brown file:mr-4 file:py-2 file:px-4 file:rounded-earth file:border-0 file:text-sm file:font-semibold file:bg-earth-teal file:text-white hover:file:bg-earth-teal/90 cursor-pointer"
            />
            {importFile && (
              <p className="mt-2 text-sm text-earth-brown/70">
                Selected: {importFile.name}
              </p>
            )}
          </div>

          <div className="bg-earth-sand/10 p-4 rounded-earth">
            <h3 className="font-semibold text-earth-brown mb-2">CSV Format Requirements:</h3>
            <ul className="text-sm text-earth-brown/70 space-y-1 list-disc list-inside">
              {selectedType === 'resources' && (
                <>
                  <li>Required columns: type, title, description</li>
                  <li>Optional: url, state, tribeId, tags (semicolon-separated), eligibility (semicolon-separated)</li>
                </>
              )}
              {selectedType === 'scholarships' && (
                <>
                  <li>Required columns: name, description</li>
                  <li>Optional: amount, deadline (YYYY-MM-DD), url, tags (semicolon-separated), eligibility (semicolon-separated)</li>
                </>
              )}
              {selectedType === 'tribes' && (
                <>
                  <li>Required columns: name</li>
                  <li>Optional: federalRecognitionStatus, website, region, enrollmentOffice</li>
                </>
              )}
            </ul>
          </div>

          <button
            onClick={handleImport}
            disabled={!importFile || importing}
            className="px-6 py-3 bg-earth-teal text-white rounded-earth hover:bg-earth-teal/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {importing ? 'Importing...' : 'Import Data'}
          </button>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-earth-lg shadow-sm border border-earth-sand/30 p-6">
        <h2 className="text-xl font-bold text-earth-brown mb-4">Export to CSV</h2>

        <p className="text-sm text-earth-brown/70 mb-4">
          Download all {selectedType} as a CSV file for backup or editing
        </p>

        <button
          onClick={handleExport}
          disabled={exporting}
          className="px-6 py-3 bg-earth-sage text-white rounded-earth hover:bg-earth-sage/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? 'Exporting...' : `Export ${selectedType}`}
        </button>
      </div>

      {/* Result Message */}
      {result && (
        <div
          className={`p-4 rounded-earth ${
            result.type === 'success'
              ? 'bg-earth-sage/10 border border-earth-sage/30 text-earth-sage'
              : 'bg-earth-rust/10 border border-earth-rust/30 text-earth-rust'
          }`}
        >
          {result.message}
        </div>
      )}

      {/* Back Link */}
      <div className="text-center">
        <Link
          href="/admin"
          className="text-earth-teal hover:text-earth-teal/80 font-medium"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>
    </div>
  )
}
