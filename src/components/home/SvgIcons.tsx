// src/components/SvgIcons.tsx

import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Svg, { Path } from "react-native-svg";

const styles = StyleSheet.create({
  icons: {
    alignSelf: "center",
  },
  icon: {
    fontSize: 20,
  },
});

export const SearchIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={styles.icons}>
    <Path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#9199A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M21 21L16.65 16.65" stroke="#9199A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const PlusIcon = () => (
  <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <Path d="M14 23.3326H24.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M19.25 4.08394C19.7141 3.61981 20.3436 3.35907 21 3.35907C21.325 3.35907 21.6468 3.42308 21.9471 3.54746C22.2474 3.67183 22.5202 3.85413 22.75 4.08394C22.9798 4.31376 23.1621 4.58658 23.2865 4.88685C23.4109 5.18712 23.4749 5.50894 23.4749 5.83394C23.4749 6.15895 23.4109 6.48077 23.2865 6.78104C23.1621 7.0813 22.9798 7.35413 22.75 7.58394L8.16667 22.1673L3.5 23.3339L4.66667 18.6673L19.25 4.08394Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const Plus2Icon = () => (
  <Svg width="34" height="34" viewBox="0 0 34 34" fill="none">
    <Path d="M22.8333 21C28.3561 21 32.8333 16.5228 32.8333 11C32.8333 5.47715 28.3561 1 22.8333 1C17.3104 1 12.8333 5.47715 12.8333 11C12.8333 16.5228 17.3104 21 22.8333 21Z" fill="#4052E2"/>
    <Path d="M22.8333 7V15" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M18.8333 11H26.8333" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M13.4167 11.084H5.08333C4.5308 11.084 4.00089 11.3035 3.61019 11.6942C3.21949 12.0849 3 12.6148 3 13.1673V29.834C3 30.3865 3.21949 30.9164 3.61019 31.3071C4.00089 31.6978 4.5308 31.9173 5.08333 31.9173H17.5833C18.1359 31.9173 18.6658 31.6978 19.0565 31.3071C19.4472 30.9164 19.6667 30.3865 19.6667 29.834V17.334L13.4167 11.084Z" stroke="#4052E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M15.4998 22.541H7.1665" stroke="#4052E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M15.4998 26.709H7.1665" stroke="#4052E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M15.8788 18.0918H11.3333H6.78784" stroke="#4052E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const ChevronLeftIcon = () => <Text style={styles.icon}>‹</Text>;
export const ChevronRightIcon = () => <Text style={styles.icon}>›</Text>;