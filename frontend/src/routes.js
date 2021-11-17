import Users from "./Users";
import React from "react";
import Search from "./pages/search";
import Maps from "./pages/maps";
import Home from "./pages/home";
import MainMap from "./pages/mainMap";

export const ROUTES = [
    {
        path: "/login",
        exact: true,
        component: (routeData, getRouteData) => <Users routeData = {routeData} getRouteData={getRouteData}/>

    },
    {
        path: "/candidateSearch",
        exact: true,
        component: (routeData, getRouteData) => <Search routeData = {routeData} getRouteData={getRouteData}/>
    },
    {
        path: "/maps",
        exact: true,
        component: (routeData, getRouteData) => <Maps routeData = {routeData} getRouteData={getRouteData}/>
    },
    {
        path: "/",
        exact: true,
        component: (routeData, getRouteData) => <Home routeData = {routeData} getRouteData={getRouteData}/>
    },
    {
        path: "/maps/:mapID",
        exact: true,
        component: (routeData, getRouteData) => <MainMap {...routeData} routeData = {routeData} getRouteData={getRouteData}/>
    }
]
