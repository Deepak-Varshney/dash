import React from 'react';
import { useUser } from '@clerk/nextjs';

export const CellActionWrapper = ({
    row,
    CellActionComponent,
}: {
    row: any;
    CellActionComponent: React.ComponentType<{ data: any }>;
}) => {
    const { user } = useUser();

    if (user?.publicMetadata?.role !== 'admin') return null;

    return <CellActionComponent data={row.original} />;
};