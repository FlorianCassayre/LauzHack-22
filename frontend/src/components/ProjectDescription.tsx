import React from 'react';
import { Typography } from '@mui/material';

export const ProjectDescription: React.FC = () => {
    return (
        <div>
            <Typography variant="h6">Inspiration</Typography>
            <Typography paragraph textAlign="justify">
                "Globally, there has been a steady decline in urban tree cover. Urban trees can help cities achieve 15 of the 17 UN sustainability goals" (World Economic Forum, 2022).
                Green spaces provide a multitude of health, social, biodiversity, economic and of course environmental benefits (natural climate control and Carbone Dioxide vacuums).
                Many communes, cities or campuses (such as EPFL) want to be more sustainable. Indeed, it can be difficult for these institutions to plan these changes as it requires the help from experts (designers and landscape architects).
            </Typography>
            <Typography variant="h6">What it does</Typography>
            <Typography paragraph textAlign="justify">
                Our sustAInability application detects automatically the objects (e.g. cars, people, roads) from your images via different sources (phone, webcam, file) and replaces it with sustainable objects (eg. Tree, Bush, Park, Bicycle, Playgrounds) which will make the space more pleasant for the citizens, students or employees.
            </Typography>
            <Typography variant="h6">How we built it</Typography>
            <Typography paragraph textAlign="justify">
                Our application is divided into three components:
            </Typography>
            <ul style={{ marginBottom: 0 }}>
                <li>
                    Back-end with the "Stablehorde" diffusion API and "Yolo V5"-model for object detection
                </li>
                <li>
                    Application Interface with FastAPI
                </li>
                <li>
                    Front-end with Material UI
                </li>
            </ul>
        </div>
    );
};
