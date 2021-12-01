import Users from "./Users";
import React from "react";
import Search from "./pages/search";
import Maps from "./pages/maps";
import Home from "./pages/home";
import MainMap from "./pages/mainMap";
import UserProfile from './pages/UserProfile';
import HistoricalMap from "./pages/compareMaps";
import NewPassword from "./pages/NewPassword";

export const ROUTES = [
    {
        path: "/login",
        exact: true,
        component: (routeData, getRouteData) => <Users routeData = {routeData} getRouteData={getRouteData}/>

    },
    {
        path: "/search",
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
        path: "/maps/compare",
        exact: true,
        component: (routeData, getRouteData) => <HistoricalMap routeData = {routeData} getRouteData={getRouteData}/>
    },
    {
        path: "/maps/:mapID",
        exact: true,
        component: (routeData, getRouteData) => <Maps routeData = {routeData} getRouteData={getRouteData}/>
    },
    {
        path: "/maps/:mapID/:queryYear",
        exact: true,
        component: (routeData, getRouteData) => <Maps routeData = {routeData} getRouteData={getRouteData}/>
    },
    {
        path: "/UserProfile/:id/:isCandidateString",
        exact: true,
        component: (routeData, getRouteData) => <UserProfile routeData = {routeData} getRouteData={getRouteData}/>
    },
    {
        path: "/UserProfile",
        exact: true,
        component: (routeData, getRouteData) => <UserProfile routeData = {routeData} getRouteData={getRouteData}/>
    },
    {
        path: "/NewPassword",
        exact: true,
        component: (routeData, getRouteData) => <NewPassword routeData = {routeData} getRouteData={getRouteData}/>
    }

]
