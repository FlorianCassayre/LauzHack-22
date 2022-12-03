import React, { useEffect, useMemo, useState } from 'react';
import { Button, Container, Stack } from '@mui/material';
import { FileSelectCard } from './FileSelectCard';
import { MainAppBar } from './MainAppBar';
import { Delete } from '@mui/icons-material';

export const Homepage: React.FC = () => {
    const [fileSelected, setFileSelected] = useState<File | null>(null);
    const [fileRead, setFileRead] = useState<string | null>(null);
    useEffect(() => {
        if (fileSelected) {
            const reader = new FileReader();
            reader.onload = () => {
                setFileRead(reader.result as string);
            };
            reader.readAsDataURL(fileSelected);
        } else {
            setFileRead(null);
        }
    }, [fileSelected]);

    const handleFileSelected = (file: File) => {
        setFileSelected(file);
    };
    const handleResetFile = () => {
        setFileSelected(null);
        setFileRead(null);
    }

    return (
        <>
            <MainAppBar />
            <Container sx={{ my: 3 }}>
                {!fileSelected && (
                    <FileSelectCard onFileSelected={handleFileSelected} />
                )}
                {!!fileRead && (
                    <Stack direction="column" justifyContent="center">
                        <Button variant="outlined" startIcon={<Delete />} onClick={handleResetFile} sx={{ mb: 2 }}>
                            Remove file
                        </Button>
                        <img src={fileRead} alt="Preview" />
                    </Stack>
                )}
            </Container>
        </>
    );
}
