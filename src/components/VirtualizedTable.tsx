import { memo, useCallback, useRef } from 'react';
import { useVirtualScroll } from '@/hooks/usePerformance';
import { DataRow } from '@/types/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface VirtualizedTableProps {
    data: DataRow[];
    columns: string[];
    rowHeight?: number;
    containerHeight?: number;
    formatValue?: (value: any) => string;
    onRowClick?: (row: DataRow) => void;
}

// Memoized table row component to prevent unnecessary re-renders
const VirtualTableRow = memo(({
    row,
    columns,
    formatValue,
    onClick
}: {
    row: DataRow;
    columns: string[];
    formatValue?: (value: any) => string;
    onClick?: () => void;
}) => {
    const defaultFormat = (value: any) => {
        if (value === null || value === undefined) return '-';
        if (typeof value === 'number') {
            if (Math.abs(value) >= 1000) return value.toLocaleString();
            if (value % 1 !== 0) return value.toFixed(2);
            return value.toString();
        }
        if (typeof value === 'boolean') return value ? '✓' : '✗';
        return String(value);
    };

    const format = formatValue || defaultFormat;

    return (
        <TableRow
            className="hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={onClick}
        >
            {columns.map((column) => (
                <TableCell key={column} className="py-3">
                    {format(row[column])}
                </TableCell>
            ))}
        </TableRow>
    );
});

VirtualTableRow.displayName = 'VirtualTableRow';

export const VirtualizedTable = memo(({
    data,
    columns,
    rowHeight = 53, // Default row height in pixels
    containerHeight = 600,
    formatValue,
    onRowClick,
}: VirtualizedTableProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const {
        visibleItems,
        totalHeight,
        offsetY,
        handleScroll,
        visibleRange,
    } = useVirtualScroll(data, containerHeight, rowHeight);

    const handleRowClick = useCallback((row: DataRow) => {
        if (onRowClick) {
            onRowClick(row);
        }
    }, [onRowClick]);

    return (
        <div className="relative border rounded-md">
            {/* Table Header - Fixed */}
            <div className="sticky top-0 z-10 bg-background border-b">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={column} className="font-semibold">
                                    {column}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                </Table>
            </div>

            {/* Scrollable Container */}
            <div
                ref={containerRef}
                className="overflow-auto"
                style={{ height: containerHeight }}
                onScroll={handleScroll}
            >
                {/* Spacer for total height */}
                <div style={{ height: totalHeight, position: 'relative' }}>
                    {/* Visible rows container */}
                    <div
                        style={{
                            transform: `translateY(${offsetY}px)`,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                        }}
                    >
                        <Table>
                            <TableBody>
                                {visibleItems.map((row, index) => (
                                    <VirtualTableRow
                                        key={visibleRange.start + index}
                                        row={row}
                                        columns={columns}
                                        formatValue={formatValue}
                                        onClick={() => handleRowClick(row)}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Info footer */}
            <div className="border-t px-4 py-2 text-sm text-muted-foreground bg-muted/30">
                Showing rows {visibleRange.start + 1} - {Math.min(visibleRange.end, data.length)} of {data.length.toLocaleString()}
            </div>
        </div>
    );
});

VirtualizedTable.displayName = 'VirtualizedTable';
