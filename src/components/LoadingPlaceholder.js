import React from "react";
import ContentLoader, { Rect } from "react-content-loader/native";

export const TransactionPlaceholder = () => (
    <ContentLoader height={90}>
        <Rect x="10" y="28" rx="4" ry="4" width="70" height="50" />
        <Rect x="105" y="30" rx="4" ry="4" width="100" height="13" />
        <Rect x="105" y="47" rx="4" ry="4" width="150" height="13" />
        <Rect x="300" y="41" rx="4" ry="4" width="100" height="25" />
        <Rect x="105" y="65" rx="3" ry="3" width="150" height="10" />
    </ContentLoader>
);

export const ProductPlaceholder = () => (
    <ContentLoader height={70}>
        <Rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
        <Rect x="80" y="10" rx="4" ry="4" width="150" height="13" />
        <Rect x="80" y="27" rx="4" ry="4" width="100" height="13" />
        <Rect x="300" y="22" rx="4" ry="4" width="100" height="25" />
        <Rect x="80" y="45" rx="3" ry="3" width="200" height="10" />
    </ContentLoader>
)