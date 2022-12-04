import {Button, ListItemIcon, ListItemText, Menu, MenuItem} from '@mui/material';
import React from 'react';
import { ReplaceBy } from '../types/ReplaceBy';
import {
    ArrowDropDown, AutoFixHigh,
    Nature,
} from '@mui/icons-material';

const replaceByItems = {
    car: { label: 'All cars by trees', icon: <Nature /> }
};

interface ReplaceFeatureDropdownProps {
    onClickReplaceBy: (replaceBy: ReplaceBy) => void;
    disabled: boolean;
}

export const ReplaceFeatureDropdown: React.FC<ReplaceFeatureDropdownProps> = ({ onClickReplaceBy, disabled }) => {
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
            <Button variant="outlined" size="large" onClick={handleClick} startIcon={<ArrowDropDown />} endIcon={<AutoFixHigh />} disabled={disabled}>
                Replace auto
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
