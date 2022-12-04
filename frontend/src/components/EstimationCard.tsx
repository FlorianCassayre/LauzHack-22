import React, { Fragment, useMemo } from 'react';
import { GetClassification } from '../api/types';
import { Card, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const costs = {
    car: 5,
    truck: 8,
    pedestrian: -1,
    cyclist: -2,
} as any;

interface EstimationCardProps {
    classification: Awaited<ReturnType<GetClassification>> | null;
}

export const EstimationCard: React.FC<EstimationCardProps> = ({ classification }) => {
    const groupedClassification = useMemo(() => {
        if (classification) {
            const grouped: Partial<Record<number, typeof classification>> = {};
            classification.forEach(row => {
               const [xmin, ymin, xmax, ymax, confidence, clazz, name] = row;
               if (grouped[clazz] === undefined) {
                   grouped[clazz] = [];
               }
               grouped[clazz]!.push(row);
            });
            return Object.entries(grouped).map(([key, values]) => [parseInt(key), values] as const).sort(([, a], [, b]) => (b ?? []).length - (a ?? []).length);
        } else {
            return undefined;
        }
    }, [classification]);
    return (
        <Card variant="outlined" sx={{ textAlign: 'center' }}>
            {classification ? (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Criteria</TableCell>
                            <TableCell>Count</TableCell>
                            <TableCell>Cost</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {groupedClassification!.map(([category, values], i) => (
                            <Fragment key={category}>
                                <TableRow>
                                    <TableCell>
                                        {values![0][6][0].toUpperCase() + values![0][6].slice(1)}
                                    </TableCell>
                                    <TableCell>
                                        {(values ?? []).length}
                                    </TableCell>
                                    <TableCell>
                                        <span style={{ color: costs[(values ?? [])[0][6]] > 0 ? 'red' : costs[(values ?? [])[0][6]] < 0 ? 'green' : undefined }}>
                                            {costs[(values ?? [])[0][6]] ?? 0}
                                        </span>
                                        {' '} × {(values ?? []).length}
                                    </TableCell>
                                </TableRow>
                            </Fragment>
                        ))}
                        <TableRow>
                            <TableCell>
                                <strong>Total</strong>
                            </TableCell>
                            <TableCell>
                                {classification.length}
                            </TableCell>
                            <TableCell>
                                {classification.map(arr => costs[arr[6]] || 0).reduceRight((a, b) => a + b)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            ) : (
                <CircularProgress sx={{ my: 2 }} />
            )}
        </Card>
    );
};
