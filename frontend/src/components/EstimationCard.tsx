import React, { Fragment, useMemo } from 'react';
import { GetClassification } from '../api/types';
import { Card, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const costs = {
    car: 5,
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
            return Object.entries(grouped).map(([key, values]) => [parseInt(key), values] as const);
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
                            <TableCell>Element</TableCell>
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
                                        {costs[(values ?? [])[0][6]]}
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
                                {classification.map(arr => costs[arr[6]]).reduceRight((a, b) => a + b)}
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
