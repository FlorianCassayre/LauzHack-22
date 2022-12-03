import React, { ChangeEventHandler, useRef } from 'react';
import { Alert, Box, Card, CardActionArea, CardContent, Stack } from '@mui/material';
import { FileUpload } from '@mui/icons-material';

interface FileSelectCardProps {
    onFileSelected: (file: File) => void;
    disabled: boolean;
}

export const FileSelectCard: React.FC<FileSelectCardProps> = ({ onFileSelected, disabled }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (fileInputRef.current !== null) {
            fileInputRef.current.click();
        }
    };
    const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (fileInputRef.current !== null) {
            const { files } = fileInputRef.current;
            if (files && files.length > 0) {
                const file = files[0];
                onFileSelected(file);
            }
        }
    };
    return (
        <>
            <Alert severity="info" sx={{ mb: 2 }}>
                To get started, select or drop a file below.
            </Alert>
            <input
                type="file"
                hidden
                onChange={handleFileChange}
                ref={fileInputRef}
            />
            <Card variant="outlined" sx={{ width: '100%', borderStyle: 'dashed' }}>
                <CardActionArea onClick={handleClick} disabled={disabled}>
                    <CardContent sx={{ my: 6 }}>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                            <FileUpload color="action" />
                            <Box color="text.secondary">
                                Upload a file...
                            </Box>
                        </Stack>
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    )
};
