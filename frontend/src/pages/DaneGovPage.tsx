import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Download, Database, Search } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
} from '@tanstack/react-table';
import type { FoundItem } from '../utils/database';

export const DaneGovPage = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const items: FoundItem[] = JSON.parse(localStorage.getItem('foundItems') || '[]');

  const columns: ColumnDef<FoundItem>[] = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ getValue }) => {
          const value = getValue() as number;
          return <span className="text-xs">{value}</span>;
        },
      },
      {
        accessorKey: 'person_id',
        header: 'Kod osobisty',
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return value || <span className="text-gray-400 text-xs">brak</span>;
        },
      },
      {
        accessorKey: 'title',
        header: 'Przedmiot',
      },
      {
        accessorKey: 'description',
        header: 'Opis',
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return (
            <div className="max-w-xs truncate" title={value}>
              {value}
            </div>
          );
        },
      },
      {
        accessorKey: 'found_at',
        header: 'Miejsce',
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return (
            <div className="max-w-xs truncate" title={value}>
              {value}
            </div>
          );
        },
      },
      {
        accessorKey: 'date_added',
        header: 'Data dodania',
      },
      {
        accessorKey: 'date_modified',
        header: 'Data modyfikacji',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return (
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                value === 'znalezione'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {value}
            </span>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: items,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 100,
      },
    },
  });

  const handleExportCSV = () => {
    const headers = [
      'id',
      'person_id',
      'title',
      'description',
      'found_at',
      'date_added',
      'date_modified',
      'status',
    ];

    const csvContent = [
      headers.join(','),
      ...items.map((item) =>
        [
          item.id,
          `"${item.person_id}"`,
          `"${item.title}"`,
          `"${item.description}"`,
          `"${item.found_at}"`,
          `"${item.date_added}"`,
          `"${item.date_modified}"`,
          `"${item.status}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `znalezione_rzeczy_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-blue-700 mb-2">Dane Otwarte - znalezione.gov.pl</h2>
        <p className="text-gray-600">
          Publiczny dostęp do danych o znalezionych przedmiotach
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" aria-hidden="true" />
            Baza znalezionych przedmiotów
          </CardTitle>
          <CardDescription>
            Łączna liczba rekordów: {items.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Szukaj w tabeli..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9"
                aria-label="Szukaj w tabeli"
              />
            </div>
            <Button onClick={handleExportCSV} className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" aria-hidden="true" />
              Eksportuj CSV
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className="flex items-center gap-2">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: ' ↑',
                              desc: ' ↓',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                        Brak danych do wyświetlenia
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-3 text-sm text-gray-900">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Strona {table.getState().pagination.pageIndex + 1} z {table.getPageCount()}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Poprzednia
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Następna
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base text-blue-900">O danych otwartych</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <p>
            • Dane są udostępniane w formacie CSV zgodnie z zasadami otwartych danych
          </p>
          <p>• Aktualizacja danych następuje w czasie rzeczywistym</p>
          <p>
            • Możliwość wyszukiwania, sortowania i filtrowania bezpośrednio w przeglądarce
          </p>
          <p>• Dane można wykorzystać do analiz i wizualizacji</p>
        </CardContent>
      </Card>
    </div>
  );
};