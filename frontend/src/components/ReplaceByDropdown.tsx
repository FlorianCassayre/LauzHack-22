import { Button, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import React from 'react';
import { ReplaceBy } from '../types/ReplaceBy';
import { ArrowDropDown, Forest, Nature, Transform } from '@mui/icons-material';

const replaceByItems: Partial<Record<ReplaceBy, { icon: React.ReactElement, label: string }>> = {
    [ReplaceBy.Tree]: { label: 'Tree', icon: <Nature /> },
    [ReplaceBy.Bush]: { label: 'Bush', icon: <Forest /> },
};

interface ReplaceByDropdownProps {
    onClickReplaceBy: (replaceBy: ReplaceBy) => void;
    disabled: boolean;
}

export const ReplaceByDropdown: React.FC<ReplaceByDropdownProps> = ({ onClickReplaceBy, disabled }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <Button variant="outlined" size="large" onClick={handleClick} startIcon={<ArrowDropDown />} endIcon={<Transform />} disabled={disabled}>
                Replace by
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {Object.entries(replaceByItems).map(([replaceBy, { label, icon }]) => (
                    <MenuItem key={replaceBy} onClick={() => onClickReplaceBy(replaceBy as ReplaceBy)}>
                        <ListItemIcon>
                            {icon}
                        </ListItemIcon>
                        <ListItemText>
                            {label}
                        </ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};
