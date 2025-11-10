
import { useState, useMemo, useEffect, memo } from 'react';
import { ChevronLeft, ChevronRight, Search, ArrowUpDown, ArrowUp, ArrowDown, Download, Filter, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DataRow } from '@/types/data';
import { getDataSummary } from '@/utils/dataAnalysis';
import { DataTableSkeleton } from './skeletons';
import { VirtualizedTable } from './VirtualizedTable';
import { useDebounce } from '@/hooks/usePerformance';
import { isLargeDataset } from '@/utils/performance';
import { 
  getTableAriaLabel, 
  getPaginationAriaLabel, 
  getSortAriaLabel,
  getSearchAriaLabel,
  handleKeyboardClick 
} from '@/utils/accessibility';
import { useScreenReaderAnnouncement } from '@/hooks/useAccessibility';

interface DataTableProps {
  data: DataRow[];
}

type SortDirection = 'asc' | 'desc' | null;

const DataTable = memo(({ data }: DataTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [columnFilter, setColumnFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [useVirtualization, setUseVirtualization] = useState(false);

  // Debounce search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Check if dataset is large enough to benefit from virtualization
  const isLarge = useMemo(() => isLargeDataset(data.length), [data.length]);

  // Screen reader announcements
  const { announce } = useScreenReaderAnnouncement();

  // Simulate table rendering
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  const summary = useMemo(() => getDataSummary(data), [data]);
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    // Filter by search term (using debounced value)
    if (debouncedSearchTerm) {
      filtered = data.filter(row => 
        Object.values(row).some(value => 
          String(value).toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )
      );
    }

    // Filter by column type
    if (columnFilter !== 'all') {
      const columnsOfType = Object.entries(summary.columnTypes)
        .filter(([_, type]) => type === columnFilter)
        .map(([column, _]) => column);
      
      filtered = filtered.map(row => {
        const filteredRow: DataRow = {};
        columnsOfType.forEach(col => {
          if (col in row) filteredRow[col] = row[col];
        });
        return filteredRow;
      });
    }

    // Sort data
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        // Handle null/undefined values
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return sortDirection === 'asc' ? 1 : -1;
        if (bVal == null) return sortDirection === 'asc' ? -1 : 1;
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        
        if (sortDirection === 'asc') {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      });
    }

    return filtered;
  }, [data, debouncedSearchTerm, sortColumn, sortDirection, columnFilter, summary.columnTypes]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleSort = (column: string) => {
    let newDirection: SortDirection = 'asc';
    
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        newDirection = 'desc';
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        newDirection = null;
        setSortDirection(null);
        setSortColumn(null);
        announce(`Sorting removed from ${column} column`);
        setCurrentPage(1);
        return;
      } else {
        newDirection = 'asc';
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    
    setCurrentPage(1);
    const direction = newDirection === 'asc' ? 'ascending' : 'descending';
    announce(`Table sorted by ${column} in ${direction} order`);
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return <ArrowUpDown className="h-3 w-3 opacity-50" />;
    if (sortDirection === 'asc') return <ArrowUp className="h-3 w-3" />;
    if (sortDirection === 'desc') return <ArrowDown className="h-3 w-3" />;
    return <ArrowUpDown className="h-3 w-3 opacity-50" />;
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'number') {
      // Format large numbers with proper separators
      if (Math.abs(value) >= 1000) {
        return value.toLocaleString();
      }
      // Format decimal numbers
      if (value % 1 !== 0) {
        return value.toFixed(2);
      }
      return value.toString();
    }
    if (typeof value === 'boolean') {
      return value ? '✓' : '✗';
    }
    return String(value);
  };

  const getColumnType = (column: string) => {
    return summary.columnTypes[column] || 'text';
  };

  const exportFilteredData = () => {
    const visibleColumns = columnFilter === 'all' ? columns : 
      Object.entries(summary.columnTypes)
        .filter(([_, type]) => type === columnFilter)
        .map(([column, _]) => column);

    const csvContent = [
      visibleColumns.join(','),
      ...filteredAndSortedData.map(row => 
        visibleColumns.map(col => formatValue(row[col])).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `filtered_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const visibleColumns = columnFilter === 'all' ? columns : 
    Object.entries(summary.columnTypes)
      .filter(([_, type]) => type === columnFilter)
      .map(([column, _]) => column);

  // Show skeleton while loading (after all hooks are called)
  if (isLoading) {
    return <DataTableSkeleton rows={itemsPerPage} columns={columns.length || 5} />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <CardTitle className="flex items-center gap-2 flex-wrap">
            Data Explorer
            <span className="text-sm font-normal text-muted-foreground" aria-label={`Showing ${filteredAndSortedData.length.toLocaleString()} of ${data.length.toLocaleString()} rows`}>
              ({filteredAndSortedData.length.toLocaleString()} of {data.length.toLocaleString()} rows)
            </span>
            {isLarge && (
              <Badge variant="secondary" className="flex items-center gap-1" aria-label="Large dataset detected">
                <Zap className="h-3 w-3" aria-hidden="true" />
                Large Dataset
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            {isLarge && (
              <Button
                variant={useVirtualization ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setUseVirtualization(!useVirtualization);
                  announce(useVirtualization ? 'Virtual scrolling disabled' : 'Virtual scrolling enabled');
                }}
                className="flex items-center gap-2"
                aria-label={useVirtualization ? 'Disable virtual scrolling' : 'Enable virtual scrolling for better performance'}
                aria-pressed={useVirtualization}
              >
                <Zap className="h-4 w-4" aria-hidden="true" />
                {useVirtualization ? 'Virtual Mode' : 'Enable Virtual Scrolling'}
              </Button>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Search all data..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 w-full sm:w-[250px]"
                aria-label={getSearchAriaLabel(filteredAndSortedData.length, data.length)}
                aria-describedby="search-description"
              />
              <span id="search-description" className="sr-only">
                Search through all data columns. Results update as you type.
              </span>
            </div>
            
            <Select value={columnFilter} onValueChange={(value) => {
              setColumnFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Columns</SelectItem>
                <SelectItem value="numeric">Numeric Only</SelectItem>
                <SelectItem value="text">Text Only</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={exportFilteredData} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Virtualized Table for Large Datasets */}
        {useVirtualization && isLarge ? (
          <VirtualizedTable
            data={filteredAndSortedData}
            columns={visibleColumns}
            formatValue={formatValue}
            containerHeight={600}
          />
        ) : (
          <>
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <Table aria-label={getTableAriaLabel(filteredAndSortedData.length, visibleColumns.length, debouncedSearchTerm !== '')}>
                  <TableHeader>
                    <TableRow>
                      {visibleColumns.map((column) => (
                        <TableHead 
                          key={column} 
                          className="cursor-pointer hover:bg-muted/50 transition-colors select-none"
                          onClick={() => handleSort(column)}
                          onKeyDown={(e) => handleKeyboardClick(e, () => handleSort(column))}
                          tabIndex={0}
                          role="button"
                          aria-label={getSortAriaLabel(column, sortColumn === column ? sortDirection : null)}
                          aria-sort={
                            sortColumn === column 
                              ? sortDirection === 'asc' 
                                ? 'ascending' 
                                : sortDirection === 'desc'
                                ? 'descending'
                                : 'none'
                              : 'none'
                          }
                        >
                          <div className="flex items-center justify-between min-w-[100px]">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{column}</span>
                              <span 
                                className={`text-xs px-1.5 py-0.5 rounded ${
                                  getColumnType(column) === 'numeric' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                                  getColumnType(column) === 'boolean' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                                  'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                }`}
                                aria-label={`Column type: ${getColumnType(column)}`}
                              >
                                {getColumnType(column)}
                              </span>
                            </div>
                            <span aria-hidden="true">{getSortIcon(column)}</span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length === 0 ? (
                      <TableRow>
                        <TableCell 
                          colSpan={visibleColumns.length} 
                          className="text-center py-8 text-muted-foreground"
                        >
                          {debouncedSearchTerm ? `No results found for "${debouncedSearchTerm}"` : 'No data available'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedData.map((row, index) => (
                        <TableRow 
                          key={index}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          {visibleColumns.map((column) => (
                            <TableCell 
                              key={column}
                              className={`${
                                getColumnType(column) === 'numeric' ? 'text-right font-mono' : ''
                              }`}
                            >
                              {formatValue(row[column])}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Enhanced Pagination - Hidden in virtual mode */}
            {!useVirtualization && (
              <nav 
                className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4"
                aria-label="Table pagination"
              >
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div role="status" aria-live="polite" aria-atomic="true">
                    Showing {Math.min(filteredAndSortedData.length, (currentPage - 1) * itemsPerPage + 1)} to{' '}
                    {Math.min(filteredAndSortedData.length, currentPage * itemsPerPage)} of{' '}
                    {filteredAndSortedData.length.toLocaleString()} entries
                    {debouncedSearchTerm && ` (filtered from ${data.length.toLocaleString()} total)`}
                  </div>
            
                  <Select 
                    value={itemsPerPage.toString()} 
                    onValueChange={(value) => {
                      const newValue = parseInt(value);
                      setItemsPerPage(newValue);
                      setCurrentPage(1);
                      announce(`Showing ${newValue} rows per page`);
                    }}
                    aria-label="Rows per page"
                  >
                    <SelectTrigger className="w-20" aria-label={`${itemsPerPage} rows per page`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
          
                <div className="flex items-center gap-2" role="group" aria-label="Pagination controls">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentPage(1);
                      announce('Navigated to first page');
                    }}
                    disabled={currentPage === 1}
                    aria-label="Go to first page"
                  >
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentPage(currentPage - 1);
                      announce(`Navigated to page ${currentPage - 1}`);
                    }}
                    disabled={currentPage === 1}
                    aria-label="Go to previous page"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Previous</span>
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    <label htmlFor="page-input" className="text-sm">Page</label>
                    <Input
                      id="page-input"
                      type="number"
                      value={currentPage}
                      onChange={(e) => {
                        const page = parseInt(e.target.value);
                        if (page >= 1 && page <= totalPages) {
                          setCurrentPage(page);
                          announce(`Navigated to page ${page}`);
                        }
                      }}
                      className="w-16 h-8 text-center"
                      min={1}
                      max={totalPages}
                      aria-label={getPaginationAriaLabel(currentPage, totalPages)}
                    />
                    <span className="text-sm" aria-label={`of ${totalPages} pages`}>of {totalPages}</span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentPage(currentPage + 1);
                      announce(`Navigated to page ${currentPage + 1}`);
                    }}
                    disabled={currentPage === totalPages}
                    aria-label="Go to next page"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Next</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentPage(totalPages);
                      announce(`Navigated to last page, page ${totalPages}`);
                    }}
                    disabled={currentPage === totalPages}
                    aria-label="Go to last page"
                  >
                    Last
                  </Button>
                </div>
              </nav>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
});

DataTable.displayName = 'DataTable';

export default DataTable;
