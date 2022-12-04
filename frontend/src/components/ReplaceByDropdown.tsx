import {Button, Card, ListItemIcon, ListItemText, Menu, MenuItem} from '@mui/material';
import React from 'react';
import { ReplaceBy } from '../types/ReplaceBy';
import {
    AddRoad,
    ArrowDropDown, AutoFixHigh,
    ChildCare,
    DirectionsBike,
    Forest,
    Nature,
    Park, Person, Redeem,
    Signpost,
    Transform,
} from '@mui/icons-material';

const replaceByItems: Partial<Record<ReplaceBy, { icon: React.ReactElement, label: string }>> = {
    [ReplaceBy.Tree]: { label: 'Tree', icon: <Nature /> },
    [ReplaceBy.Bush]: { label: 'Bush', icon: <Forest /> },
    [ReplaceBy.Park]: { label: 'Park', icon: <Park /> },
    [ReplaceBy.Bicycle]: { label: 'Bicycle', icon: <DirectionsBike /> },
    [ReplaceBy.Playground]: { label: 'Playground', icon: <ChildCare /> },
    [ReplaceBy.Road]: { label: 'Road', icon: <Signpost /> },
    [ReplaceBy.DiCaprio]: { label: 'DiCaprio', icon: <Person /> },
    [ReplaceBy.Suprise]: { label: 'Suprise', icon: <Redeem /> },
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
            <Button variant="outlined" size="large" onClick={handleClick} startIcon={<AutoFixHigh />} endIcon={<ArrowDropDown />} disabled={disabled}>
                Replace selection
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
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
